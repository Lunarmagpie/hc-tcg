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
import {FormattedTextNode, formatText} from '../../utils/formatting'
import {HermitAttackType} from '../../types/attack'
import {AttackModel} from '../../models/attack-model'
import {AttachmentExpression} from './attachable'

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

	canBeAttachedTo: AttachmentExpression

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

export interface HasAttach {
	__has_attach: undefined
	onAttach(game: GameModel, pos: CardPosModel): void
	onDetach(game: GameModel, pos: CardPosModel): void
}
export const overridesAttachDefaults = {__has_attach: undefined}
export function implementsHasAttach(obj: any): obj is HasAttach {
	return '__has_attach' in obj
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
	getAttack: (
		game: GameModel,
		pos: CardPosModel,
		hermitAttackType: HermitAttackType
	) => AttackModel | null
}
export const canAttackDefaults = {
	__can_attack: undefined,
	// Default is to return
	getAttack(
		this: Card & CanAttack,
		game: GameModel,
		pos: CardPosModel,
		hermitAttackType: HermitAttackType
	): AttackModel | null {
		if (pos.rowIndex === null || !pos.row || !pos.row.hermitCard) return null

		const {opponentPlayer: opponentPlayer} = game
		const targetIndex = opponentPlayer.board.activeRow
		if (targetIndex === null) return null

		const targetRow = opponentPlayer.board.rows[targetIndex]
		if (!targetRow.hermitCard) return null

		// Create an attack with default damage
		const attack = new AttackModel({
			creator: this,
			attacker: {
				player: pos.player,
				rowIndex: pos.rowIndex,
				row: pos.row,
			},
			target: {
				player: opponentPlayer,
				rowIndex: targetIndex,
				row: targetRow,
			},
			type: hermitAttackType,
			createWeakness: 'ifWeak',
			log: (values) =>
				`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${
					values.target
				} with ${values.attackName} for ${values.damage} damage`,
		})

		if (hermitAttackType == 'primary') {
			attack.addDamage(this, this.primary.damage)
		} else if (hermitAttackType == 'secondary') {
			attack.addDamage(this, this.secondary.damage)
		}

		return attack
	},
}
export function implementsCanAttack(obj: any): obj is CanAttack {
	return '__can_attack' in obj
}

export interface SingleUseAttack {
	__single_use_attack: undefined
}
export const singleUseAttackDefaults = {
	__single_use_attack: undefined,
	// Default is to return
}
export function implementsUseAttackDefaults(obj: any): obj is CanAttack {
	return '__single_use_attack' in obj
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
export function implementsOverridesGetEnergy(obj: any): obj is OverridesGetEnergy {
	return '__overrides_get_energy' in obj
}
