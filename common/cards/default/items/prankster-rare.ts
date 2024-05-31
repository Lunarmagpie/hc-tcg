import {ItemCard, itemCardDefaults} from '../../base/item-card'

const ExplorerRareItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_explorer_rare',
		numericId: 50,
		name: 'Explorer',
		rarity: 'rare',
		hermitType: 'explorer',
	}
}

export default ExplorerRareItemCard
