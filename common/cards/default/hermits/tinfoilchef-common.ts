import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class TinFoilChefCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'tinfoilchef_common',
			numericId: 97,
			name: 'TFC',
			rarity: 'common',
			hermitType: 'miner',
			health: 290,
			primary: {
				name: '=π',
				cost: ['any'],
				damage: 40,
				power: null,
			},
			secondary: {
				name: 'Alright',
				cost: ['miner', 'miner', 'any'],
				damage: 90,
				power: null,
			},
		})
	}
}

export default TinFoilChefCommonHermitCard
