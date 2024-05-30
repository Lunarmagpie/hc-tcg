import { HERMIT_CARDS } from '../..'
import { CardPosModel } from '../../../models/card-pos-model'
import { GameModel } from '../../../models/game-model'
import { CardRarityT, HermitAttackInfo, HermitTypeT } from '../../../types/cards'
import { HermitCard } from '../../base/hermit-card'

class Iskall85RareHermitCard implements HermitCard {
	id = 'iskall85_rare'
	numericId = 48
	name = 'Iskall'
	rarity: CardRarityT = 'rare'
	hermitType: HermitTypeT = 'farm'
	health = 290
	primary: HermitAttackInfo = {
		name: 'Of Doom',
		cost: ['farm'],
		damage: 50,
		power: null,
	}
	secondary: HermitAttackInfo = {
		name: 'Bird Poop',
		cost: ['farm', 'farm'],
		damage: 80,
		power: 'Attack damage doubles versus Builder types.',
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const { player } = pos

		player.hooks.beforeAttack.add(this, (attack) => {
			const target = attack.getTarget()
			if (attack.creator !== this || attack.type !== 'secondary' || !target) return
			if (target.row.hermitCard.hermitType !== 'builder') return

			attack.multiplyDamage(this.id, 2)
		})
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		const { player } = pos
		player.hooks.beforeAttack.remove()
	}
}

export default Iskall85RareHermitCard
