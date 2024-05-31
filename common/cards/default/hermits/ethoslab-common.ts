import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const EthosLabCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'ethoslab_common',
		numericId: 19,
		name: 'Etho',
		rarity: 'common',
		hermitType: 'balanced',
		health: 260,
		primary: {
			name: 'Snack Time',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'Breach',
			cost: ['balanced', 'balanced', 'balanced'],
			damage: 100,
			power: null,
		},
	}
}

export default EthosLabCommonHermitCard
