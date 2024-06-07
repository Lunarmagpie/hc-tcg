import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'
import {CardCategoryT, PlayCardLog} from '../../types/cards'
import {formatText} from '../../utils/formatting'
import attachableTo from './attachable'
import {
	isCardDefaults,
	HasHermitType,
	hasHermitTypeDefaults,
	itemDisplayInfoDefaults,
	ItemDisplayInfo,
	HasBattleLog,
	hasBattleLogDefaults,
	CardProps,
} from './card'

export type ItemCard = CardProps & HasHermitType & ItemDisplayInfo

export const itemCardDefaults = {
	...isCardDefaults,
	...hasHermitTypeDefaults,
	...itemDisplayInfoDefaults,
	...hasBattleLogDefaults,
	category: 'item' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	canBeAttachedTo: attachableTo.every(attachableTo.player, attachableTo.item),
	getBackground(this: CardProps) {
		return this.id.split('_')[0]
	},
	getDescription(this: CardProps) {
		return formatText('')
	},
	log: (values: PlayCardLog) =>
		`$p{You|${values.player}}$ attached $m${values.pos.name}$ to $p${values.pos.hermitCard}$`,
	sidebarDescriptions: [],
	getEnergy(this: CardProps & HasHermitType, game: GameModel, pos: CardPosModel) {
		if (this.rarity === 'rare') return [this.hermitType, this.hermitType]
		return [this.hermitType]
	},
}

abstract class ItemCard extends Card {
	public hermitType: HermitTypeT

	constructor(defs: ItemDefs) {
		super({
			type: 'item',
			id: defs.id,
			numericId: defs.numericId,
			name: defs.name,
			rarity: defs.rarity,
		})

		this.hermitType = defs.hermitType

		this.updateLog(
			(values) =>
				`$p{You|${values.player}}$ attached $m${values.pos.name}$ to $p${values.pos.hermitCard}$`
		)
	}

	public abstract getEnergy(game: GameModel, instance: string, pos: CardPosModel): Array<EnergyT>
}

export default ItemCard
