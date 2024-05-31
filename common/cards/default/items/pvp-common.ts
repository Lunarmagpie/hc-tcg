import {ItemCard, itemCardDefaults} from '../../base/item-card'

const PvPCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_pvp_common',
		numericId: 50,
		name: 'PvP',
		rarity: 'common',
		hermitType: 'pvp',
	}
}

export default PvPCommonItemCard
