import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class XBCraftedCommonHermitCard extends Card<HermitCard> {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'xbcrafted_common',
			numericId: 109,
			name: 'xB',
			rarity: 'common',
			hermitType: 'pvp',
			health: 270,
			primary: {
				name: 'Aww Yeah',
				cost: ['pvp'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Blam!',
				cost: ['pvp', 'pvp'],
				damage: 80,
				power: null,
			},
		})
	}
}

export default XBCraftedCommonHermitCard
