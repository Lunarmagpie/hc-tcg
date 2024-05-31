import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const ArchitectFalseCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'architectfalse_common',
		numericId: 227,
		name: 'Grand Architect',
		rarity: 'common',
		hermitType: 'speedrunner',
		health: 270,
		primary: {
			name: 'Oxidize',
			cost: ['speedrunner'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Crossover',
			cost: ['speedrunner', 'speedrunner', 'any'],
			damage: 90,
			power: null,
		},
		expansion: 'alter_egos_ii',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
		getShortName: () => 'G. Architect',
	}
}

export default ArchitectFalseCommonHermitCard
