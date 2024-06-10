import {HasHealth, hasHealthDefaults, isCardDefaults, CardProps, Card} from './card'
import {TextNode} from '../../utils/formatting'
import attachableTo from './attachable'

export type HealthCard = CardProps & HasHealth

class HealthIndicator extends Card<HealthCard> {
	constructor() {
		super({
			...isCardDefaults,
			...hasHealthDefaults,
			category: 'health',
			health: 300,
			id: 'health',
			numericId: -1,
			canBeAttachedTo: attachableTo.nothing,
			name: 'Health Card',
			rarity: 'common',
			getDescription() {
				return TextNode('')
			},
			expansion: 'default',
			palette: 'default',
			sidebarDescriptions: [],
			log: [],
		})
	}
}

export default HealthCard
