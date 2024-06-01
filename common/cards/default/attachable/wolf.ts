import { AttackModel } from '../../../models/attack-model'
import { CardPosModel } from '../../../models/card-pos-model'
import { GameModel } from '../../../models/game-model'
import { getActiveRowPos, getRowPos } from '../../../utils/board'
import combinators from '../../base/attachable'
import { AttachableCard, attachableCardDefaults } from '../../base/attachable-card'

const WolfEffectCard = (): AttachableCard => {
	return {
		...attachableCardDefaults,
		id: 'wolf',
		numericId: 108,
		name: 'Wolf',
		rarity: 'rare',
		description:
			"Attach to your active Hermit.\nIf any of your Hermits take damage on your opponent's turn, your opponent's active Hermit takes 20hp damage for each Wolf card you have on the game board.",
		canBeAttachedTo: combinators.every(combinators.player, combinators.effect, combinators.activeRow),
		onAttach(game: GameModel, pos: CardPosModel) {
			const { player, opponentPlayer } = pos
			let activated = false

			opponentPlayer.hooks.onTurnStart.add(this, () => {
				// Allow another activation this turn
				activated = false
			})

			opponentPlayer.hooks.afterAttack.add(this, (attack) => {
				if (attack.isType('status-effect') || attack.isBacklash) return

				// Only on opponents turn
				if (game.currentPlayerId !== opponentPlayer.id) return

				// Make sure they are targeting this player
				const target = attack.getTarget()
				if (!target || target.player.id !== player.id) return

				// Make sure the attack is doing some damage
				if (attack.calculateDamage() <= 0) return

				if (activated) return
				activated = true

				// Add a backlash attack, targeting the opponent's active hermit.
				// Note that the opponent active row could be null, but then the attack will just do nothing.
				const opponentActiveRow = getActiveRowPos(opponentPlayer)

				const backlashAttack = new AttackModel({
					creator: this,
					attacker: getRowPos(pos),
					target: opponentActiveRow,
					type: 'effect',
					isBacklash: true,
					log: (values) => `${values.target} took ${values.damage} damage from $eWolf$`,
				}).addDamage(this.id, 20)

				attack.addNewAttack(backlashAttack)
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const { player, opponentPlayer } = pos

			// Delete hooks and custom
			opponentPlayer.hooks.onTurnStart.remove(this)
			opponentPlayer.hooks.afterAttack.remove(this)
		}
	}
}

export default WolfEffectCard
