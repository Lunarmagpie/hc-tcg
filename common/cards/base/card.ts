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

export interface Card {
	__card: undefined

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
export const isCardDefaults = {__card: undefined}
export function implementsCard(obj: any): obj is Card {
	return '__card' in obj
}

export interface HermitDisplayInfo {
	__hermit_display_info: undefined
	/* The background this card uses */
	getBackground: () => string
	/* The shortened name for this card */
	getShortName: () => string | null
}
export const hermitDisplayInfoDefaults = {__hermit_display_info: undefined}
export function implementsHermitDisplayInfo(obj: any): obj is HermitDisplayInfo {
	return '__hermit_display_info' in obj
}

export interface EffectDisplayInfo {
	__effect_display_info: undefined
}
export const effectDisplayInfoDefaults = {__effect_display_info: undefined}
export function implementsEffectDisplayInfo(obj: any): obj is EffectDisplayInfo {
	return '__effect_display_info' in obj
}

export interface ItemDisplayInfo {}
export const itemDisplayInfoDefaults = {__item_display_info: undefined}
export function implementsItemDisplayInfo(obj: any): obj is ItemDisplayInfo {
	return '__item_display_info' in obj
}

export interface SingleUseDisplayInfo {
	__single_use_display_info: undefined
}
export const SingleUseDisplayInfo = {__single_use_display_info: undefined}
export function isSingleUseDisplayInfo(obj: any): obj is SingleUseDisplayInfo {
	return '__single_use_display_info' in obj
}

export interface HasBattleLog {
	__has_battle_log: undefined
	getLog: ((values: PlayCardLog) => string) | null
}
export const hasBattleLogDefaults = {
	__has_battle_log: undefined,
}
export function implementsHasBattleLog(obj: any): obj is HasBattleLog {
	return '__has_battle_log' in obj
}

export interface IsSingleUse {}
export const isSingleUseDefaults = {__is_single_use: undefined}
export function implementsIsSingleUse(obj: any): obj is IsSingleUse {
	return '__is_single_use' in obj
}

export interface HasTurnActions {
	__has_turn_actions: undefined
	/**
	 * Returns the actions this card makes available when in the hand
	 */
	getActions(game: GameModel): TurnActions
}
export const hasTurnActionsDefaults = {__has_turn_actions: undefined}
export function implementsHasTurnActions(obj: any): obj is HasTurnActions {
	return '__has_turn_actions' in obj
}

export interface OverridesAttach {
	__overrides_attach: undefined
	onAttach(game: GameModel, pos: CardPosModel): void
}
export const overridesAttachDefaults = {__overrides_attach: undefined}
export function implementsOverridesAttach(obj: any): obj is OverridesAttach {
	return '__overrides_attach' in obj
}

export interface OverridesDetach {
	__overrides_detach: undefined
	/**
	 * Called when an instance of this card is removed from the board
	 */
	onDetach(game: GameModel, pos: CardPosModel): void
}
export const overridesDetachDefaults = {__overrides_detach: undefined}
export function implementsOverridesDetach(obj: any): obj is OverridesDetach {
	return '__overrides_detach' in obj
}

export interface IsAttachableToHermitSlots {}
export const isAttachableToHermitSlotsDefaults = {__is_attachable_to_hermit_slots: undefined}
export function implementsIsAttachableToHermitSlots(obj: any): obj is IsAttachableToHermitSlots {
	return '__is_attachable_to_hermit_slots' in obj
}

export interface IsAttachableToItemSlots {}
export const isAttachableToItemSlotsDefaults = {__is_attachable_to_item_slots: undefined}
export function implementsIsAttachableToItemSlots(obj: any): obj is IsAttachableToItemSlots {
	return '__is_attachable_to_item_slots' in obj
}

export interface IsAttachableToEffectSlots {}
export const isAttachableToEffectSlotsDefaults = {__is_attachable_to_effect_slots: undefined}
export function implementsIsAttachableToEffectSlots(obj: any): obj is IsAttachableToEffectSlots {
	return '__is_attachable_to_effect_slots' in obj
}

export interface IsAttachableToSingleUseSlots {}
export const isAttachableToSingleUseSlotsDefaults = {__is_attachable_to_single_use_slots: undefined}
export function implementsIsAttachableToSingleUseSlots(
	obj: any
): obj is IsAttachableToSingleUseSlots {
	return '__is_attachable_to_single_use_slots' in obj
}

export interface GivesPointOnKnockout {}
export const givesPointOnKnockoutDefaults = {__gives_point_on_knockout: undefined}
export function implementsGivesPointOnKnockout(obj: any): obj is GivesPointOnKnockout {
	return '__gives_point_on_knockout' in obj
}

export interface HasHermitType {
	__has_hermit_type: undefined
	hermitType: HermitTypeT
}
export const hasHermitTypeDefaults = {__has_hermit_type: undefined}
export function implementsHasHermitType(obj: any): obj is HasHermitType {
	return '__has_hermit_type' in obj
}

export interface HasHealth {
	__has_health: undefined
	health: number
}
export const hasHealthDefaults = {__has_health: undefined}
export function implementsHasHealth(obj: any): obj is HasHealth {
	return '__has_health' in obj
}

export interface CanAttack {
	__can_attack: undefined
	primary: HermitAttackInfo
	secondary: HermitAttackInfo
}
export const canAttackDefaults = {__can_attack: undefined}
export function implementsCanAttack(obj: any): obj is CanAttack {
	return '__can_attack' in obj
}

export interface AllowAttacks {
	allowAttacks: boolean
}

export interface HasDescription {
	__has_description: undefined
	description: string
}
export const hasDescriptionDefaults = {__has_description: undefined}
export function implementsHasDescription(obj: any): obj is HasDescription {
	return '__has_description' in obj
}

export interface OverridesGetEnergy {}
export const overridesGetEnergy = {__overrides_get_energy: undefined}
export function implementsOverridesGetEnergy(obj: any): obj is IsAttachableToEffectSlots {
	return '__overrides_get_energy' in obj
}
