import {ItemCard, itemCardDefaults} from '../../base/item-card'

const MinerCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_miner_common',
		numericId: 50,
		name: 'Miner',
		rarity: 'common',
		hermitType: 'miner',
	}
}

export default MinerCommonItemCard
