import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {OverridesAttach, OverridesDetach, defaultCardInfo} from '../../base/card'
import {HermitCard} from '../../base/hermit-card'

const Iskall85RareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...defaultCardInfo,
		category: 'hermit',
		id: 'iskall85_rare',
		numericId: 48,
		name: 'Iskall',
		rarity: 'rare',
		hermitType: 'farm',
		health: 290,
		primary: {
			name: 'Of Doom',
			cost: ['farm'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Bird Poop',
			cost: ['farm', 'farm'],
			damage: 80,
			power: 'Attack damage doubles versus Builder types.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.beforeAttack.add(this, (attack) => {
				const target = attack.getTarget()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !target) return
				if (target.row.hermitCard.hermitType !== 'builder') return

				attack.multiplyDamage(this.id, 2)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.beforeAttack.remove(this)
		},
	}
}

const iskall = Iskall85RareHermitCard()

iskall.getBackground()

export default Iskall85RareHermitCard
