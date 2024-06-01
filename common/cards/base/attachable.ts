import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'

type attachmentCombinator = (game: GameModel, pos: CardPosModel) => boolean

export namespace combinators {
	export function or(...options: Array<attachmentCombinator>): attachmentCombinator {
		return (game, pos) => {
			return options.reduce((place, combinator) => place || combinator(game, pos), false)
		}
	}

	export function and(...options: Array<attachmentCombinator>): attachmentCombinator {
		return (game, pos) => {
			return options.reduce((place, combinator) => place && combinator(game, pos), true)
		}
	}

	export const player: attachmentCombinator = (game, pos) => {
		if (pos.player === game.currentPlayer) return true
		return false
	}
	export const opponent: attachmentCombinator = (game, pos) => {
		if (pos.player === game.opponentPlayer) return true
		return false
	}
	export const hermit: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'hermit') return true
		return false
	}
	export const effect: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'effect') return true
		return false
	}
	export const singleUse: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'single_use') return true
		return false
	}
	export const item: attachmentCombinator = (game, pos) => {
		if (pos.slot.type === 'item') return true
		return false
	}
}

export interface IsAttachable {
	__is_attachable: undefined
	canBeAttachedTo: attachmentCombinator
}
export const isAttachableToHermitSlotsDefaults = {__is_attachable_to_hermit_slots: undefined}
export function implementsIsAttachableToHermitSlots(obj: any): obj is IsAttachable {
	return '__is_attachable' in obj
}
