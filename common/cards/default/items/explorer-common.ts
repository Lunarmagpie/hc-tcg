import {ItemCard, itemCardDefaults} from '../../base/item-card'

const ExplorerCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_explorer_common',
		numericId: 50,
		name: 'Explorer',
		rarity: 'common',
		hermitType: 'explorer',
	}
}

export default ExplorerCommonItemCard
