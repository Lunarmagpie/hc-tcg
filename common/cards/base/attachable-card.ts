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
import attachableTo from './attachable'
import {CARDS} from '..'
import {GameModel} from '../../models/game-model'
import {PlayCardLog, CardRarityT, CardCategoryT} from '../../types/cards'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'

export type AttachableCard = Card & EffectDisplayInfo & HasDescription & HasAttach

export const attachableCardDefaults = {
	...isCardDefaults,
	...effectDisplayInfoDefaults,
	...hasDescriptionDefaults,
	...overridesAttachDefaults,
	log: (values: PlayCardLog) => `$p{You|${values.player}}$ attached $e${values.pos.name}$ to $p${values.pos.hermitCard}$`,
	canBeAttachedTo: attachableTo.every(attachableTo.player, attachableTo.effect),
	category: 'attachable' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: Card & HasDescription) {
		return formatText(this.description)
	},
}
