import {AttackModel} from '../../models/attack-model'
import {GameModel} from '../../models/game-model'
import {
	Card,
	IsAttachableToHermitSlots,
	OverridesDetach,
	HasHermitType,
	HasHealth,
	OverridesAttach,
	HermitDisplayInfo,
	HermitAttack,
	GivesPointOnKnockout,
    isCardDefaults,
    isAttachableToEffectSlotsDefaults,
    hasHermitTypeDefaults,
    canAttackDefaults,
    hermitDisplayInfoDefaults,
    givesPointOnKnockoutDefaults,
    hasHealthDefaults,
    isAttachableToHermitSlotsDefaults,
} from './card'
import {
	CardCategoryT,
	CardRarityT,
	HermitAttackInfo,
	HermitTypeT,
	PlayCardLog,
} from '../../types/cards'
import {HermitAttackType} from '../../types/attack'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'

export type HermitCard = Card &
	IsAttachableToHermitSlots &
	HasHermitType &
	HasHealth &
	HermitAttack &
	HermitDisplayInfo &
	GivesPointOnKnockout

export const hermitCardDefaults = {
	...isCardDefaults,
	...isAttachableToHermitSlotsDefaults,
	...hasHermitTypeDefaults,
	...hasHealthDefaults,
	...canAttackDefaults,
	...hermitDisplayInfoDefaults,
	...givesPointOnKnockoutDefaults,
	category: 'hermit' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	getBackground(this: Card) {
		return this.id.split('_')[0]
	},
	getShortName(this: Card) {
		return null
	},
	getDescription(this: Card & HermitAttack) {
		return formatText(
			(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
				(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
		)
	},
	log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${values.pos.name}$`,
	sidebarDescriptions: [],
}

// Default is to return
function createAttackModel(
	game: GameModel,
	hermit: Card & HermitAttack,
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
		attack.addDamage(hermit, hermit.primary.damage)
	} else if (hermitAttackType == 'secondary') {
		attack.addDamage(hermit, hermit.secondary.damage)
	}

	return attack
}

function getActions(game: GameModel): TurnActions {
	const {currentPlayer} = game

	// Is there a hermit slot free on the board
	const spaceForHermit = currentPlayer.board.rows.some((row) => !row.hermitCard)

	return spaceForHermit ? ['PLAY_HERMIT_CARD'] : []
}

// export function getFormattedDescription(): FormattedTextNode {
// 	return formatText(
// 		(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
// 			(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
// 	)
// }

export function getHermitCardDefaults(name: string) {
	return {
		log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${name}$`,
	}
}
