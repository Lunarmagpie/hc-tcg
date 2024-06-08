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

import defaultAttachableCards from '../default/attachable'
import defaultHermitCards from '../default/hermits'
import defaultItemCards from '../default/items'
import defaultSingleUseCards from '../default/single-use'
import alterEgosAttachableCards from '../alter-egos/attachable'
import alterEgosHermitCards from '../alter-egos/hermits'
import alterEgosSingleUseCards from '../alter-egos/single-use'
import alterEgosIIHermitCards from '../alter-egos-ii/hermits/index'
import adventOfTcgAttachableCards from '../advent-of-tcg/effects'
import adventOfTcgHermitCards from '../advent-of-tcg/hermits'
import adventOfTcgSingleUseCards from '../advent-of-tcg/single-use'
import {CARDS} from '..'

export class Card<T extends CardProps = CardProps> {
	public readonly props: T

	private instance = Math.random().toString()

	constructor(props: T | string) {
		if (typeof props === 'string') {
			const index = CARDS[props]
			const card = new (index as any)() as Card
			Object.assign(this, card)
			this.props = card.props as T
		} else {
			this.props = props
		}
	}

	equals<U extends CardProps>(
		this: Card<T>,
		otherCard: Card<U> | null | undefined
	): this is Card<T & U> {
		if (otherCard === null || otherCard === undefined) return false
		if (this.instance !== otherCard.instance) return false
		return true
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

	/** Updates the log entry*/
	updateLog(this: Card<T>, logEntry: (values: PlayCardLog) => string) {
		this.props.log.push(logEntry)
	}

	private consolidateLogs(this: Card<T>, values: PlayCardLog, logIndex: number) {
		if (logIndex > 0) {
			values.previousLog = this.consolidateLogs(values, logIndex - 1)
		}
		return this.props.log[logIndex](values)
	}

	/** Gets the log entry for this attack*/
	getLog(this: Card<T>, values: PlayCardLog) {
		if (this.props.log.length === 0) {
			return ''
		}
		return this.consolidateLogs(values, this.props.log.length - 1)
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
	log: Array<(values: PlayCardLog) => string>
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

export interface IsSingleUse {}
export const isSingleUseDefaults = {__is_single_use: undefined}

export interface HasTurnActions {
	__has_turn_actions: undefined
	/**
	 * Returns the actions this card makes available when in the hand
	 */
	getActions(game: GameModel): TurnActions
}
export const hasTurnActionsDefaults = {__has_turn_actions: undefined}

export interface HasAttach {
	onAttach(game: GameModel, pos: CardPosModel): void
	onDetach(game: GameModel, pos: CardPosModel): void
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
