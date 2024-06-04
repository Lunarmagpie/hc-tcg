import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {isTargetingPos} from '../../../utils/attacks'
import {AttachableCard, attachableCardDefaults} from '../../base/attachable-card'
import {Card, HasAttach} from '../../base/card'

class GoldArmorEffectCard extends Card<AttachableCard> implements HasAttach {
	props: AttachableCard = {
		...attachableCardDefaults,
		id: 'gold_armor',
		numericId: 29,
		name: 'Gold Armour',
		rarity: 'common',
		description:
			'When the Hermit this card is attached to takes damage, that damage is reduced by up to 10hp each turn.',
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		let counter = 0

		player.hooks.onDefence.add(this, (attack) => {
			if (!isTargetingPos(attack, pos) || attack.isType('status-effect')) return

			const totalReduction = counter

			if (totalReduction < 10) {
				const damageReduction = Math.min(attack.calculateDamage(), 10 - totalReduction)
				counter += damageReduction
				attack.reduceDamage(this.props.id, damageReduction)
			}
		})

		const resetCounter = () => {
			counter = 0
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

export default GoldArmorEffectCard
