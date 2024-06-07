import {StatusEffect, StatusEffectProps, HasDuration} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {isTargetingPos} from '../utils/attacks'
import {Card} from '../cards/base/card'

class WeaknessStatusEffect extends StatusEffect<StatusEffectProps & HasDuration> {
	constructor(target: Card) {
		super({
			id: 'weakness',
			name: 'Weakness',
			description: "This Hermit is weak to the opponent's active Hermit's type.",
			duration: 3,
			damageEffect: false,
			target: target,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		game.state.statusEffects.push(this)
		const {player, opponentPlayer} = pos

		game.battleLog.addEntry(
			player.id,
			`$p${this.props.target.props.name}$ was inflicted with $eWeakness$`
		)

		player.hooks.onTurnStart.add(this, () => {
			this.props.duration--

			if (this.props.duration === 0) removeStatusEffect(game, pos, this)
		})

		opponentPlayer.hooks.onAttack.add(this, (attack) => {
			const targetPos = getCardPos(game, this.props.target)

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
			if (attackTarget.row.hermitCard !== this.props.target) return
			if (attackTarget.row.health > 0) return
			removeStatusEffect(game, pos, this)
		})
	}

	override onRemoval(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		opponentPlayer.hooks.onAttack.remove(this)
		opponentPlayer.hooks.onAttack.remove(this)
		player.hooks.onTurnStart.remove(this)
		player.hooks.afterDefence.remove(this)
	}
}

export default WeaknessStatusEffect
