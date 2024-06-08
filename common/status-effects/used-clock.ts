import {HasDuration, StatusEffect, StatusEffectProps} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card} from '../cards/base/card'

class UsedClockStatusEffect extends StatusEffect<StatusEffectProps & HasDuration> {
	constructor(target: Card) {
		super({
			id: 'used-clock',
			name: 'Turn Skipped',
			description: 'Turns can not be skipped consecutively.',
			duration: 2,
			damageEffect: false,
			target: target,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		game.state.statusEffects.push(this)
		const {player} = pos

		player.hooks.onTurnEnd.add(this, () => {
			this.props.duration--

			if (this.props.duration === 0) removeStatusEffect(game, pos, this)
		})
	}

	override onRemoval(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		opponentPlayer.hooks.beforeAttack.remove(this)
		player.hooks.onTurnStart.remove(this)
	}
}

export default UsedClockStatusEffect
