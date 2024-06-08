import {HasHealth, Card, hasHealthDefaults, isCardDefaults} from './card'
import {TextNode} from '../../utils/formatting'
import attachableTo from './attachable'

export type HealthCard = Card & HasHealth

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
			return TextNode('')
		},
		expansion: 'default',
		palette: 'default',
		sidebarDescriptions: [],
		log: [],
	}
}

export default HealthCard
