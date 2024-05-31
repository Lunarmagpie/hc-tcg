import StatusEffect, {statusEffectDefaults} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {CARDS} from '../cards'
import {Card} from '../cards/base/card'

const BadOmenStatusEffect = (target: Card): StatusEffect => {
	return {
		...statusEffectDefaults,
		id: 'badomen',
		name: 'Bad Omen',
		description: 'All coinflips are tails.',
		duration: 3,
		counter: false,
		damageEffect: false,
		target: target,
		onApply(game: GameModel, pos: CardPosModel) {
			game.state.statusEffects.push(this)
			const {player, opponentPlayer} = pos

			if (pos.card) {
				game.battleLog.addEntry(player.id, `$p${this.target.name}$ was inflicted with $bBad Omen$`)
			}

			opponentPlayer.hooks.onTurnStart.add(this, () => {
				this.duration--

				if (this.duration === 0) removeStatusEffect(game, pos, this)
			})

			player.hooks.onCoinFlip.addBefore(this, (card, coinFlips) => {
				const targetPos = getBasicCardPos(game, this.target)

				// Only modify when the target hermit is "flipping"
				const {currentPlayer} = game
				if (
					this.target !== card &&
					(currentPlayer.id !== player.id || player.board.activeRow !== targetPos?.rowIndex)
				) {
					return coinFlips
				}

				for (let i = 0; i < coinFlips.length; i++) {
					if (coinFlips[i]) coinFlips[i] = 'tails'
				}
				return coinFlips
			})
		},
		onRemoval(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
			player.hooks.onCoinFlip.remove(this)
			opponentPlayer.hooks.onTurnStart.remove(this)
		},
	}
}

export default BadOmenStatusEffect
