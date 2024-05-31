import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const DwarfImpulseCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'dwarfimpulse_common',
		numericId: 229,
		name: 'Dwarf Impulse',
		rarity: 'common',
		hermitType: 'farm',
		health: 250,
		primary: {
			name: 'Beard Bash',
			cost: ['farm'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'Diggy Diggy',
			cost: ['farm', 'any'],
			damage: 70,
			power: null,
		},
		expansion: 'alter_egos_ii',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
		getShortName: () => 'D. Impulse',
	}
}

export default DwarfImpulseCommonHermitCard
