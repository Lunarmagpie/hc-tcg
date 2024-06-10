import defaultAttachableCards from './default/attachable'
import defaultHermitCards from './default/hermits'
import defaultItemCards from './default/items'
import defaultSingleUseCards from './default/single-use'

import alterEgosAttachableCards from './alter-egos/attachable'
import alterEgosHermitCards from './alter-egos/hermits'
import alterEgosSingleUseCards from './alter-egos/single-use'

import alterEgosIIHermitCards from './alter-egos-ii/hermits/index'

import adventOfTcgAttachableCards from './advent-of-tcg/effects'
import adventOfTcgHermitCards from './advent-of-tcg/hermits'
import adventOfTcgSingleUseCards from './advent-of-tcg/single-use'
import {Card} from './base/card'

const allCards: Array<typeof Card<any>> = [
	// ...defaultAttachableCards,
	...defaultHermitCards,
	// ...defaultItemCards,
	// ...defaultSingleUseCards,
	// ...alterEgosAttachableCards,
	// ...alterEgosHermitCards,
	// ...alterEgosSingleUseCards,
	// ...alterEgosIIHermitCards,
	// ...adventOfTcgAttachableCards,
	// ...adventOfTcgHermitCards,
	// ...adventOfTcgSingleUseCards,
]

const CARDS: Record<string, typeof Card> = allCards.reduce(
	(result: Record<string, typeof Card>, card) => {
		const initializedCard = new (card as any)() as Card
		console.log
		result[initializedCard.props.id] = card
		return result
	},
	{}
)

export function createCard(id: string): Card {
	const index = CARDS[id]
	if (!index) return null
	const card = new (index as any)() as Card
	return card
}

export const initializedCards = Object.keys(CARDS).map((id) => createCard(id))
