import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const PoultrymanCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'poultryman_common',
		numericId: 136,
		name: 'Poultry Man',
		rarity: 'common',
		hermitType: 'prankster',
		health: 260,
		primary: {
			name: 'Eggscuse Me',
			cost: ['prankster'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Eggsplosion',
			cost: ['prankster', 'prankster'],
			damage: 80,
			power: null,
		},
		expansion: 'alter_egos',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
	}
}

export default PoultrymanCommonHermitCard
