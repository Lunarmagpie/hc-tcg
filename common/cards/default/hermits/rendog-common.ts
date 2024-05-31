import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const RendogCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'rendog_common',
		numericId: 86,
		name: 'Rendog',
		rarity: 'common',
		hermitType: 'balanced',
		health: 260,
		primary: {
			name: 'Professional',
			cost: ['balanced'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Outrageous',
			cost: ['balanced', 'balanced', 'balanced'],
			damage: 100,
			power: null,
		},
	}
}

export default RendogCommonHermitCard
