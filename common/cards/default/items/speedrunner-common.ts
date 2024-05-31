import {ItemCard, itemCardDefaults} from '../../base/item-card'

const SpeedrunnerCommonItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_speedrunner_Common',
		numericId: 50,
		name: 'Speedrunner',
		rarity: 'common',
		hermitType: 'speedrunner',
	}
}

export default SpeedrunnerCommonItemCard
