import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

class Iskall85CommonHermitCard extends Card<HermitCard> {
	override props: HermitCard = {
		...hermitCardDefaults,
		id: 'iskall85_common',
		numericId: 47,
		name: 'Iskall',
		rarity: 'common',
		hermitType: 'balanced',
		health: 280,
		primary: {
			name: 'Hallo',
			cost: ['balanced'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Omega',
			cost: ['balanced', 'balanced', 'balanced'],
			damage: 100,
			power: null,
		},
	}
}

export default Iskall85CommonHermitCard
