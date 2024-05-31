import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {defaultCardInfo} from '../../base/card'
import {CustomAttachHermitCard} from '../../base/hermit-card'

const Iskall85RareHermitCard = (): CustomAttachHermitCard => {
	return {
		...defaultCardInfo,
		type: 'hermit',
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
		onAttach: (instance: CustomAttachHermitCard, game: GameModel, pos: CardPosModel) => {
			const {player} = pos

			player.hooks.beforeAttack.add(instance, (attack) => {
				const target = attack.getTarget()
				if (attack.getCreator() !== instance || attack.type !== 'secondary' || !target) return
				if (target.row.hermitCard.hermitType !== 'builder') return

				attack.multiplyDamage(instance.id, 2)
			})
		},
		onDetach: (instance: CustomAttachHermitCard, game: GameModel, pos: CardPosModel) => {
			const {player} = pos
			player.hooks.beforeAttack.remove(instance)
		},
	}
}

export default Iskall85RareHermitCard
