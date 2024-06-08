import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class WelsknightCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'welsknight_common',
			numericId: 106,
			name: 'Wels',
			rarity: 'common',
			hermitType: 'builder',
			health: 300,
			primary: {
				name: 'Chivalry',
				cost: ['any'],
				damage: 40,
				power: null,
			},
			secondary: {
				name: 'Judgement',
				cost: ['builder', 'builder', 'any'],
				damage: 90,
				power: null,
			},
		})
	}
}

export default WelsknightCommonHermitCard
