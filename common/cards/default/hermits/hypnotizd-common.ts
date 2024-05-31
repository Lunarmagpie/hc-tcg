import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const HypnotizdCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'hypnotizd_common',
		numericId: 36,
		name: 'Hypno',
		rarity: 'common',
		hermitType: 'balanced',
		health: 250,
		primary: {
			name: 'What Up',
			cost: ['balanced'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Max Attack',
			cost: ['balanced', 'balanced', 'balanced'],
			damage: 100,
			power: null,
		},
	}
}

export default HypnotizdCommonHermitCard
