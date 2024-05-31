import {ItemCard, itemCardDefaults} from '../../base/item-card'

const FarmCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_farm_common',
		numericId: 50,
		name: 'Farm',
		rarity: 'common',
		hermitType: 'farm',
	}
}

export default FarmCommonItemCard
