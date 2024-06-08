import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class BdoubleO100CommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'bdoubleo100_common',
			numericId: 0,
			name: 'Bdubs',
			rarity: 'common',
			hermitType: 'builder',
			health: 260,
			primary: {
				name: 'Gradient',
				cost: ['builder'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Prettystone',
				cost: ['builder', 'builder'],
				damage: 80,
				power: null,
			},
		})
	}
}

export default BdoubleO100CommonHermitCard
