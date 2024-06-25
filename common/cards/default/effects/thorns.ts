import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {slot} from '../../../slot'
import {executeExtraAttacks, isTargetingPos} from '../../../utils/attacks'
import {formatText} from '../../../utils/formatting'
import Card, {Effect} from '../../base/card'

export abstract class ThornsBase extends Card<Effect> {
	damage: number = 0

	props: Effect = {
		id: 'thorns',
		type: 'effect',
		expansion: 'default',
		numericId: 96,
		name: 'Thorns',
		rarity: 'common',
		description: formatText(
			`When the Hermit this card is attached to takes damage, your opponent's active Hermit takes ${this.damage}hp damage.\nIgnores armour.`
		),
	}

	triggered = false

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		// Only when the opponent attacks us
		opponentPlayer.hooks.afterAttack.add(this, (attack) => {
			// If we have already triggered once this turn do not do so again
			if (this.triggered) return

			if (!attack.isType('primary', 'secondary', 'effect') || attack.isBacklash) return
			// Only return a backlash attack if the attack did damage
			if (attack.calculateDamage() <= 0) return

			if (!attack.getAttacker() || !isTargetingPos(attack, pos)) return

			this.triggered = true

			const backlashAttack = new AttackModel({
				creator: this,
				attacker: attack.getTarget(),
				target: attack.getAttacker(),
				type: 'effect',
				isBacklash: true,
				log: (values) => `${values.target} took ${values.damage} damage from $eThorns$`,
			}).addDamage(this, 20)

			backlashAttack.shouldIgnoreSlots.push(
				slot.hasId('gold_armor', 'iron_armor', 'diamond_armor', 'netherite_armor')
			)

			executeExtraAttacks(game, [backlashAttack])
		})
	}

	override onDetach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		opponentPlayer.hooks.afterAttack.remove(this)
		opponentPlayer.hooks.onTurnEnd.remove(this)
	}
}

export default class Thorns extends ThornsBase {
	damange = 20
}
