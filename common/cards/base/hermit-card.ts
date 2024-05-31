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
	GivesPointOnKnockout,
	isCardDefaults,
	isAttachableToEffectSlotsDefaults,
	hasHermitTypeDefaults,
	canAttackDefaults,
	hermitDisplayInfoDefaults,
	givesPointOnKnockoutDefaults,
	hasHealthDefaults,
	isAttachableToHermitSlotsDefaults,
	CanAttack,
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
	HermitDisplayInfo &
	GivesPointOnKnockout &
	CanAttack

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
