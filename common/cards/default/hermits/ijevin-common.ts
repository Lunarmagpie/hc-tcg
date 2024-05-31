import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const IJevinCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'ijevin_common',
		numericId: 38,
		name: 'Jevin',
		rarity: 'common',
		hermitType: 'explorer',
		health: 250,
		primary: {
			name: "Got 'Em",
			cost: ['explorer'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Jevination',
			cost: ['explorer', 'explorer', 'any'],
			damage: 90,
			power: null,
		},
	}
}

export default IJevinCommonHermitCard
