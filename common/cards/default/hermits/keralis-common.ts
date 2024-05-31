import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const KeralisCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'keralis_common',
		numericId: 71,
		name: 'Keralis',
		rarity: 'common',
		hermitType: 'builder',
		health: 270,
		primary: {
			name: 'Looky Looky',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'NoNoNoNo',
			cost: ['builder', 'builder', 'any'],
			damage: 90,
			power: null,
		},
	}
}

export default KeralisCommonHermitCard
