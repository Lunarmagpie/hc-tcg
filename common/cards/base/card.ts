import {
	PlayCardLog,
	CardRarityT,
	CardCategoryT,
	HermitTypeT,
	HermitAttackInfo,
} from '../../types/cards'
import {GameModel} from '../../models/game-model'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {EmptyNode, FormattedTextNode, formatText} from '../../utils/formatting'

export interface IsCard {
	category: CardCategoryT
	id: string
	numericId: number
	name: string
	rarity: CardRarityT
	/* The description for this card that shows up in the sidebar. */
	getDescription: () => FormattedTextNode

	/* The expansion this card is a part of */
	expansion: string
	/* The palette for this card */
	palette: string

	sidebarDescriptions: Array<Record<string, string>>

	//@TODO remove this and make mixin
	log: ((values: PlayCardLog) => string) | null
}

export interface HermitDisplayInfo {
	/* The background this card uses */
	getBackground: () => string
	/* The shortened name for this card */
	getShortName: () => string | null
}

export interface EffectDisplayInfo {}

export interface ItemDisplayInfo {}

export interface HasBattleLog {
	getLog: ((values: PlayCardLog) => string) | null
}

export interface IsSingleUse {}

export interface HasTurnActions {
	/**
	 * Returns the actions this card makes available when in the hand
	 */
	getActions(game: GameModel): TurnActions
}

export interface OverridesAttach {
	onAttach(game: GameModel, pos: CardPosModel): void
}

export interface IsAttachableToHermitSlots {}

export interface IsAttachableToItemSlots {}

export interface IsAttachableToEffectSlots {}

export interface IsAttachableToSingleUseSlot {}

export interface GivesPointOnKnockout {}

export interface OverridesDetach {
	/**
	 * Called when an instance of this card is removed from the board
	 */
	onDetach(game: GameModel, pos: CardPosModel): void
}

export interface HasHermitType {
	hermitType: HermitTypeT
}

export interface HasHealth {
	health: number
}

export interface CanAttack {
	primary: HermitAttackInfo
	secondary: HermitAttackInfo
}

export interface AllowAttacks {
	allowAttacks: boolean
}

export interface HasDescription {
	description: string
}
