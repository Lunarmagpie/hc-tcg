import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class FalseSymmetryCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'falsesymmetry_common',
			numericId: 22,
			name: 'False',
			rarity: 'common',
			hermitType: 'pvp',
			health: 250,
			primary: {
				name: 'Queen of Hearts',
				cost: ['pvp'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Eagle Eye',
				cost: ['pvp', 'any'],
				damage: 70,
				power: null,
			},
		})
	}
}

export default FalseSymmetryCommonHermitCard
