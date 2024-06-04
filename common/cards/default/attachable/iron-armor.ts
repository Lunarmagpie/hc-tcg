import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {isTargetingPos} from '../../../utils/attacks'
import {canAttachToSlot} from '../../../utils/movement'
import {AttachableCard, attachableCardDefaults} from '../../base/attachable-card'
import {Card, HasAttach} from '../../base/card'

class IronArmorEffectCard extends Card<AttachableCard> implements HasAttach {
	override props: AttachableCard = {
		...attachableCardDefaults,
		id: 'iron_armor',
		numericId: 45,
		name: 'Iron Armour',
		rarity: 'common',
		description:
			'When the Hermit this card is attached to takes damage, that damage is reduced by up to 20hp each turn.',
	}

	private totalReduction = 0

	onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		player.hooks.onDefence.add(this, (attack) => {
			if (!isTargetingPos(attack, pos) || attack.isType('status-effect')) return

			if (this.totalReduction < 20) {
				const damageReduction = Math.min(attack.calculateDamage(), 20 - this.totalReduction)
				this.totalReduction += damageReduction
				attack.reduceDamage(this.props.id, damageReduction)
			}
		})

		const resetCounter = () => {
			this.totalReduction = 0
		}

		// Reset counter at the start of every turn
		player.hooks.onTurnStart.add(this, resetCounter)
		opponentPlayer.hooks.onTurnStart.add(this, resetCounter)
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		player.hooks.onDefence.remove(this)
		player.hooks.onTurnStart.remove(this)
		opponentPlayer.hooks.onTurnStart.remove(this)
	}
}

export default IronArmorEffectCard
