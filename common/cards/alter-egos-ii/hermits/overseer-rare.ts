import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {OverridesAttach, OverridesDetach} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'

const OverseerRareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...hermitCardDefaults,
		id: 'overseer_rare',
		numericId: 235,
		name: 'Overseer',
		rarity: 'rare',
		hermitType: 'miner',
		health: 250,
		primary: {
			name: 'Testing',
			cost: ['miner'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Starched',
			cost: ['miner', 'miner'],
			damage: 80,
			power: 'Attack damage doubles versus Farm types.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.beforeAttack.add(this, (attack) => {
				const target = attack.getTarget()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !target) return
				if (target.row.hermitCard.hermitType !== 'farm') return

				attack.multiplyDamage(this.id, 2)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.beforeAttack.remove(this)
		},
		palette: 'alter_egos',
		expansion: 'alter_egos_ii',
		getBackground: () => 'alter_egos_background',
	}
}

export default OverseerRareHermitCard
