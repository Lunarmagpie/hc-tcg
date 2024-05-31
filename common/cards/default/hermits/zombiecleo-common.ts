import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const ZombieCleoCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'zombiecleo_common',
		numericId: 115,
		name: 'Cleo',
		rarity: 'common',
		hermitType: 'builder',
		health: 260,
		primary: {
			name: "It's Fine",
			cost: ['builder'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Revenge',
			cost: ['builder', 'builder'],
			damage: 80,
			power: null,
		},
	}
}

export default ZombieCleoCommonHermitCard
