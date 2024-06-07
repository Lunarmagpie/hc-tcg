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
import {FormattedTextNode} from '../../utils/formatting'
import {HermitAttackType} from '../../types/attack'
import {AttackModel} from '../../models/attack-model'
import {AttachmentExpression} from './attachable'

export abstract class Card<T extends CardProps = CardProps> {
	public readonly props: T

	constructor(props: T) {
		this.props = props
	}

	implementsHermitDisplayInfo(this: any): this is Card<T & HermitDisplayInfo> {
		return '__hermit_display_info' in this.props
	}
	implementsEffectDisplayInfo(this: any): this is Card<T & EffectDisplayInfo> {
		return '__effect_display_info' in this.props
	}
	implementsItemDisplayInfo(this: any): this is Card<T & ItemDisplayInfo> {
		return '__item_display_info' in this.props
	}
	implementsIsSingleUse(this: any): this is Card<T & IsSingleUse> {
		return '__is_single_use' in this.props
	}
	implementsHasBattleLog(this: any): this is Card<T & HasBattleLog> {
		return '__has_battle_log' in this.props
	}
	implementsHasTurnActions(this: any): this is Card<T & HasTurnActions> {
		return '__has_turn_actions' in this.props
	}
	implementsGivesPointOnKnockout(this: any): this is Card<T & GivesPointOnKnockout> {
		return '__gives_point_on_knockout' in this.props
	}
	implementsHasHermitType(this: any): this is Card<T & HasHermitType> {
		return '__has_hermit_type' in this.props
	}
	implementsHasHealth(this: any): this is Card<T & HasHealth> {
		return '__has_health' in this.props
	}
	implementsCanAttack(this: any): this is Card<T & CanAttack> {
		return '__can_attack' in this.props
	}
	implementsUseAttackDefaults(this: any): this is Card<T & CanAttack> {
		return '__single_use_attack' in this.props
	}
	implementsHasDescription(this: any): this is Card<T & HasDescription> {
		return '__has_description' in this.props
	}
	implementsOverridesGetEnergy(this: any): this is Card<T & OverridesGetEnergy> {
		return '__overrides_get_energy' in this.props
	}

	implementsAttach(this: any): this is Card<T> & HasAttach {
		return 'onAttach' in this && 'onDetach' in this
	}
	implementsGetAttack(this: any): this is Card<T> & GetAttack {
		return 'getAttack' in this
	}
}

export interface CardProps {
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

export interface HermitDisplayInfo {
	__hermit_display_info: undefined
	/* The background this card uses */
	getBackground: () => string
	/* The shortened name for this card */
	getShortName: () => string | null
}
export const hermitDisplayInfoDefaults = {__hermit_display_info: undefined}

export interface EffectDisplayInfo {
	__effect_display_info: undefined
}
export const effectDisplayInfoDefaults = {__effect_display_info: undefined}

export interface ItemDisplayInfo {}
export const itemDisplayInfoDefaults = {__item_display_info: undefined}

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

<<<<<<< HEAD
export interface IsSingleUse {}
export const isSingleUseDefaults = {__is_single_use: undefined}
=======
	/** The battle log attached to this card */
	/** Set to string when the card should generate a log when played or applied, and null otherwise */
	private log: Array<(values: PlayCardLog) => string>

	constructor(defs: CardDefs) {
		this.type = defs.type
		this.id = defs.id
		this.numericId = defs.numericId
		this.name = defs.name
		this.rarity = defs.rarity
		this.log = []
	}

	public getKey(keyName: string) {
		return this.id + ':' + keyName
	}
	public getInstanceKey(instance: string, keyName: string = '') {
		return this.id + ':' + instance + ':' + keyName
	}

	/**
	 * If the specified slot is empty, can this card be attached there
	 *
	 * Returns an array of any of the problems there are with attaching, if any
	 */
	public abstract canAttach(game: GameModel, pos: CardPosModel): CanAttachResult

