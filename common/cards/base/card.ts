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
import {EmptyNode, FormattedTextNode} from '../../utils/formatting'

export interface IsCard {
	category: CardCategoryT
	id: string
	numericId: number
	name: string
	rarity: CardRarityT
	/* The description for this card that shows up in the sidebar. */
	description: FormattedTextNode

	/* The expansion this card is a part of */
	expansion: string
	/* The palette for this card */
	palette: string
	/* The background this card uses */
	getBackground: () => string

	/* The short name for this card */
	shortName: string | null
	sidebarDescriptions: Array<Record<string, string>>
}

export const defaultCardInfo = {
	expansion: 'default',
	palette: 'default',
	getBackground(this: IsCard) {
		return this.name
	},
	shortName: null,
	description: new EmptyNode(),
	sidebarDescriptions: [],
}

export interface HasBattleLog {
	log: ((values: PlayCardLog) => string) | null
}

export interface IsSingleUse {}

export interface HasTurnActions {
	/**
	 * Returns the actions this card makes available when in the hand
	 */
	getActions(instance: T, game: GameModel): TurnActions
}

export interface OverridesAttach {
	onAttach(game: GameModel, pos: CardPosModel): void
}

export interface IsAttachableToHermitSlots {}

export interface IsAttachableToItemSlots {}

export interface IsAttachableToEffectSlots {}

export interface IsAttachableToSingleUseSlot {}

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

export interface HasPrimaryAttack {
	primary: HermitAttackInfo
}

export interface HasSecondaryAttack {
	secondary: HermitAttackInfo
}
