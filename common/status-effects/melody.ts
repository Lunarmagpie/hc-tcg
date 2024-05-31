import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {IsCard, implementsHasHealth} from '../cards/base/card'

const MelodyStatusEffect = (target: IsCard): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'melody',
		name: "Ollie's Melody",
		description: 'This Hermit heals 10hp every turn.',
		duration: 0,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			const hasMelody = game.state.statusEffects.some(
				(a) => a.target === pos.card && a.id === 'melody'
			)

			if (hasMelody) return

			game.state.statusEffects.push(this)

			player.hooks.onTurnStart.add(this, () => {
				const targetPos = getBasicCardPos(game, this.target)
				if (!targetPos || !targetPos.row || !targetPos.row.hermitCard) return
				if (targetPos.rowIndex === null || !targetPos.row.health) return
				if (!implementsHasHealth(this.target)) return

				const maxHealth = Math.max(targetPos.row.health, this.target.health)
				targetPos.row.health = Math.min(targetPos.row.health + 10, maxHealth)
			})

			player.hooks.afterDefence.add(this, (attack) => {
				const attackTarget = attack.getTarget()
				if (!attackTarget) return
				if (attackTarget.row.hermitCard.cardInstance !== this.target) return
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

export default MelodyStatusEffect
