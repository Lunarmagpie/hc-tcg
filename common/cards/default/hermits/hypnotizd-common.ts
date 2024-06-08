import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class HypnotizdCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'hypnotizd_common',
			numericId: 36,
			name: 'Hypno',
			rarity: 'common',
			hermitType: 'balanced',
			health: 250,
			primary: {
				name: 'What Up',
				cost: ['balanced'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Max Attack',
				cost: ['balanced', 'balanced', 'balanced'],
				damage: 100,
				power: null,
			},
		})
	}
}

export default HypnotizdCommonHermitCard
