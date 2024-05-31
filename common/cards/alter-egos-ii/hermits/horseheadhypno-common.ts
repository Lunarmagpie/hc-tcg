import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const HorseHeadHypnoCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'horseheadhypno_common',
		numericId: 232,
		name: 'Horse Head Hypno',
		rarity: 'common',
		hermitType: 'farm',
		health: 260,
		primary: {
			name: 'I.O.U.',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'Profit',
			cost: ['farm', 'farm', 'farm'],
			damage: 100,
			power: null,
		},
		expansion: 'alter_egos_ii',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
		getShortName: () => 'H. H. Hypno',
	}
}

export default HorseHeadHypnoCommonHermitCard
