import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class JoeHillsCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'joehills_common',
			numericId: 69,
			name: 'Joe',
			rarity: 'common',
			hermitType: 'explorer',
			health: 270,
			primary: {
				name: 'Howdy',
				cost: ['any'],
				damage: 30,
				power: null,
			},
			secondary: {
				name: 'Haiku',
				cost: ['explorer', 'explorer', 'any'],
				damage: 90,
				power: null,
			},
		})
	}
}

export default JoeHillsCommonHermitCard
