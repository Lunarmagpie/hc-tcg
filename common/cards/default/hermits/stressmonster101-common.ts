import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class StressMonster101CommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'stressmonster101_common',
			numericId: 92,
			name: 'Stress',
			rarity: 'common',
			hermitType: 'builder',
			health: 280,
			primary: {
				name: "'Ello",
				cost: ['builder'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Geezer',
				cost: ['builder', 'builder'],
				damage: 80,
				power: null,
			},
		})
	}
}

export default StressMonster101CommonHermitCard
