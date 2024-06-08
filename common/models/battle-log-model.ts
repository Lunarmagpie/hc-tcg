import {CurrentCoinFlipT, PlayerState, RowStateWithHermit, BattleLogT} from '../types/game-state'
import {broadcast} from '../../server/src/utils/comm'
import {AttackModel} from './attack-model'
import {CardPosModel} from './card-pos-model'
import {GameModel} from './game-model'
import {formatText} from '../utils/formatting'
import {DEBUG_CONFIG} from '../config'
import {Card} from '../cards/base/card'
import {PickInfo} from '../types/server-requests'
import {StatusEffect} from '../status-effects/status-effect'

export class BattleLogModel {
	private game: GameModel
	private logMessageQueue: Array<BattleLogT>

	constructor(game: GameModel) {
		this.game = game

		/** Log entries that still need to be processed */
		this.logMessageQueue = []
	}

	private generateEffectEntryHeader(card: Card | null): string {
		const currentPlayer = this.game.currentPlayer.playerName
		if (!card) return ''

		return `$p{You|${currentPlayer}}$ used $e${card.props.name}$ `
	}

	private generateCoinFlipDescription(coinFlip: CurrentCoinFlipT): string {
		const heads = coinFlip.tosses.filter((flip) => flip === 'heads').length
		const tails = coinFlip.tosses.filter((flip) => flip === 'tails').length

		if (coinFlip.tosses.length === 1) {
			return heads > tails ? `flipped $gheads$` : `flipped $btails$`
		} else if (tails === 0) {
			return `flipped $g${heads} heads$`
		} else if (heads === 0) {
			return `flipped $b${tails} tails$`
		} else {
			return `flipped $g${heads} heads$ and $b${tails} tails$`
		}
	}

	private generateCoinFlipMessage(
		attack: AttackModel,
		coinFlips: Array<CurrentCoinFlipT>
	): string | null {
		const entry = coinFlips.reduce((r: string | null, coinFlip) => {
			const description = this.generateCoinFlipDescription(coinFlip)

			if (coinFlip.opponentFlip) return r
			if (coinFlip.card.props.category === 'hermit' && attack.type === 'effect') return r
			if (coinFlip.card.props.category === 'single_use' && attack.type !== 'effect') return r

			return description
		}, null)

		return entry
	}

	public async sendLogs() {
		while (this.logMessageQueue.length > 0) {
			const firstEntry = this.logMessageQueue.shift()
			if (!firstEntry) continue

			this.game.chat.push({
				createdAt: Date.now(),
				message: formatText(firstEntry.description, {censor: true}),
				sender: firstEntry.player,
				systemMessage: true,
			})
		}

		await new Promise((e) =>
			setTimeout(
				e,
				this.game.currentPlayer.coinFlips.reduce((r, flip) => r + flip.delay, 0)
			)
		)

		broadcast(this.game.getPlayers(), 'CHAT_UPDATE', this.game.chat)
	}

	public addPlayCardEntry(
		card: Card,
		pos: CardPosModel,
		coinFlips: Array<CurrentCoinFlipT>,
		pickInfo?: PickInfo
	) {
		const getCardName = (
			player: PlayerState | undefined,
			cardId: string | undefined,
			rowIndex: number | null | undefined
		) => {
			if (!cardId) return invalid
			if (card.props.category === 'item') {
				return `${card.props.name} ${card.props.rarity === 'rare' ? ' item x2' : 'item'}`
			}

			if (
				card.props.category === 'hermit' &&
				player &&
				player.board.activeRow !== rowIndex &&
				rowIndex !== null &&
				rowIndex !== undefined
			) {
				return `${card.props.name} (${rowIndex + 1})`
			}

			return `${card.props.name}`
		}

		const thisFlip = coinFlips.find((flip) => flip.card === card)
		const invalid = '$bINVALID VALUE$'

		const pickInfoPlayer = () => {
			if (!pickInfo) return undefined
			if (this.game.currentPlayer.id === pickInfo.playerId) return this.game.currentPlayer
			return this.game.opponentPlayer
		}

		const pickedPlayer = pickInfoPlayer()

		const logMessage = card.getLog({
			player: pos.player.playerName,
			opponent: pos.opponentPlayer.playerName,
			coinFlip: thisFlip ? this.generateCoinFlipDescription(thisFlip) : '',
			defaultLog: `$p{You|${pos.player.playerName}}$ used $e${card.props.name}$`,
			pos: {
				rowIndex: pos.rowIndex ? `${pos.rowIndex + 1}` : invalid,
				id: pos.card ? pos.card.props.id : invalid,
				name: pos.card ? getCardName(pos.player, pos.card.props.id, pos.rowIndex) : invalid,
				hermitCard: pos.row?.hermitCard
					? getCardName(pos.player, pos.row.hermitCard.props.id, pos.rowIndex)
					: invalid,
				slotType: pos.slot.type,
			},
			pick: {
				rowIndex:
					pickInfo && pickInfo.rowIndex !== undefined ? `${pickInfo.rowIndex + 1}` : invalid,
				id: pickInfo?.card ? pickInfo.card.props.id : invalid,
				name: pickInfo?.card
					? getCardName(pickedPlayer, pickInfo.card.props.id, pickInfo.rowIndex)
					: invalid,
				hermitCard:
					pickInfo && pickInfo.rowIndex !== null && pickInfo.rowIndex !== undefined && pickedPlayer
						? getCardName(
								pickedPlayer,
								pickedPlayer.board.rows[pickInfo.rowIndex].hermitCard?.props.id,
								pickInfo.rowIndex
						  )
						: invalid,
				slotType: pickInfo ? pickInfo.slot.type : invalid,
			},
		})

		this.logMessageQueue.unshift({
			player: pos.player.id,
			description: logMessage,
		})

		this.sendLogs()
	}

