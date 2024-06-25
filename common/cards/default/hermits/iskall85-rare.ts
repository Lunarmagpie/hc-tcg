import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import Card, {Hermit} from '../../base/card'

class Iskall85RareHermitCard extends Card<Hermit> {
	props: Hermit = {
		id: 'iskall85_rare',
		expansion: 'default',
		type: 'hermit',
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
	}

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		player.hooks.beforeAttack.add(this, (attack) => {
			const target = attack.getTarget()
			if (attack.type !== 'secondary' || !target) return

			const isBuilder =
				target.row.hermitCard.isHermitCard() && target.row.hermitCard.props.hermitType === 'builder'
					? 2
					: 1

			attack.multiplyDamage(this.props.id, isBuilder)
		})
	}

	override onDetach(game: GameModel, pos: CardPosModel) {
		const {player} = pos
		player.hooks.beforeAttack.remove(this)
	}
}

export default Iskall85RareHermitCard
