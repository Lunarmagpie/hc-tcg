<<<<<<< HEAD
import {HasHealth, Card, hasHealthDefaults, isCardDefaults} from './card'
import {TextNode} from '../../utils/formatting'
import attachableTo from './attachable'
=======
import {GameModel} from '../../models/game-model'
import {CardRarityT} from '../../types/cards'
import Card from './card'
import {CardPosModel} from '../../models/card-pos-model'
import {FormattedTextNode, formatText} from '../../utils/formatting'
>>>>>>> upstream/dev

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

	public override getFormattedDescription(): FormattedTextNode {
		return formatText(`${this.health}`)
	}
}

export default HealthCard