	public addAttackEntry(
		attack: AttackModel,
		coinFlips: Array<CurrentCoinFlipT>,
		singleUse: Card | null
	) {
		const attacker = attack.getAttacker()
		if (!attacker) return
		const playerId = attacker.player.id

		if (!playerId) return

		const attacks = [attack, ...attack.nextAttacks]

		let log = attacks.reduce((reducer, subAttack) => {
			const attacker = subAttack.getAttacker()
			const target = subAttack.getTarget()

			if (subAttack.type !== attack.type) {
				this.addAttackEntry(subAttack, coinFlips, singleUse)
				return reducer
			}

			if (!attacker || !target) return reducer

			if (subAttack.getDamage() === 0) return reducer

			const attackingHermit = attacker.row.hermitCard
			const targetHermit = target.row.hermitCard

			const targetFormatting = target.player.id === playerId ? 'p' : 'o'

			const rowNumberString =
				target.player.board.activeRow === target.rowIndex ? '' : `(${target.rowIndex + 1})`

			const attackName =
				subAttack.type === 'primary'
					? attackingHermit.props.primary.name
					: attackingHermit.props.secondary.name

			const logMessage = subAttack.getLog({
				attacker: `$p${attackingHermit.props.name}$`,
				player: attacker.player.playerName,
				opponent: target.player.playerName,
				target: `$${targetFormatting}${targetHermit.props.name} ${rowNumberString}$`,
				attackName: `$v${attackName}$`,
				damage: `$b${subAttack.calculateDamage()}hp$`,
				defaultLog: this.generateEffectEntryHeader(singleUse),
				coinFlip: this.generateCoinFlipMessage(attack, coinFlips),
			})

			reducer += logMessage

			return reducer
		}, '' as string)

		if (log.length === 0) return

		log += DEBUG_CONFIG.logAttackHistory
			? attack.getHistory().reduce((reduce, hist) => {
					return reduce + `\n\t${hist.source} → ${hist.type} ${hist.value}`
			  }, '')
			: ''

		this.logMessageQueue.push({
			player: playerId,
			description: log,
		})
	}

	public opponentCoinFlipEntry(coinFlips: Array<CurrentCoinFlipT>) {
		const player = this.game.currentPlayer
		// Opponent coin flips
		coinFlips.forEach((coinFlip) => {
			const cardName = coinFlip.card.props.name
			if (!coinFlip.opponentFlip) return

			this.logMessageQueue.push({
				player: player.id,
				description: `$o${cardName}$ ${this.generateCoinFlipDescription(
					coinFlip
				)} on their coinflip`,
			})
		})
	}

	public addEntry(player: string, entry: string) {
		this.logMessageQueue.push({
			player: player,
			description: entry,
		})
	}

	public addChangeRowEntry(
		player: PlayerState,
		newRow: number,
		oldHermit: Card | null,
		newHermit: Card | null
	) {
		if (!newHermit) return

		if (oldHermit) {
			this.logMessageQueue.push({
				player: player.id,
				description: `$p{You|${player.playerName}}$ swapped $p${oldHermit.props.name}$ for $p${
					newHermit.props.name
				} (${newRow + 1})$`,
			})
		} else {
			this.logMessageQueue.push({
				player: player.id,
				description: `$p{You|${player.playerName}}$ activated $p${newHermit.props.name} (${
					newRow + 1
				})$`,
			})
		}
	}

	public addDeathEntry(player: PlayerState, row: RowStateWithHermit) {
		const card = row.hermitCard

		const livesRemaining = player.lives === 3 ? 'two lives' : 'one life'

		this.logMessageQueue.push({
			player: player.id,
			description: `$p${card.props.name}$ was knocked out, and $p{you|${player.playerName}}$ now {have|has} $b${livesRemaining}$ remaining`,
		})
		this.sendLogs()
	}

	public addTurnEndEntry() {
		this.game.chat.push({
			createdAt: Date.now(),
			message: {TYPE: 'LineNode'},
			sender: this.game.opponentPlayer.id,
			systemMessage: true,
		})

		broadcast(this.game.getPlayers(), 'CHAT_UPDATE', this.game.chat)
	}

	public addRemoveStatusEffectEntry(statusEffect: StatusEffect) {
		this.logMessageQueue.push({
			player: this.game.currentPlayer.id,
			description: `$e${statusEffect.props.name}$ wore off`,
		})
		this.sendLogs()
	}
}
