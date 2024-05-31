import {ItemCard, itemCardDefaults} from '../../base/item-card'

const BuilderCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_builder_Common',
		numericId: 50,
		name: 'Builder',
		rarity: 'common',
		hermitType: 'builder',
	}
}

export default BuilderCommonItemCard
