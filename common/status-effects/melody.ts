import {StatusEffect, StatusEffectProps} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card} from '../cards/base/card'

class MelodyStatusEffect extends StatusEffect<StatusEffectProps> {
	constructor(target: Card) {
		super({
			id: 'melody',
			name: "Ollie's Melody",
			description: 'This Hermit heals 10hp every turn.',
			damageEffect: false,
			target: target,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		const hasMelody = game.state.statusEffects.some(
			(a) => a.target === pos.card && a.id === 'melody'
		)

		if (hasMelody) return

		game.state.statusEffects.push(this)

		player.hooks.onTurnStart.add(this, () => {
			const targetPos = getBasicCardPos(game, this.props.target)
			if (!targetPos || !targetPos.row || !targetPos.row.hermitCard) return
			if (targetPos.rowIndex === null || !targetPos.row.health) return
			if (!this.props.target.implementsHasHealth()) return

			const maxHealth = Math.max(targetPos.row.health, this.props.target.props.health)
			targetPos.row.health = Math.min(targetPos.row.health + 10, maxHealth)
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
		player.hooks.afterDefence.remove(this)
	}
}

export default MelodyStatusEffect
