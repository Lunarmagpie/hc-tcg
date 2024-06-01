import {PlayCardLog, CardRarityT, CardCategoryT} from '../../types/cards'
import {
	AllowAttacks,
	EffectDisplayInfo,
	HasDescription,
	Card,
	HasAttach,
	isCardDefaults,
	effectDisplayInfoDefaults,
	hasDescriptionDefaults,
	overridesAttachDefaults,
} from './card'
import {GameModel} from '../../models/game-model'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'
import attachableTo from './attachable'

export type SingleUseCard = Card & EffectDisplayInfo & HasDescription & HasAttach

export const defaultSingleUseInfo = {
	...isCardDefaults,
	...effectDisplayInfoDefaults,
	...hasDescriptionDefaults,
	...overridesAttachDefaults,
	canBeAttachedTo: attachableTo.every(attachableTo.player, attachableTo.singleUse),
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: Card & HasDescription) {
		return formatText(this.description)
	},
}

export const defaultDamagingSingleUseInfo = {
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: Card & HasDescription) {
		return formatText(this.description)
	},
	log: null,
	allowAttacks: false,
}
