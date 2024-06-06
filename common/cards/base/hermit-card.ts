import {GameModel} from '../../models/game-model'
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
import { HermitAttackType } from '../../types/attack'
import { CardPosModel } from '../../models/card-pos-model'
import { AttackModel } from '../../models/attack-model'

export type HermitCard = CardProps &
	HasHermitType &
	HasHealth &
	HermitDisplayInfo &
	GivesPointOnKnockout &
	CanAttack

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
	log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${values.pos.name}$`,
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
}

export function getAttack(
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
