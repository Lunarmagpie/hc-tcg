import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class XisumavoidCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'xisumavoid_common',
			numericId: 111,
			name: 'Xisuma',
			rarity: 'common',
			hermitType: 'farm',
			health: 300,
			primary: {
				name: 'Oh My Days',
				cost: ['farm'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Jeez',
				cost: ['farm', 'farm', 'any'],
				damage: 90,
				power: null,
			},
		})
	}
}

export default XisumavoidCommonHermitCard
