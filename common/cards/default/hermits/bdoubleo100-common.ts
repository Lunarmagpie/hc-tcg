import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const BdoubleO100CommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'bdoubleo100_common',
		numericId: 0,
		name: 'Bdubs',
		rarity: 'common',
		hermitType: 'builder',
		health: 260,
		primary: {
			name: 'Gradient',
			cost: ['builder'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Prettystone',
			cost: ['builder', 'builder'],
			damage: 80,
			power: null,
		},
	}
}

export default BdoubleO100CommonHermitCard
