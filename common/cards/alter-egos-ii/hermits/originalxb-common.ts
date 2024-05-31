import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const OriginalXbCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'originalxb_common',
		numericId: 234,
		name: 'Original xB',
		rarity: 'common',
		hermitType: 'miner',
		health: 280,
		primary: {
			name: 'Hellooo?',
			cost: ['miner'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'So Good',
			cost: ['miner', 'miner', 'miner'],
			damage: 100,
			power: null,
		},
		expansion: 'alter_egos_ii',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
	}
}

export default OriginalXbCommonHermitCard
