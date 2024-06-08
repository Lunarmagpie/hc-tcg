import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class Cubfan135CommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'cubfan135_common',
			numericId: 9,
			name: 'Cub',
			rarity: 'common',
			hermitType: 'balanced',
			health: 290,
			primary: {
				name: 'Heyo',
				cost: ['balanced'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Vex Magic',
				cost: ['balanced', 'any'],
				damage: 70,
				power: null,
			},
		})
	}
}

export default Cubfan135CommonHermitCard
