import {CARDS} from '../cards'
import {Card} from '../cards/base/card'
import {PlayerState} from '../types/game-state'

export function hasActive(playerState: PlayerState): boolean {
	return playerState.board.activeRow !== null
}

export function getFormattedName(card: Card, opponent: boolean) {
	const getFormatting = (cardInfo: Card, opponent: boolean): string | null => {
		if (card.props.category === 'hermit') return opponent ? '$o' : '$p'
		if (card.props.category === 'single_use') return '$e'
		if (card.props.category === 'attachable') return '$e'
		if (card.props.category === 'item') return '$m'
		return null
	}

	const formatting = getFormatting(card, opponent)
	if (!formatting) return ''

	return `${formatting}${card.props.name}$`
}
