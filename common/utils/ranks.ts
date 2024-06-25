import {HermitTypeT, RankT} from '../types/cards'
import Card, {CardProps} from '../cards/base/card'
import {CARDS} from '../cards'

export function getCardRank(card: Card<CardProps & {hermitType: HermitTypeT}>): RankT {
	return {
		name: card.props.hermitType,
		cost: card.props.tokens,
	}
}

export function getDeckCost(deckCards: Array<Card>) {
	let tokenCost = 0

	deckCards.forEach((card) => {
		tokenCost += card.props.tokens
	})

	return tokenCost
}
