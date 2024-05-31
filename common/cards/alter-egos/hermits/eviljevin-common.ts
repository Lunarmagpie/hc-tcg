import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const EvilJevinCommonHermitCard = (): HermitCard => {
	return {
		...hermitCardDefaults,
		id: 'eviljevin_common',
		numericId: 127,
		name: 'Evil Jevin',
		rarity: 'common',
		hermitType: 'miner',
		health: 260,
		primary: {
			name: 'Pickle',
			cost: ['miner'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Slime',
			cost: ['miner', 'miner', 'any'],
			damage: 90,
			power: null,
		},
		expansion: 'alter_egos',
		palette: 'alter_egos',
		getBackground: () => 'alter_egos_background',
	}
}

export default EvilJevinCommonHermitCard
