import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'

const TangoTekCommonHermitCard = (): HermitCard => {
	return {
		...defaultHermitInfo,
		id: 'tangotek_common',
		numericId: 94,
		name: 'Tango',
		rarity: 'common',
		hermitType: 'redstone',
		health: 300,
		primary: {
			name: 'Thing-ificator',
			cost: ['redstone'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Hat Trick',
			cost: ['redstone', 'any'],
			damage: 70,
			power: null,
		},
	}
}

export default TangoTekCommonHermitCard
