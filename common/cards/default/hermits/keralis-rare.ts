import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach} from '../../base/card'
import {GameModel} from '../../../models/game-model'
import {CardPosModel} from '../../../models/card-pos-model'
<<<<<<< HEAD
import {getNonEmptyRows} from '../../../utils/board'
import {PlayerState} from '../../../types/game-state'
=======
import {getActiveRow, getNonEmptyRows} from '../../../utils/board'
>>>>>>> upstream/dev

const KeralisRareHermitCard = (): HermitCard & HasAttach => {
	let chosenPlayer: PlayerState | null = null
	let pickedRowIndex: number | null = null

	return {
		...hermitCardDefaults,
		id: 'keralis_rare',
		numericId: 72,
		name: 'Keralis',
		rarity: 'rare',
		hermitType: 'terraform',
		health: 250,
		primary: {
			name: 'Booshes',
			cost: ['any'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Sweet Face',
			cost: ['terraform', 'terraform', 'any'],
			damage: 0,
			power: 'Heal any AFK Hermit 100hp.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			// Pick the hermit to heal
			player.hooks.getAttackRequests.add(this, (activeHermit, hermitAttackType) => {
				// Make sure we are attacking
				if (activeHermit !== this) return

				// Only secondary attack
				if (hermitAttackType !== 'secondary') return

				// Make sure there is something to select
				const playerHasAfk = getNonEmptyRows(player, true).some(
					(rowPos) => rowPos.row.hermitCard !== undefined
				)
				const opponentHasAfk = getNonEmptyRows(opponentPlayer, true).some(
					(rowPos) => rowPos.row.hermitCard !== undefined
				)
				if (!playerHasAfk && !opponentHasAfk) return

				game.addPickRequest({
					playerId: player.id,
					id: this.id,
					message: 'Pick an AFK Hermit from either side of the board',
					onResult(pickResult) {
						const pickedPlayer = game.state.players[pickResult.playerId]
						const rowIndex = pickResult.rowIndex
						if (rowIndex === undefined) return 'FAILURE_INVALID_SLOT'
						if (rowIndex === pickedPlayer.board.activeRow) return 'FAILURE_INVALID_SLOT'

						if (pickResult.slot.type !== 'hermit') return 'FAILURE_INVALID_SLOT'
						if (!pickResult.card) return 'FAILURE_INVALID_SLOT'

						// Make sure it's an actual hermit card
						if (!pickResult.card) return 'FAILURE_INVALID_SLOT'

						// Store the info to use later
						chosenPlayer = pickedPlayer
						pickedRowIndex = rowIndex

						return 'SUCCESS'
					},
					onTimeout() {
						// We didn't pick anyone to heal, so heal no one
					},
				})
			})

			// Heals the afk hermit *before* we actually do damage
			player.hooks.onAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || attack.type !== 'secondary') return

				if (!chosenPlayer || !pickedRowIndex) return

				const pickedRow = chosenPlayer.board.rows[pickedRowIndex]
				if (!pickedRow || !pickedRow.hermitCard) return

<<<<<<< HEAD
				// Heal
				const maxHealth = Math.max(pickedRow.health, pickedRow.hermitCard.health)
				pickedRow.health = Math.min(pickedRow.health + 100, maxHealth)
=======
			const pickedHermitInfo = HERMIT_CARDS[pickedRow.hermitCard.cardId]
			const activeHermit = getActiveRow(player)?.hermitCard
			if (!activeHermit) return
			const activeHermitName = HERMIT_CARDS[activeHermit.cardId].name

			if (pickedHermitInfo && activeHermitName) {
				// Heal
				const maxHealth = Math.max(pickedRow.health, pickedHermitInfo.health)
				pickedRow.health = Math.min(pickedRow.health + 100, maxHealth)

				game.battleLog.addEntry(
					player.id,
					`$p${pickedHermitInfo.name} (${
						pickedRowIndex + 1
					})$ was healed $g100hp$ by $p${activeHermitName}$`
				)
			}
>>>>>>> upstream/dev

				game.battleLog.addEntry(
					player.id,
					`$p${pickedHermitInfo.name} (${
						pickedRowIndex + 1
					})$ was healed $g100hp$ by $p${activeHermitName}$`
				)
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.getAttackRequests.remove(this)
			player.hooks.onAttack.remove(this)
		},
	}
}

export default KeralisRareHermitCard
