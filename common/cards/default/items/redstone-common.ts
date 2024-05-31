import {ItemCard, itemCardDefaults} from '../../base/item-card'

const RedstoneCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_redstone_Common',
		numericId: 50,
		name: 'Redstone',
		rarity: 'common',
		hermitType: 'redstone',
	}
}

export default RedstoneCommonItemCard
