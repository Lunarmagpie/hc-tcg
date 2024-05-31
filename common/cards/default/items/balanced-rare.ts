import {ItemCard, itemCardDefaults} from '../../base/item-card'

const BalancedRareItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_balanced_rare',
		numericId: 50,
		name: 'Balanced',
		rarity: 'rare',
		hermitType: 'balanced',
	}
}

export default BalancedRareItemCard
