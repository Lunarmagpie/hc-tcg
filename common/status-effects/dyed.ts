import {StatusEffect, StatusEffectProps} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos, getCardPos} from '../models/card-pos-model'
import {Card} from '../cards/base/card'

class DyedStatusEffect extends StatusEffect<StatusEffectProps> {
	constructor(target: Card) {
		super({
			id: 'dyed',
			name: 'Dyed',
			description: 'Items attached to this Hermit become any type.',
			damageEffect: false,
			target: target,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		game.state.statusEffects.push(this)

		player.hooks.availableEnergy.add(this, (availableEnergy) => {
			if (player.board.activeRow === null) return availableEnergy

			const activeRow = player.board.rows[player.board.activeRow]

			if (this.props.target !== activeRow.hermitCard) return availableEnergy

			return availableEnergy.map(() => 'any')
		})
	}

	override onRemoval(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		player.hooks.availableEnergy.remove(this)
		opponentPlayer.hooks.onTurnEnd.remove(this)
	}
}

export default DyedStatusEffect
