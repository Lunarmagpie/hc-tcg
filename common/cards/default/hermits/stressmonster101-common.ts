import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const StressMonster101CommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'stressmonster101_common',
		numericId: 92,
		name: 'Stress',
		rarity: 'common',
		hermitType: 'builder',
		health: 280,
		primary: {
			name: "'Ello",
			cost: ['builder'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Geezer',
			cost: ['builder', 'builder'],
			damage: 80,
			power: null,
		},
	}
}

export default StressMonster101CommonHermitCard
