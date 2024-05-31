import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card} from '../cards/base/card'

const UsedClockStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'used-clock',
		name: 'Turn Skipped',
		description: 'Turns can not be skipped consecutively.',
		duration: 2,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			game.state.statusEffects.push(this)
			const {player} = pos

			player.hooks.onTurnEnd.add(this, () => {
				this.duration--

				if (this.duration === 0) removeStatusEffect(game, pos, this)
			})
		},

		onRemoval(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
			opponentPlayer.hooks.beforeAttack.remove(this)
			player.hooks.onTurnStart.remove(this)
		},
	}
}

export default UsedClockStatusEffect
