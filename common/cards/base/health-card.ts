import {HasHealth, IsCard} from './card'
import {TextNode} from '../../utils/formatting'

export type HealthCard = IsCard & HasHealth

export const HealthIndicator = (): HealthCard => {
	return {
		category: 'health',
		health: 300,
		id: 'health',
		numericId: -1,
		name: 'Health Card',
		rarity: 'common',
		getDescription() {
			return new TextNode('')
		},
		expansion: 'default',
		palette: 'default',
		sidebarDescriptions: [],
		log: () => null,
	}
}

export default HealthCard
