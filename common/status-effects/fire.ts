import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {RowPos} from '../types/cards'
import {AttackModel} from '../models/attack-model'
import {getActiveRowPos, removeStatusEffect} from '../utils/board'
import {executeExtraAttacks} from '../utils/attacks'
import {CARDS} from '../cards'
import {IsCard} from '../cards/base/card'
import {CardPosModel, getBasicCardPos, getCardPos} from '../models/card-pos-model'

const FireStatusEffect = (target: IsCard): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'fire',
		name: 'Burn',
		description:
			"Burned Hermits take an additional 20hp damage at the end of their opponent's turn, until knocked out. Can not stack with poison.",
		duration: 0,
		counter: false,
		damageEffect: true,
		visible: true,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			const hasDamageEffect = game.state.statusEffects.some(
				(a) => a.target === pos.card && a.damageEffect === true
			)

			if (hasDamageEffect) return

			game.state.statusEffects.push(this)

			if (pos.card) {
				game.battleLog.addCustomEntry(player.id, `$p${CARDS[pos.card.id].name}$ was $eBurned$`)
			}

			opponentPlayer.hooks.onTurnEnd.add(this, () => {
				const targetPos = getBasicCardPos(game, this.target)
				if (!targetPos || !targetPos.row || targetPos.rowIndex === null) return
				if (!targetPos.row.hermitCard || !targetPos.row.health) return

				const activeRowPos = getActiveRowPos(opponentPlayer)
				const sourceRow: RowPos | null = activeRowPos
					? {
							player: activeRowPos.player,
							rowIndex: activeRowPos.rowIndex,
							row: activeRowPos.row,
					  }
					: null

				const targetRow: RowPos = {
					player: targetPos.player,
					rowIndex: targetPos.rowIndex,
					row: targetPos.row,
				}

				const statusEffectAttack = new AttackModel({
					creator: this,
					attacker: sourceRow,
					target: targetRow,
					type: 'status-effect',
					log: (values) => `${values.target} took ${values.damage} damage from $bBurn$`,
				})
				statusEffectAttack.addDamage(this.id, 20)

				executeExtraAttacks(game, [statusEffectAttack], true)
			})

			player.hooks.afterDefence.add(this, (attack) => {
				const attackTarget = attack.getTarget()
				if (!attackTarget) return
				if (attackTarget.row.hermitCard.cardInstance !== this) return
				if (attackTarget.row.health > 0) return
				removeStatusEffect(game, pos, this)
			})
		},

		onRemoval(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
			opponentPlayer.hooks.onTurnEnd.remove(this)
			player.hooks.afterDefence.remove(this)
		},
	}
}

export default FireStatusEffect
