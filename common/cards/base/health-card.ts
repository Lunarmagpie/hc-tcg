import {HasHealth, IsCard, hasHealthDefaults, isCardDefaults} from './card'
import {TextNode} from '../../utils/formatting'

export type HealthCard = IsCard & HasHealth

export const HealthIndicator = (): HealthCard => {
	return {
		...isCardDefaults,
		...hasHealthDefaults,
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
		log: null,
	}
}

export default HealthCard
