import { AttackModel } from '../../../models/attack-model'
import { CardPosModel, getCardPos } from '../../../models/card-pos-model'
import { GameModel } from '../../../models/game-model'
import { isTargetingPos } from '../../../utils/attacks'
import { AttachableCard, attachableCardDefaults } from '../../base/attachable-card'
import { Card, HasAttach } from '../../base/card'

class ThornsEffectCard extends Card<AttachableCard> implements HasAttach {
	override props: AttachableCard = {
		...attachableCardDefaults,
		id: 'thorns',
		numericId: 96,
		name: 'Thorns',
		rarity: 'common',
		description:
			"When the Hermit this card is attached to takes damage, your opponent's active Hermit takes 20hp damage.\nIgnores armour.",
	}

	private triggered = false;

	onAttach(game: GameModel, pos: CardPosModel) {
		const { player, opponentPlayer } = pos

		// Only when the opponent attacks us
		opponentPlayer.hooks.afterAttack.add(this, (attack) => {
			// If we have already triggered once this turn do not do so again
			if (this.triggered) return

			if (!attack.isType('primary', 'secondary', 'effect') || attack.isBacklash) return
			// Only return a backlash attack if the attack did damage
			if (attack.calculateDamage() <= 0) return

			if (attack.getAttacker() && isTargetingPos(attack, pos)) {
				this.triggered = true

				const backlashAttack = new AttackModel({
					creator: this,
					attacker: attack.getTarget(),
					target: attack.getAttacker(),
					type: 'effect',
					isBacklash: true,
					log: (values) => `${values.target} took ${values.damage} damage from $eThorns$`,
				}).addDamage(this.props.id, 20)

				backlashAttack.shouldIgnoreCards.push((target) => {
					return ['gold_armor', 'iron_armor', 'diamond_armor', 'netherite_armor'].includes(target.props.id)
				})

				attack.addNewAttack(backlashAttack)
			}

			return attack
		})

		opponentPlayer.hooks.onTurnEnd.add(this, () => {
			this.triggered = false;
		})
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		const { player, opponentPlayer } = pos
		opponentPlayer.hooks.afterAttack.remove(this)
		opponentPlayer.hooks.onTurnEnd.remove(this)
	}
}

export default ThornsEffectCard
