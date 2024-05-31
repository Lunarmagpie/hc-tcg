import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const BeetlejhostCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'beetlejhost_common',
		numericId: 126,
		name: 'Beetlejhost',
		rarity: 'common',
		hermitType: 'speedrunner',
		health: 290,
		primary: {
			name: 'Expand',
			cost: ['speedrunner'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Chroma',
			cost: ['speedrunner', 'speedrunner', 'speedrunner'],
			damage: 100,
			power: null,
		},
		expansion: 'alter_egos',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
	}
}

export default BeetlejhostCommonHermitCard
