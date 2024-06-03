import { CardPosModel } from '../../../models/card-pos-model'
import { GameModel } from '../../../models/game-model'
import { isTargetingPos } from '../../../utils/attacks'
import { discardCard } from '../../../utils/movement'
import { AttachableCard, attachableCardDefaults } from '../../base/attachable-card'
import { Card, HasAttach } from '../../base/card'

class ShieldEffectCard extends Card<AttachableCard> implements HasAttach {
	override props: AttachableCard = {
		...attachableCardDefaults,
		id: 'shield',
		numericId: 88,
		name: 'Shield',
		rarity: 'common',
		description:
			'When the Hermit this card is attached to takes damage, that damage is reduced by up to 60hp, and then this card is discarded.',
		log: null,
	}
	onAttach(game: GameModel, pos: CardPosModel) {
		const { player } = pos
		let blockedAmount: number | null = null

		// Note that we are using onDefence because we want to activate on any attack to us, not just from the opponent
		player.hooks.onDefence.add(this, (attack) => {
			if (!isTargetingPos(attack, pos) || attack.isType('status-effect')) return

			if (blockedAmount === null) {
				blockedAmount = 0
			}

			if (blockedAmount < 60) {
				const damageReduction = Math.min(attack.calculateDamage(), 60 - blockedAmount)
				blockedAmount += damageReduction
				attack.reduceDamage(this.props.id, damageReduction)
			}
		})

		player.hooks.afterDefence.add(this, () => {
			const { player, row } = pos

			if (blockedAmount !== null && blockedAmount > 0 && row) {
				discardCard(game, row.effectCard)
				if (!row.hermitCard) return
				const hermitName = row.hermitCard.name
				game.battleLog.addEntry(player.id, `$p${hermitName}'s$ $eShield$ was broken`)
			}
		})
	}
	onDetach(game: GameModel, pos: CardPosModel) {
		const { player } = pos
		player.hooks.onDefence.remove(this)
		player.hooks.afterDefence.remove(this)
	}
}

export default ShieldEffectCard
