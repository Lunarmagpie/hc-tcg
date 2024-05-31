import {ItemCard, itemCardDefaults} from '../../base/item-card'

const PranksterCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_prankster_common',
		numericId: 50,
		name: 'Prankster',
		rarity: 'common',
		hermitType: 'prankster',
	}
}

export default PranksterCommonItemCard
