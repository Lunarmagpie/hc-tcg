import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const FrenchKeralisCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'frenchkeralis_common',
		numericId: 231,
		name: 'Frenchralis',
		rarity: 'common',
		hermitType: 'explorer',
		health: 290,
		primary: {
			name: 'Bonjour',
			cost: ['explorer'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'La Baguette',
			cost: ['explorer', 'explorer'],
			damage: 80,
			power: null,
		},
		expansion: 'alter_egos_ii',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
	}
}

export default FrenchKeralisCommonHermitCard
