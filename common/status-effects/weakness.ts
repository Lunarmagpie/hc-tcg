import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {isTargetingPos} from '../utils/attacks'
import {Card} from '../cards/base/card'

const WeaknessStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'weakness',
		name: 'Weakness',
		description: "This Hermit is weak to the opponent's active Hermit's type.",
		duration: 3,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			game.state.statusEffects.push(this)
			const {player, opponentPlayer} = pos

			game.battleLog.addCustomEntry(
				player.id,
				`$p${this.target.name}$ was inflicted with $eWeakness$`
			)

			player.hooks.onTurnStart.add(this, () => {
				this.duration--

				if (this.duration === 0) removeStatusEffect(game, pos, this)
			})

			opponentPlayer.hooks.onAttack.add(this, (attack) => {
				const targetPos = getCardPos(game, this.target)

				if (!targetPos) return

				if (!isTargetingPos(attack, targetPos) || attack.createWeakness === 'never') {
					return
				}

				attack.createWeakness = 'always'
			})

			player.hooks.onAttack.add(this, (attack) => {
				if (attack.createWeakness === 'never') return

				attack.createWeakness = 'always'
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
			const {player, opponentPlayer} = pos
			opponentPlayer.hooks.onAttack.remove(this)
			opponentPlayer.hooks.onAttack.remove(this)
			player.hooks.onTurnStart.remove(this)
			player.hooks.afterDefence.remove(this)
		},
	}
}

export default WeaknessStatusEffect
