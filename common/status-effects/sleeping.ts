import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card, implementsHasHealth} from '../cards/base/card'

const SleepingStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'sleeping',
		name: 'Sleep',
		description:
			'While your Hermit is sleeping, you can not attack or make your active Hermit go AFK. If sleeping Hermit is made AFK by your opponent, they wake up.',
		duration: 3,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			const {player, card, row, rowIndex} = pos

			if (!card || !row?.hermitCard || !rowIndex || !implementsHasHealth(card)) return

			game.state.statusEffects.push(this)
			game.addBlockedActions(this.id, 'PRIMARY_ATTACK', 'SECONDARY_ATTACK', 'CHANGE_ACTIVE_HERMIT')

			row.health = card.health

			game.battleLog.addCustomEntry(
				player.id,
				`$p${card.name}$ went to $eSleep$ and restored $gfull health$`
			)

			player.hooks.onTurnStart.add(this, () => {
				const targetPos = getBasicCardPos(game, this.target)
				if (!targetPos) return
				this.duration--

				if (this.duration === 0 || player.board.activeRow !== targetPos.rowIndex) {
					removeStatusEffect(game, pos, this)
					return
				}

				if (player.board.activeRow === targetPos.rowIndex)
					game.addBlockedActions(
						this.id,
						'PRIMARY_ATTACK',
						'SECONDARY_ATTACK',
						'CHANGE_ACTIVE_HERMIT'
					)
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
			player.hooks.afterDefence.remove(this)
		},
	}
}

export default SleepingStatusEffect
