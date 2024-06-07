import {StatusEffect, StatusEffectProps, HasDuration} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card} from '../cards/base/card'

class SlownessStatusEffect extends StatusEffect<StatusEffectProps & HasDuration> {
	constructor(target: Card) {
		super({
			id: 'slowness',
			name: 'Slowness',
			description: 'This Hermit can only use their primary attack.',
			duration: 1,
			damageEffect: false,
			target: target,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		game.state.statusEffects.push(this)
		const {player} = pos

		game.battleLog.addEntry(
			player.id,
			`$p${this.props.target.props.name}$ was inflicted with $eSlowness$`
		)

		player.hooks.onTurnStart.add(this, () => {
			const targetPos = getBasicCardPos(game, this.props.target)
			if (!targetPos || targetPos.rowIndex === null) return

			if (player.board.activeRow === targetPos.rowIndex)
				game.addBlockedActions(this.props.id, 'SECONDARY_ATTACK')
		})

		player.hooks.onTurnEnd.add(this, () => {
			const targetPos = getBasicCardPos(game, this.props.target)
			if (!targetPos || targetPos.rowIndex === null) return

			this.props.duration--

			if (this.props.duration === 0) {
				removeStatusEffect(game, pos, this)
				return
			}
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
		const {player} = pos
		player.hooks.onTurnStart.remove(this)
		player.hooks.onTurnEnd.remove(this)
		player.hooks.afterDefence.remove(this)
	}
}

export default SlownessStatusEffect
