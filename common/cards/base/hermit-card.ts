import {GameModel} from '../../models/game-model'
<<<<<<< HEAD
import {
	Card,
	HasHermitType,
	HasHealth,
	HermitDisplayInfo,
	GivesPointOnKnockout,
	isCardDefaults,
	hasHermitTypeDefaults,
	canAttackDefaults,
	hermitDisplayInfoDefaults,
	givesPointOnKnockoutDefaults,
	hasHealthDefaults,
	CanAttack,
	CardProps,
} from './card'
import {CardCategoryT, PlayCardLog} from '../../types/cards'
import {TurnActions} from '../../types/game-state'
import {formatText} from '../../utils/formatting'
import attachableTo from './attachable'
import {HermitAttackType} from '../../types/attack'
import {CardPosModel} from '../../models/card-pos-model'
import {AttackModel} from '../../models/attack-model'
=======
import Card, {CanAttachResult} from './card'
import {CardRarityT, HermitAttackInfo, HermitTypeT, PlayCardLog} from '../../types/cards'
import {HermitAttackType} from '../../types/attack'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'
>>>>>>> upstream/dev

export type HermitCard = CardProps &
	HasHermitType &
	HasHealth &
	HermitDisplayInfo &
	GivesPointOnKnockout &
	CanAttack

<<<<<<< HEAD
export const hermitCardDefaults = {
	...isCardDefaults,
	...hasHermitTypeDefaults,
	...hasHealthDefaults,
	...hermitDisplayInfoDefaults,
	...givesPointOnKnockoutDefaults,
	...canAttackDefaults,
	category: 'hermit' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	canBeAttachedTo: attachableTo.every(attachableTo.player, attachableTo.hermit),
	getBackground(this: HermitCard) {
=======
// To ensure Armor Stand has the same log as HermitCards, this is exportable.
export function hermitCardBattleLog(name: string) {
	return (values: PlayCardLog) =>
		`$p{You|${values.player}}$ placed $p${name}$ on row #${values.pos.rowIndex}`
}

abstract class HermitCard extends Card {
	public hermitType: HermitTypeT
	public health: number
	public primary: HermitAttackInfo
	public secondary: HermitAttackInfo

	constructor(defs: HermitDefs) {
		super({
			type: 'hermit',
			id: defs.id,
			numericId: defs.numericId,
			name: defs.name,
			rarity: defs.rarity,
		})

		this.hermitType = defs.hermitType
		this.health = defs.health
		this.primary = defs.primary
		this.secondary = defs.secondary
		this.updateLog(hermitCardBattleLog(this.name))
	}

	public override canAttach(game: GameModel, pos: CardPosModel): CanAttachResult {
		const {currentPlayer} = game

		const result: CanAttachResult = []

		if (pos.slot.type !== 'hermit') result.push('INVALID_SLOT')
		if (pos.player.id !== currentPlayer.id) result.push('INVALID_PLAYER')

		return result
	}

	// Default is to return
	public getAttack(
		game: GameModel,
		instance: string,
		pos: CardPosModel,
		hermitAttackType: HermitAttackType
	): AttackModel | null {
		if (pos.rowIndex === null || !pos.row || !pos.row.hermitCard) return null

		const {opponentPlayer: opponentPlayer} = game
		const targetIndex = opponentPlayer.board.activeRow
		if (targetIndex === null) return null

		const targetRow = opponentPlayer.board.rows[targetIndex]
		if (!targetRow.hermitCard) return null

		// Create an attack with default damage
		const attack = new AttackModel({
			id: this.getInstanceKey(instance),
			attacker: {
				player: pos.player,
				rowIndex: pos.rowIndex,
				row: pos.row,
			},
			target: {
				player: opponentPlayer,
				rowIndex: targetIndex,
				row: targetRow,
			},
			type: hermitAttackType,
			createWeakness: 'ifWeak',
			log: (values) =>
				`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${
					values.target
				} with ${values.attackName} for ${values.damage} damage`,
		})

		if (attack.type === 'primary') {
			attack.addDamage(this.id, this.primary.damage)
		} else if (attack.type === 'secondary') {
			attack.addDamage(this.id, this.secondary.damage)
		}

		return attack
	}

	public override getActions(game: GameModel): TurnActions {
		const {currentPlayer} = game

		// Is there a hermit slot free on the board
		const spaceForHermit = currentPlayer.board.rows.some((row) => !row.hermitCard)

		return spaceForHermit ? ['PLAY_HERMIT_CARD'] : []
	}

	/**
	 * Returns the background to use for this hermit card
	 */
	public getBackground(): string {
>>>>>>> upstream/dev
		return this.id.split('_')[0]
	},
	getShortName(this: HermitCard) {
		return null
	},
	getDescription(this: HermitCard) {
		return formatText(
			(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
				(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
		)
	},
	log: [(values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${values.pos.name}$`],
	sidebarDescriptions: [],
}

function getActions(game: GameModel): TurnActions {
	const {currentPlayer} = game

	// Is there a hermit slot free on the board
	const spaceForHermit = currentPlayer.board.rows.some((row) => !row.hermitCard)

	return spaceForHermit ? ['PLAY_HERMIT_CARD'] : []
}

export function getHermitCardDefaults(name: string) {
	return {
		log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${name}$`,
	}

	public override getFormattedDescription(): FormattedTextNode {
		return formatText(
			(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
				(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
		)
	}
}

/*
 * Get the attack for a specific hermit, using the `GetAttack` interface if needed.
 */
export function getHermitsAttack(
	hermit: Card<CardProps & CanAttack>,
	game: GameModel,
	pos: CardPosModel,
	hermitAttackType: HermitAttackType
) {
	let attack = null
	if (hermit.implementsGetAttack()) {
		attack = hermit.getAttack(game, pos, hermitAttackType)
	} else {
		attack = createHermitAttackModel(hermit, game, pos, hermitAttackType)
	}
	return attack
}

/*
 * Create a AttackModel for a hermit card, ignoring the `GetAttack` interface.
 */
export function createHermitAttackModel(
	hermit: Card<CardProps & CanAttack>,
	game: GameModel,
	pos: CardPosModel,
	hermitAttackType: HermitAttackType
): AttackModel | null {
	if (pos.rowIndex === null || !pos.row || !pos.row.hermitCard) return null

	const {opponentPlayer: opponentPlayer} = game
	const targetIndex = opponentPlayer.board.activeRow
	if (targetIndex === null) return null

	const targetRow = opponentPlayer.board.rows[targetIndex]
	if (!targetRow.hermitCard) return null

	// Create an attack with default damage
	const attack = new AttackModel({
		creator: hermit,
		attacker: {
			player: pos.player,
			rowIndex: pos.rowIndex,
			row: pos.row,
		},
		target: {
			player: opponentPlayer,
			rowIndex: targetIndex,
			row: targetRow,
		},
		type: hermitAttackType,
		createWeakness: 'ifWeak',
		log: (values) =>
			`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${
				values.target
			} with ${values.attackName} for ${values.damage} damage`,
	})

	if (hermitAttackType == 'primary') {
		attack.addDamage(hermit, hermit.props.primary.damage)
	} else if (hermitAttackType == 'secondary') {
		attack.addDamage(hermit, hermit.props.secondary.damage)
	}

	return attack
}
