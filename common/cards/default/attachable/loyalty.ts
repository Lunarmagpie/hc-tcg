import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {moveCardToHand} from '../../../utils/movement'
import {AttachableCard, attachableCardDefaults} from '../../base/attachable-card'
import {Card, HasAttach} from '../../base/card'

class LoyaltyEffectCard extends Card<AttachableCard> implements HasAttach {
	override props: AttachableCard = {
		...attachableCardDefaults,
		id: 'loyalty',
		numericId: 77,
		name: 'Loyalty',
		rarity: 'rare',
		description:
			'When the Hermit that this card is attached to is knocked out, all attached item cards are returned to your hand.',
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		const afterAttack = (attack: AttackModel) => {
			const attackTarget = attack.getTarget()
			if (!attackTarget || attackTarget.row.health > 0) return
			if (attackTarget.player !== pos.player || attackTarget.rowIndex !== pos.rowIndex) return

			// Return all attached item cards to the hand
			for (let i = 0; i < attackTarget.row.itemCards.length; i++) {
				const card = attackTarget.row.itemCards[i]
				if (card) {
					moveCardToHand(game, card)
				}
			}
		}

		player.hooks.afterAttack.add(this, (attack) => afterAttack(attack))
		opponentPlayer.hooks.afterAttack.add(this, (attack) => afterAttack(attack))
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		player.hooks.afterAttack.remove(this)
		opponentPlayer.hooks.afterAttack.remove(this)
	}
}

export default LoyaltyEffectCard
