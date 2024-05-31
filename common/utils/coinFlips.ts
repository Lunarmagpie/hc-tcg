import {DEBUG_CONFIG} from '../config'
import {CoinFlipT, PlayerState} from '../types/game-state'
import {Card} from '../cards/base/card'

export function flipCoin(
	playerTossingCoin: PlayerState,
	card: Card,
	times: number = 1,
	currentPlayer: PlayerState | null = null
) {
	const forceHeads = DEBUG_CONFIG.forceCoinFlip
	const activeRowIndex = playerTossingCoin.board.activeRow
	if (activeRowIndex === null) {
		console.log(`${card.id} attempted to flip coin with no active row!, that shouldn't be possible`)
		return []
	}

	let coinFlips: Array<CoinFlipT> = []
	for (let i = 0; i < times; i++) {
		if (forceHeads) {
			coinFlips.push('heads')
		} else {
			const coinFlip: CoinFlipT = Math.random() > 0.5 ? 'heads' : 'tails'
			coinFlips.push(coinFlip)
		}
	}

	const coinFlipAmount = Math.floor(Math.random() * (2 + (coinFlips.length >= 1 ? 1 : 0))) + 4

	playerTossingCoin.hooks.onCoinFlip.call(card, coinFlips)

	const player = currentPlayer || playerTossingCoin
	player.coinFlips.push({
		card: card,
		opponentFlip: currentPlayer !== null,
		name: !currentPlayer ? card.name : 'Opponent ' + card.name,
		tosses: coinFlips,
		amount: coinFlipAmount,
		delay: coinFlipAmount * 350 + 1000,
	})

	return coinFlips
}
