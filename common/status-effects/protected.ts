import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {isTargetingPos} from '../utils/attacks'
import {Card} from '../cards/base/card'

const ProtectedStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'protected',
		name: "Sheriff's Protection",
		description: 'This Hermit does not take damage on their first active turn.',
		duration: 0,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			game.state.statusEffects.push(this)
			const {player} = pos
			let isProtecting = false

			player.hooks.onTurnEnd.add(this, () => {
				if (player.board.activeRow === pos.rowIndex) {
					isProtecting = true
				}
			})

			player.hooks.onTurnStart.add(this, () => {
				if (isProtecting) {
					removeStatusEffect(game, pos, this)
				}
			})

			player.hooks.onDefence.add(this, (attack) => {
				const targetPos = getCardPos(game, this.target)
				if (!targetPos) return
				// Only block if just became active
				if (!isProtecting) return
				// Only block damage when we are active
				const isActive = player.board.activeRow === pos.rowIndex
				if (!isActive || !isTargetingPos(attack, targetPos)) return
				// Do not block backlash attacks
				if (attack.isBacklash) return

				if (attack.getDamage() > 0) {
					// Block all damage
					attack.multiplyDamage(this.id, 0).lockDamage(this.id)
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

			player.hooks.onDefence.remove(this)
			player.hooks.onTurnEnd.remove(this)
			player.hooks.onTurnStart.remove(this)
			player.hooks.onDefence.remove(this)
		},
	}
}

export default ProtectedStatusEffect
