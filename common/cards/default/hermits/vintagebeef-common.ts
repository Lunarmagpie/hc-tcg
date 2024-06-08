import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class VintageBeefCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'vintagebeef_common',
			numericId: 102,
			name: 'Beef',
			rarity: 'common',
			hermitType: 'balanced',
			health: 250,
			primary: {
				name: 'Hey Guys!',
				cost: ['any'],
				damage: 30,
				power: null,
			},
			secondary: {
				name: 'Mindcrack',
				cost: ['balanced', 'balanced'],
				damage: 80,
				power: null,
			},
		})
	}
}

export default VintageBeefCommonHermitCard
