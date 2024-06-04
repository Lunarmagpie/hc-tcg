import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class DreamRareHermitCard extends Card<HermitCard> {
	override props: HermitCard = {
		...hermitCardDefaults,
		id: 'dream_rare',
		numericId: 117,
		name: 'Dream',
		rarity: 'rare',
		hermitType: 'speedrunner',
		health: 290,
		primary: {
			name: "C'mere",
			cost: ['speedrunner', 'any'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Transition',
			cost: ['speedrunner', 'speedrunner', 'any'],
			damage: 90,
			power: 'Flip a Coin.\nIf heads, HP is set randomly between 10-290.',
		},
		expansion: 'dream',
	}
}

export default DreamRareHermitCard
