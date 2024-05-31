import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const GrianCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'grian_common',
		numericId: 34,
		name: 'Grian',
		rarity: 'common',
		hermitType: 'builder',
		health: 300,
		primary: {
			name: 'Copper Golem',
			cost: ['builder'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Waffle',
			cost: ['builder', 'any'],
			damage: 70,
			power: null,
		},
	}
}

export default GrianCommonHermitCard
