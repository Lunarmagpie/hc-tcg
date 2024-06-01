import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'
import {CardCategoryT, PlayCardLog} from '../../types/cards'
import {formatText} from '../../utils/formatting'
import combinators from './attachable'
import {
	Card,
	isCardDefaults,
	HasHermitType,
	hasHermitTypeDefaults,
	itemDisplayInfoDefaults,
	ItemDisplayInfo,
	HasBattleLog,
	hasBattleLogDefaults,
} from './card'

export type ItemCard = Card & HasHermitType & ItemDisplayInfo

export const itemCardDefaults = {
	...isCardDefaults,
	...hasHermitTypeDefaults,
	...itemDisplayInfoDefaults,
	...hasBattleLogDefaults,
	category: 'item' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	canBeAttachedTo: combinators.every(combinators.player, combinators.item),
	getBackground(this: Card) {
		return this.id.split('_')[0]
	},
	getDescription(this: Card) {
		return formatText('')
	},
	log: (values: PlayCardLog) =>
		`$p{You|${values.player}}$ attached $m${values.pos.name}$ to $p${values.pos.hermitCard}$`,
	sidebarDescriptions: [],
	getEnergy(this: Card & HasHermitType, game: GameModel, pos: CardPosModel) {
		if (this.rarity === 'rare') return [this.hermitType, this.hermitType]
		return [this.hermitType]
	},
}
