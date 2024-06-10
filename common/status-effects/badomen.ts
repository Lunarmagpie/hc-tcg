import {HasDuration, StatusEffect, StatusEffectProps} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
<<<<<<< HEAD
import {Card} from '../cards/base/card'
=======
import {StatusEffectT} from '../types/game-state'
import {CARDS} from '../cards'
>>>>>>> upstream/dev

class BadOmenStatusEffect extends StatusEffect<StatusEffectProps & HasDuration> {
	constructor(target: Card) {
		super({
			id: 'badomen',
			name: 'Bad Omen',
			description: 'All coinflips are tails.',
			duration: 3,
			damageEffect: false,
			target: target,
		})
	}

	override onApply(game: GameModel, pos: CardPosModel) {
		game.state.statusEffects.push(this)
		const {player, opponentPlayer} = pos

		if (pos.card) {
			game.battleLog.addEntry(
				player.id,
				`$p${this.props.target.props.name}$ was inflicted with $bBad Omen$`
			)
		}

<<<<<<< HEAD
		opponentPlayer.hooks.onTurnStart.add(this, () => {
			this.props.duration--
=======
		if (pos.card) {
			game.battleLog.addEntry(
				player.id,
				`$p${CARDS[pos.card.cardId].name}$ was inflicted with $bBad Omen$`
			)
		}

		opponentPlayer.hooks.onTurnStart.add(statusEffectInfo.statusEffectInstance, () => {
			if (!statusEffectInfo.duration) return
			statusEffectInfo.duration--
>>>>>>> upstream/dev

			if (this.props.duration === 0) removeStatusEffect(game, pos, this)
		})

		player.hooks.onCoinFlip.addBefore(this, (card, coinFlips) => {
			const targetPos = getBasicCardPos(game, this.props.target)

			// Only modify when the target hermit is "flipping"
			const {currentPlayer} = game
			if (
				this.props.target !== card &&
				(currentPlayer.id !== player.id || player.board.activeRow !== targetPos?.rowIndex)
			) {
				return coinFlips
			}

			for (let i = 0; i < coinFlips.length; i++) {
				if (coinFlips[i]) coinFlips[i] = 'tails'
			}
			return coinFlips
		})
	}

	override onRemoval(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		player.hooks.onCoinFlip.remove(this)
		opponentPlayer.hooks.onTurnStart.remove(this)
	}
}

export default BadOmenStatusEffect
