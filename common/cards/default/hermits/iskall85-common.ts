import {defaultCardInfo} from '../../base/card'
import {HermitCard} from '../../base/hermit-card'

const Iskall85CommonHermitCard = (): HermitCard => {
	return {
		...defaultCardInfo,
		category: 'hermit',
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
