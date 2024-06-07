import {HasDuration, StatusEffect, StatusEffectProps} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {discardCard} from '../utils/movement'
import {Card} from '../cards/base/card'

class SmeltingStatusEffect extends StatusEffect<StatusEffectProps & HasDuration> {
	constructor(target: Card) {
		super({
			id: 'smelting',
			name: 'Smelting',
			description:
				'When the counter reaches 0, upgrades all item cards attached to this Hermit to double items',
			damageEffect: false,
			target: target,
			duration: 3,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		game.state.statusEffects.push(this)
		const {player} = pos

		player.hooks.onTurnStart.add(this, () => {
			if (this.props.duration === undefined) return
			this.props.duration -= 1
			if (this.props.duration === 0) {
				discardCard(game, pos.card)
				pos.row?.itemCards.forEach((card) => {
					if (!card) return
					card.props.id = card.props.id.replace('common', 'rare')
				})
			}
		})
	}

	override onRemoval(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		player.hooks.onTurnStart.remove(this)
	}
}

export default SmeltingStatusEffect
