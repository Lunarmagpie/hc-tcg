import { PlayCardLog, CardRarityT, CardTypeT, HermitTypeT, HermitAttackInfo } from '../../types/cards'
import { GameModel } from '../../models/game-model'
import { CardPosModel } from '../../models/card-pos-model'
import { TurnActions } from '../../types/game-state'
import { FormattedTextNode } from '../../utils/formatting'

export type CanAttachResult = Array<CanAttachError>

export interface IsCard {
	type: CardTypeT
	id: string
	numericId: number
	name: string
	rarity: CardRarityT

	/* The expansion this card is a part of */
	expansion: string;
	/* The palette for this card */
	palette: string;

	/* The description for this card that shows up in the sidebar. */
	description: FormattedTextNode

	/* The short name for this card */
	shortNode: string;
	sidebarDescriptions: Array<Record<string, string>>
}

export const cardDefaults = {
	expansion: "default",
	palette: "default",
	sidebarDescriptions: []
}



export interface HasBattleLog {
	log: ((values: PlayCardLog) => string) | null
}

export interface IsSingleUse { }

export interface HasTurnActions {
	/**
	 * Returns the actions this card makes available when in the hand
	 */
	getActions(game: GameModel): TurnActions
}

export interface CanAttach {
	onAttach(game: GameModel, pos: CardPosModel): null
}

export interface IsAttachableToHermitSlots { }

export interface IsAttachableToItemSlots { }

export interface IsAttachableToEffectSlots { }

export interface IsAttachableToSingleUseSlot { }

export interface CanDetach {
	/**
	 * Called when an instance of this card is removed from the board
	 */
	onDetach(game: GameModel, pos: CardPosModel): null
}

export interface HasHermitType {
	hermitType: HermitTypeT
}

export interface HasHealth {
	health: number
}

export interface HasPrimaryAttack {
	primary: HermitAttackInfo
}

export interface HasSecondaryAttack {
	secondary: HermitAttackInfo
}
