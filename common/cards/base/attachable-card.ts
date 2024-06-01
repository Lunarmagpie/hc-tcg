import {
	EffectDisplayInfo,
	HasDescription,
	Card,
	HasAttach,
	effectDisplayInfoDefaults,
	hasDescriptionDefaults,
	isCardDefaults,
	overridesAttachDefaults,
} from './card'
import combinators from './attachable'
import {CARDS} from '..'
import {GameModel} from '../../models/game-model'
import {PlayCardLog, CardRarityT, CardCategoryT} from '../../types/cards'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'

export type AttachableCard = Card & EffectDisplayInfo & HasDescription & HasAttach & OverridesDetach

export const attachableCardDefaults = {
	...isCardDefaults,
	...effectDisplayInfoDefaults,
	...hasDescriptionDefaults,
	...overridesAttachDefaults,
	...overridesDetachDefaults,
	log: (values: PlayCardLog) => `$p{You|${values.player}}$ attached $e${values.pos.name}$ to $p${values.pos.hermitCard}$`,
	canBeAttachedTo: combinators.every(combinators.player, combinators.effect),
	category: 'attachable' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: Card & HasDescription) {
		return formatText(this.description)
	},
}
