import Card, { Hermit } from '../../base/card'

class WormManCommon extends Card<Hermit> {
	props: Hermit = {
			id: 'wormman_common',
			expansion: 'alter_egos_ii',
			numericId: 240,
			name: 'Worm Man',
			rarity: 'common',
			type: 'hermit',
			hermitType: 'terraform',
			health: 290,
			primary: {
				name: 'Justice!',
				cost: ['terraform'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Away!',
				cost: ['terraform', 'terraform', 'any'],
				damage: 90,
				power: null,
			},
		}

	override getPalette() {
		return 'alter_egos'
	}

	override getBackground() {
		return 'alter_egos_background'
	}
}

export default WormManCommon
