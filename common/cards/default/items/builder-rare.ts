import {ItemCard, itemCardDefaults} from '../../base/item-card'

const BuilderRareItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_builder_rare',
		numericId: 50,
		name: 'Builder',
		rarity: 'rare',
		hermitType: 'builder',
	}
}

export default BuilderRareItemCard
