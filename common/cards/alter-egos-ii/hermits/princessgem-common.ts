import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const PrincessGemCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'princessgem_common',
		numericId: 236,
		name: 'Princess Gem',
		rarity: 'common',
		hermitType: 'terraform',
		health: 280,
		primary: {
			name: 'Monarch',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'Dawn',
			cost: ['terraform', 'terraform', 'terraform'],
			damage: 100,
			power: null,
		},
		expansion: 'alter_egos_ii',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
	}
}

export default PrincessGemCommonHermitCard
