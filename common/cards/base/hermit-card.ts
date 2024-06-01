import {AttackModel} from '../../models/attack-model'
import {GameModel} from '../../models/game-model'
import {
	Card,
	OverridesDetach,
	HasHermitType,
	HasHealth,
	OverridesAttach,
	HermitDisplayInfo,
	GivesPointOnKnockout,
	isCardDefaults,
	hasHermitTypeDefaults,
	canAttackDefaults,
	hermitDisplayInfoDefaults,
	givesPointOnKnockoutDefaults,
	hasHealthDefaults,
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
import { IsAttachable, combinators, isAttachableDefaults } from './attachable'

export type HermitCard = Card &
	IsAttachable &
	HasHermitType &
	HasHealth &
	HermitDisplayInfo &
	GivesPointOnKnockout &
	CanAttack

export const hermitCardDefaults = {
	...isCardDefaults,
	...isAttachableDefaults,
	...hasHermitTypeDefaults,
	...hasHealthDefaults,
	...hermitDisplayInfoDefaults,
	...givesPointOnKnockoutDefaults,
	...canAttackDefaults,
	category: 'hermit' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	canBeAttachedTo: combinators.every(combinators.player, combinators.hermit),
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
