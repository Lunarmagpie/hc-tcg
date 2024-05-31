import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {discardCard} from '../utils/movement'
import {Card} from '../cards/base/card'

const SmeltingStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'smelting',
		name: 'Smelting',
		description:
			'When the counter reaches 0, upgrades all item cards attached to this Hermit to double items',
		duration: 4,
		counter: true,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			game.state.statusEffects.push(this)
			const {player} = pos

			player.hooks.onTurnStart.add(this, () => {
				if (this.duration === undefined) return
				this.duration -= 1
				if (this.duration === 0) {
					discardCard(game, pos.card)
					pos.row?.itemCards.forEach((card) => {
						if (!card) return
						card.id = card.id.replace('common', 'rare')
					})
				}
			})
		},

		onRemoval(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onTurnStart.remove(this)
		},
	}
}

export default SmeltingStatusEffect
