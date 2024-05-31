import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const ImpulseSVCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'impulsesv_common',
		numericId: 40,
		name: 'Impulse',
		rarity: 'common',
		hermitType: 'farm',
		health: 270,
		primary: {
			name: 'Shovel Shuffle',
			cost: ['any'],
			damage: 30,
			power: null,
		},
		secondary: {
			name: 'iAttack',
			cost: ['farm', 'any'],
			damage: 70,
			power: null,
		},
	}
}

export default ImpulseSVCommonHermitCard
