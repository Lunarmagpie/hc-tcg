import {RANKS} from '../config'
import {RankT} from '../types/cards'
import {Card} from '../cards/base/card'

export function getCardRank(cardId: string): RankT {
	let rank: RankT = {name: 'stone', cost: 0}
	if ((RANKS as Record<string, any>)[cardId]) {
		rank.cost = (RANKS as Record<string, any>)[cardId]

		const rankKeys = Object.keys(RANKS.ranks)
		const rankValues = Object.values(RANKS.ranks)
		for (let i = 0; i < rankKeys.length; i++) {
			const key = rankKeys[i]
			const values = rankValues[i]
			if (values.includes(rank.cost)) rank.name = key
		}
	}
	return rank
}

export function getCardCost(card: Card) {
	const rank = getCardRank(card.props.id)
	return rank.cost
}

export function getDeckCost(deckCards: Array<Card>) {
	return deckCards.reduce((sum, card) => {
		return getCardCost(card) + sum
	}, 0)
	let tokenCost = 0
}
