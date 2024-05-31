import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const PearlescentMoonCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'pearlescentmoon_common',
		numericId: 84,
		name: 'Pearl',
		rarity: 'common',
		hermitType: 'builder',
		health: 270,
		primary: {
			name: '5 AM',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: "What's This?",
			cost: ['builder', 'builder', 'any'],
			damage: 90,
			power: null,
		},
	}
}

export default PearlescentMoonCommonHermitCard
