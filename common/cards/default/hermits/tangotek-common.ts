import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class TangoTekCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'tangotek_common',
			numericId: 94,
			name: 'Tango',
			rarity: 'common',
			hermitType: 'redstone',
			health: 300,
			primary: {
				name: 'Thing-ificator',
				cost: ['redstone'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Hat Trick',
				cost: ['redstone', 'any'],
				damage: 70,
				power: null,
			},
		})
	}
}

export default TangoTekCommonHermitCard
