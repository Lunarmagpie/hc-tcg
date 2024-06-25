import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {slot} from '../../../slot'
import {applySingleUse, getActiveRowPos} from '../../../utils/board'
import {formatText} from '../../../utils/formatting'
import Card, {SingleUse} from '../../base/card'
import SingleUseCard from '../../base/single-use-card'

class GoldenAxe extends Card<SingleUse> {
	props: SingleUse = {
		id: 'golden_axe',
		type: 'single_use',
		expansion: 'default',
		numericId: 31,
		name: 'Golden Axe',
		rarity: 'rare',
		description: formatText(
			"Do 40hp damage to your opponent's active Hermit.\nAny effect card attached to your opponent's active Hermit is ignored during this turn."
		),
	}

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		player.hooks.getAttack.add(this, () => {
			const activePos = getActiveRowPos(player)
			if (!activePos) return null
			const opponentActivePos = getActiveRowPos(opponentPlayer)
			if (!opponentActivePos) return null

			const axeAttack = new AttackModel({
				creator: this,
				attacker: activePos,
				target: opponentActivePos,
				type: 'effect',
				log: (values) =>
					`${values.defaultLog} to attack ${values.target} for ${values.damage} damage`,
			}).addDamage(this, 40)

			return axeAttack
		})

		player.hooks.beforeAttack.addBefore(this, (attack) => {
			const opponentActivePos = getActiveRowPos(opponentPlayer)
			if (!opponentActivePos) return null

			if (attack.creator === this) {
				applySingleUse(game)
			}

			attack.shouldIgnoreSlots.push(slot.every(slot.opponent, slot.effectSlot, slot.activeRow))
		})

		player.hooks.afterAttack.add(this, () => {
			player.hooks.getAttack.remove(this)
			player.hooks.afterAttack.remove(this)
		})

		player.hooks.onTurnEnd.add(this, () => {
			player.hooks.beforeAttack.remove(this)
			player.hooks.onTurnEnd.remove(this)
		})
	}

	public override onDetach(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		player.hooks.getAttack.remove(this)
		player.hooks.beforeAttack.remove(this)
		player.hooks.afterApply.remove(this)
		player.hooks.onTurnEnd.remove(this)
	}

	override canAttack() {
		return true
	}
}

export default GoldenAxe
