import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const Docm77CommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'docm77_common',
		numericId: 15,
		name: 'Docm77',
		rarity: 'common',
		hermitType: 'redstone',
		health: 260,
		primary: {
			name: 'Hive Mind',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'G.O.A.T.',
			cost: ['redstone', 'any'],
			damage: 70,
			power: null,
		},
	}
}

export default Docm77CommonHermitCard
