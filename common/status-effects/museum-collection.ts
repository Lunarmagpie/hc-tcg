import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {executeAttacks} from '../utils/attacks'
import {AttackModel} from '../models/attack-model'
import {Card} from '../cards/base/card'

const MuseumCollectionStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'museum-collection',
		name: 'Museum Collection Size',
		description:
			"Number of cards you've played this turn. Each card adds 20 damage to Biffa's secondary attack.",
		duration: 0,
		counter: true,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			let oldHandSize: number | null = null
			game.state.statusEffects.push(this)
			const {player} = pos

			oldHandSize = player.hand.length

			player.hooks.onAttach.add(this, (instance) => {
				if (player.hand.length === oldHandSize) return
				const instanceLocation = getBasicCardPos(game, instance)
				if (this.duration === undefined) return
				oldHandSize = player.hand.length
				if (instanceLocation?.slot.type === 'single_use') return
				this.duration++
			})

			player.hooks.onApply.add(this, () => {
				if (this.duration === undefined) return
				oldHandSize = player.hand.length
				this.duration++
			})

			player.hooks.onAttack.add(this, (attack) => {
				const activeRow = player.board.activeRow
				if (activeRow === null) return
				const targetHermit = player.board.rows[activeRow].hermitCard
				if (!targetHermit?.cardId) return
				if (attack.getCreator() !== this || attack.type !== 'secondary') return
				if (this.duration === undefined) return

				player.hooks.onApply.remove(this)
				player.hooks.onApply.add(this, () => {
					if (this.duration === undefined) return
					this.duration++

					const additionalAttack = new AttackModel({
						creator: this,
						attacker: attack.getAttacker(),
						target: attack.getTarget(),
						type: 'secondary',
					})
					additionalAttack.addDamage(this.id, 20)

					player.hooks.onApply.remove(this)

					executeAttacks(game, [additionalAttack], true)
				})

				attack.addDamage(this.id, 20 * this.duration)
			})

			player.hooks.onTurnEnd.add(this, () => {
				oldHandSize = null
				removeStatusEffect(game, pos, this)
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
			player.hooks.onApply.remove(this)
			player.hooks.onAttach.remove(this)
			player.hooks.onAttack.remove(this)
			player.hooks.onTurnEnd.remove(this)
			player.hooks.afterDefence.remove(this)
		},
	}
}

export default MuseumCollectionStatusEffect
