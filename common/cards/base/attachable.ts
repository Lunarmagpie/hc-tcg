import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'

export type AttachmentExpression = (game: GameModel, pos: CardPosModel) => boolean

export namespace combinators {
	/*
	* Return true if the card is attachable to all of the parameters.
	*
	* ```js
	* every(player, hermit)
	* ``` 
	*
	*/
	export function every(...options: Array<AttachmentExpression>): AttachmentExpression {
		return (game, pos) => {
			return options.reduce((place, combinator) => place && combinator(game, pos), true)
		}
	}

	/*
	* Return true if the card is attachable to any of the parameters.
	*
	* ```js
	* every(opponent, every(effect, item))
	* ``` 
	*
	*/
	export function some(...options: Array<AttachmentExpression>): AttachmentExpression {
		return (game, pos) => {
			return options.reduce((place, combinator) => place || combinator(game, pos), false)
		}
	}

	// Always return true
	export const anything: AttachmentExpression = (game, pos) => {
		return true
	}
	// Always return false
	export const nothing: AttachmentExpression = (game, pos) => {
		return false
	}
	// Return true if the card is attached to the player's side.
	export const player: AttachmentExpression = (game, pos) => {
		if (pos.player === game.currentPlayer) return true
		return false
	}
	// Return true if the card is attached to the opponents side.
	export const opponent: AttachmentExpression = (game, pos) => {
		if (pos.player === game.opponentPlayer) return true
		return false
	}
	// Return true if the card is attached to a hermit slot.
	export const hermit: AttachmentExpression = (game, pos) => {
		if (pos.slot.type === 'hermit') return true
		return false
	}
	// Return true if the card is attached to an effect slot.
	export const effect: AttachmentExpression = (game, pos) => {
		if (pos.slot.type === 'effect') return true
		return false
	}
	// Return true if the card is attached to a single use slot.
	export const singleUse: AttachmentExpression = (game, pos) => {
		if (pos.slot.type === 'single_use') return true
		return false
	}
	// Return true if the card is attached to an item slot.
	export const item: AttachmentExpression = (game, pos) => {
		if (pos.slot.type === 'item') return true
		return false
	}
	// Return true if the card is attached to the active row.
	export const activeRow: AttachmentExpression = (game, pos) => {
		return pos.player.board.activeRow === pos.rowIndex
	}
}

export default combinators
