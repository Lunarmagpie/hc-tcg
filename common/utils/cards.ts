import {CardCategoryT, RankT} from '../types/cards'

/**
 * Returns true if the two cards are equal
 */
export function equalCard(card1: CardT | null, card2: CardT | null) {
	if (!card1 && !card2) return true
	if (!card1 || !card2) return false
	return card1.cardId === card2.cardId && card1.cardInstance === card2.cardInstance
}

/**
 * Check if card is the type of card
 */
export function isCardType(card: CardT | null, type: CardCategoryT): boolean {
	if (!card) return false
	const cardInfo = CARDS[card.id]
	return cardInfo.type === type
}

export const isRemovable = (card: CardT) => {
	const cardInfo = EFFECT_CARDS[card.id]
	if (!cardInfo) return false
	return cardInfo.getIsRemovable()
}

export function getCardExpansion(cardId: string) {
	let expansion: string = CARDS[cardId].getExpansion()

	return expansion
}
