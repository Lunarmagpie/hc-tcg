import {PlayCardLog, CardRarityT, CardCategoryT} from '../../types/cards'
import {
	AllowAttacks,
	EffectDisplayInfo,
	HasDescription,
	HasAttach,
	isCardDefaults,
	effectDisplayInfoDefaults,
	hasDescriptionDefaults,
	CardProps,
} from './card'
import {GameModel} from '../../models/game-model'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'
import attachableTo from './attachable'

export type SingleUseCard = CardProps & EffectDisplayInfo & HasDescription & HasAttach

export const defaultSingleUseInfo = {
	...isCardDefaults,
	...effectDisplayInfoDefaults,
	...hasDescriptionDefaults,
	canBeAttachedTo: attachableTo.every(attachableTo.player, attachableTo.singleUse),
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: CardProps & HasDescription) {
		return formatText(this.description)
	},
}

export const defaultDamagingSingleUseInfo = {
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: CardProps & HasDescription) {
		return formatText(this.description)
	},
	log: [],
	allowAttacks: false,
}
