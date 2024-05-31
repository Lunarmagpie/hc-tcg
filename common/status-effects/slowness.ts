import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card} from '../cards/base/card'

const SlownessStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'slowness',
		name: 'Slowness',
		description: 'This Hermit can only use their primary attack.',
		duration: 1,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			game.state.statusEffects.push(this)
			const {player} = pos

			game.battleLog.addCustomEntry(
				player.id,
				`$p${this.target.name}$ was inflicted with $eSlowness$`
			)

			player.hooks.onTurnStart.add(this, () => {
				const targetPos = getBasicCardPos(game, this.target)
				if (!targetPos || targetPos.rowIndex === null) return

				if (player.board.activeRow === targetPos.rowIndex)
					game.addBlockedActions(this.id, 'SECONDARY_ATTACK')
			})

			player.hooks.onTurnEnd.add(this, () => {
				const targetPos = getBasicCardPos(game, this.target)
				if (!targetPos || targetPos.rowIndex === null) return

				this.duration--

				if (this.duration === 0) {
					removeStatusEffect(game, pos, this)
					return
				}
			})

			player.hooks.afterDefence.add(this, (attack) => {
				const attackTarget = attack.getTarget()
				if (!attackTarget) return
				if (attackTarget.row.hermitCard !== this.target) return
				if (attackTarget.row.health > 0) return
				removeStatusEffect(game, pos, this)
			})
		},

		onRemoval(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.onTurnStart.remove(this)
			player.hooks.onTurnEnd.remove(this)
			player.hooks.afterDefence.remove(this)
		},
	}
}

export default SlownessStatusEffect
