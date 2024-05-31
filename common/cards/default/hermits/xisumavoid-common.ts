import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const XisumavoidCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'xisumavoid_common',
		numericId: 111,
		name: 'Xisuma',
		rarity: 'common',
		hermitType: 'farm',
		health: 300,
		primary: {
			name: 'Oh My Days',
			cost: ['farm'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Jeez',
			cost: ['farm', 'farm', 'any'],
			damage: 90,
			power: null,
		},
	}
}

export default XisumavoidCommonHermitCard
