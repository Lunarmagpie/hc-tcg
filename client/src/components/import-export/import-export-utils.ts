import {createCard, initializedCards} from 'common/cards'
import {Card} from 'common/cards/base/card'
import {encode, decode} from 'js-base64'

export const getDeckFromHash = (hash: string): Array<Card> => {
	try {
		var b64 = decode(hash)
			.split('')
			.map((char) => char.charCodeAt(0))
	} catch (err) {
		return []
	}
	const deck = []
	for (let i = 0; i < b64.length; i++) {
		const cardId = initializedCards.find((value) => value && value.props.numericId === b64[i])
			?.props.id
		if (!cardId) continue
		const card = createCard(cardId)
		if (!card) continue
		deck.push(card)
	}
	return deck
}

export const getHashFromDeck = (pickedCards: Array<Card>): string => {
	const indicies = []
	for (let i = 0; i < pickedCards.length; i++) {
		const id = pickedCards[i].props.numericId
		if (id >= 0) indicies.push(id)
	}
	const b64cards = encode(String.fromCharCode.apply(null, indicies))
	return b64cards
}
