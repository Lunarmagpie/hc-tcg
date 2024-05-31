import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const GeminiTayCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'geminitay_common',
		numericId: 27,
		name: 'Gem',
		rarity: 'common',
		hermitType: 'builder',
		health: 300,
		primary: {
			name: 'Cottagecore',
			cost: ['builder'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Be Great',
			cost: ['builder', 'builder', 'builder'],
			damage: 100,
			power: null,
		},
	}
}

export default GeminiTayCommonHermitCard
