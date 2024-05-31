import {ItemCard, itemCardDefaults} from '../../base/item-card'

const BalancedCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_balanced_common',
		numericId: 49,
		name: 'Balanced',
		rarity: 'common',
		hermitType: 'balanced',
	}
}

export default BalancedCommonItemCard