	/**
	 * Returns the description for this card that shows up in the sidebar.
	 */
	public abstract getFormattedDescription(): FormattedTextNode

	/**
	 * Called when an instance of this card is attached to the board
	 */
	public onAttach(game: GameModel, instance: string, pos: CardPosModel) {
		// default is do nothing
	}

	/**
	 * Called when an instance of this card is removed from the board
	 */
	public onDetach(game: GameModel, instance: string, pos: CardPosModel) {
		// default is do nothing
	}

	/**
	 * Returns the expansion this card is a part of
	 */
	public getExpansion(): string {
		return 'default'
	}

	/**
	 * Returns the palette to use for this card
	 */
	public getPalette(): string {
		return 'default'
	}

	/**
	 * Returns the shortened name to use for this card
	 */
	public getShortName(): string {
		return this.name
	}

	/**
	 * Returns whether to show *Attach* on the card tooltip
	 */
	public showAttachTooltip(): boolean {
		return false
	}

	/**
	 * Returns whether to show *Single Use* on the card tooltip
	 */
	public showSingleUseTooltip(): boolean {
		return false
	}
>>>>>>> battle-log-and-attack-previews

export interface HasTurnActions {
	__has_turn_actions: undefined
	/**
	 * Returns the actions this card makes available when in the hand
	 */
	getActions(game: GameModel): TurnActions
}
export const hasTurnActionsDefaults = {__has_turn_actions: undefined}

<<<<<<< HEAD
export interface HasAttach {
	onAttach(game: GameModel, pos: CardPosModel): void
	onDetach(game: GameModel, pos: CardPosModel): void
=======
	/**
	 * Returns the sidebar descriptions for this card
	 */
	public sidebarDescriptions(): Array<Record<string, string>> {
		return []
	}

	/** Updates the log entry*/
	public updateLog(logEntry: (values: PlayCardLog) => string) {
		this.log.push(logEntry)
	}

	private consolidateLogs(values: PlayCardLog, logIndex: number) {
		if (logIndex > 0) {
			values.previousLog = this.consolidateLogs(values, logIndex - 1)
		}
		return this.log[logIndex](values)
	}

	/** Gets the log entry for this attack*/
	public getLog(values: PlayCardLog) {
		if (this.log.length === 0) {
			return ''
		}
		return this.consolidateLogs(values, this.log.length - 1)
	}
>>>>>>> battle-log-and-attack-previews
}

export interface GivesPointOnKnockout {}
export const givesPointOnKnockoutDefaults = {__gives_point_on_knockout: undefined}

export interface HasHermitType {
	__has_hermit_type: undefined
	hermitType: HermitTypeT
}
export const hasHermitTypeDefaults = {__has_hermit_type: undefined}

export interface HasHealth {
	__has_health: undefined
	health: number
}
export const hasHealthDefaults = {__has_health: undefined}

export interface CanAttack {
	__can_attack: undefined
	primary: HermitAttackInfo
	secondary: HermitAttackInfo
	// getAttack: (
	// 	game: GameModel,
	// 	pos: CardPosModel,
	// 	hermitAttackType: HermitAttackType
	// ) => AttackModel | null
}
export const canAttackDefaults = {
	__can_attack: undefined,
	// Default is to return
}

export interface SingleUseAttack {
	__single_use_attack: undefined
}
export const singleUseAttackDefaults = {
	__single_use_attack: undefined,
	// Default is to return
}

export interface AllowAttacks {
	allowAttacks: boolean
}

export interface HasDescription {
	__has_description: undefined
	description: string
}
export const hasDescriptionDefaults = {__has_description: undefined}

export interface OverridesGetEnergy {}
export const overridesGetEnergy = {__overrides_get_energy: undefined}

export interface GetAttack {
	getAttack: (
		game: GameModel,
		pos: CardPosModel,
		hermitAttackType: HermitAttackType
	) => AttackModel | null
}
