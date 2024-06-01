import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'

type attachmentCombinator = (game: GameModel, pos: CardPosModel) => boolean

export namespace combinators {
	/*
	* Return true if the card is attachable to all of the parameters.
	*
	* ```js
	* every(player, hermit)
	* ``` 
	*
	*/
	export function every(...options: Array<attachmentCombinator>): attachmentCombinator {
		return (game, pos) => {
			return options.reduce((place, combinator) => place && combinator(game, pos), true)
		}
	}

	/*
	* Return true if the card is attachable to any of the parameters.
	*
	* ```js
	* some(every(opponent, or(effect, item)))
	* ``` 
	*
	*/
	export function some(...options: Array<attachmentCombinator>): attachmentCombinator {
		return (game, pos) => {
			return options.reduce((place, combinator) => place || combinator(game, pos), false)
		}
	}

	// Return true if the card is attached to the player's side.
	export const player: attachmentCombinator = (game, pos) => {
		if (pos.player === game.currentPlayer) return true
		return false
	}
	// Return true if the card is attached to the opponents side.
	export const opponent: attachmentCombinator = (game, pos) => {
		if (pos.player === game.opponentPlayer) return true
		return false
	}
	// Return true if the card is attached to a hermit slot.
	export const hermit: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'hermit') return true
		return false
	}
	// Return true if the card is attached to an effect slot.
	export const effect: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'effect') return true
		return false
	}
	// Return true if the card is attached to a single use slot.
	export const singleUse: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'single_use') return true
		return false
	}
	// Return true if the card is attached to an item slot.
	export const item: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'item') return true
		return false
	}
	// Return true if the card is attached to the active row.
	export const activeRow: attachmentCombinator = (game, pos) => {
		return pos.player.board.activeRow === pos.rowIndex
	}
}

export interface IsAttachable {
	__is_attachable: undefined
	canBeAttachedTo: attachmentCombinator
}

export const isAttachableDefaults = { __is_attachable: undefined }
export function implementsIsAttachable(obj: any): obj is IsAttachable {
  return '__is_attachable' in obj
}
