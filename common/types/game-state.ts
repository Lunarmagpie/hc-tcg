import type {Attach, CardProps, HasHealth} from '../cards/base/types'
import type {BattleLogModel} from '../models/battle-log-model'
import type {FormattedTextNode} from '../utils/formatting'
import type {HermitAttackType} from './attack'
import type {
	LocalCardInstance,
	LocalStatusEffectInstance,
	LocalModalData,
	PickRequest,
} from './server-requests'
import type {CardComponent, SlotComponent} from '../components'
import type {PlayerId} from '../models/player-model'
import type {CardEntity, PlayerEntity, RowEntity, SlotEntity} from '../entities'
import {ModalRequest} from './modal-requests'
import {ComponentQuery} from '../components/query'

type NewType = SlotEntity

export type LocalRowState = {
	entity: RowEntity
	hermit: {slot: SlotEntity; card: LocalCardInstance<HasHealth> | null}
	attach: {slot: NewType; card: LocalCardInstance<Attach> | null}
	items: Array<{slot: SlotEntity; card: LocalCardInstance<CardProps> | null}>
	health: number | null
}

export type CoinFlipResult = 'heads' | 'tails'

export type CurrentCoinFlip = {
	card: CardEntity
	opponentFlip: boolean
	name: string
	tosses: Array<CoinFlipResult>
	amount: number
	delay: number
}

export type LocalCurrentCoinFlip = {
	card: LocalCardInstance
	opponentFlip: boolean
	name: string
	tosses: Array<CoinFlipResult>
	amount: number
	delay: number
}

export type BattleLogT = {
	player: PlayerEntity
	description: string
}

export type GenericActionResult =
	| 'SUCCESS'
	| 'FAILURE_INVALID_DATA'
	| 'FAILURE_NOT_APPLICABLE'
	| 'FAILURE_ACTION_NOT_AVAILABLE'
	| 'FAILURE_CANNOT_COMPLETE'
	| 'FAILURE_UNKNOWN_ERROR'

export type PlayCardActionResult =
	| 'FAILURE_INVALID_PLAYER'
	| 'FAILURE_INVALID_SLOT'
	| 'FAILURE_UNMET_CONDITION'
	| 'FAILURE_UNMET_CONDITION_SILENT'

export type PickCardActionResult =
	| 'FAILURE_INVALID_PLAYER'
	| 'FAILURE_INVALID_SLOT'
	| 'FAILURE_WRONG_PICK'

export type ActionResult = GenericActionResult | PlayCardActionResult | PickCardActionResult

export type {LocalModalData as ModalData} from './server-requests'

export type TurnState = {
	turnNumber: number
	availableActions: Array<TurnAction>
	/** Map of source id of the block, to the actual blocked action */
	blockedActions: Array<TurnAction>

	currentAttack: HermitAttackType | null
}

export type LocalTurnState = {
	turnNumber: number
	currentPlayerId: PlayerId
	currentPlayerEntity: PlayerEntity
	availableActions: Array<TurnAction>
}

export type GameState = {
	turn: TurnState
	order: Array<PlayerEntity>

	pickRequests: Array<PickRequest>
	modalRequests: Array<ModalRequest>

	lastActionResult: {
		action: TurnAction
		result: ActionResult
	} | null

	timer: {
		turnStartTime: number
		turnRemaining: number
		opponentActionStartTime: number | null
	}
}

export type CardAction =
	| {type: 'SINGLE_USE_ATTACK'; card: CardEntity}
	| {type: 'PRIMARY_ATTACK'; card: CardEntity}
	| {type: 'SECONDARY_ATTACK'; card: CardEntity}
	| {type: 'PLAY_CARD'; card: CardEntity}

export type CardActionQuery =
	| {type: 'SINGLE_USE_ATTACK'; card: ComponentQuery<CardComponent>}
	| {type: 'PRIMARY_ATTACK'; card: ComponentQuery<CardComponent>}
	| {type: 'SECONDARY_ATTACK'; card: ComponentQuery<CardComponent>}
	| {type: 'PLAY_CARD'; card: ComponentQuery<CardComponent>}

export type SlotAction =
	| {type: 'PICK_SLOT'; slot: SlotEntity}
	| {type: 'PLAY_CARD_IN_SLOT'; slot: SlotEntity}

export type SlotActionQuery =
	| {type: 'PICK_SLOT'; slot: ComponentQuery<SlotComponent>}
	| {type: 'PLAY_CARD_IN_SLOT'; slot: ComponentQuery<SlotComponent>}

export type ActionsWithoutData =
	| {type: 'END_TURN'}
	| {type: 'APPLY_EFFECT'}
	| {type: 'REMOVE_EFFECT'}
	| {type: 'CHANGE_ACTIVE_HERMIT'}
	| {type: 'PICK_REQUEST'}
	| {type: 'MODAL_REQUEST'}
	| {type: 'WAIT_FOR_TURN'}
	| {type: 'WAIT_FOR_OPPONENT_ACTION'}

export type TurnAction = CardAction | SlotAction | ActionsWithoutData

export type TurnActionQuery = CardActionQuery | SlotActionQuery | ActionsWithoutData

export type AttackActionType = CardAction['type']
export type TurnActionType = TurnAction['type']

export function isAttackAction(
	action: TurnAction | TurnActionQuery
): action is CardAction | CardActionQuery {
	return ['PRIMARY_ATTACK', 'SECONDARY_ATTACK', 'SINGLE_USE_ATTACK'].includes(action.type)
}
export function isSlotAction(
	action: TurnAction | TurnActionQuery
): action is SlotAction | SlotActionQuery {
	return ['PLAY_CARD', 'PICK_SLOT'].includes(action.type)
}

export type GameRules = {
	disableTimer: boolean
}

export type TurnActions = Array<TurnAction>

export type GameEndOutcomeT =
	| 'client_crash'
	| 'server_crash'
	| 'timeout'
	| 'forfeit_win'
	| 'forfeit_loss'
	| 'leave_win'
	| 'leave_loss'
	| 'tie'
	| 'unknown'
	| 'you_won'
	| 'you_lost'
	| null

export type GameEndReasonT = 'hermits' | 'lives' | 'cards' | 'time' | null

export type LocalPlayerState = {
	id: PlayerId
	entity: PlayerEntity
	playerName: string
	minecraftName: string
	censoredPlayerName: string
	coinFlips: Array<LocalCurrentCoinFlip>
	lives: number
	board: {
		activeRow: RowEntity | null
		singleUse: {slot: SlotEntity; card: LocalCardInstance | null}
		singleUseCardUsed: boolean
		rows: Array<LocalRowState>
	}
}

export type LocalGameState = {
	turn: LocalTurnState
	order: Array<PlayerEntity>
	statusEffects: Array<LocalStatusEffectInstance>

	// personal data
	hand: Array<LocalCardInstance>
	pileCount: number
	discarded: Array<LocalCardInstance>

	// ids
	playerId: PlayerId
	opponentPlayerId: PlayerId
	playerEntity: PlayerEntity
	opponentPlayerEntity: PlayerEntity

	lastActionResult: {
		action: TurnAction
		result: ActionResult
	} | null

	currentCardsCanBePlacedIn: Array<[LocalCardInstance, Array<SlotEntity>]> | null
	currentPickableSlots: Array<SlotEntity> | null
	currentPickMessage: string | null
	currentModalData: LocalModalData | null

	players: Record<PlayerId, LocalPlayerState>

	timer: {
		turnStartTime: number
		turnRemaining: number
	}
}

export type Message = {
	sender: PlayerId
	systemMessage: boolean
	message: FormattedTextNode
	createdAt: number
}

// state sent to client
export type LocalGameRoot = {
	localGameState: LocalGameState | null
	time: number

	selectedCard: LocalCardInstance | null
	openedModal: {
		id: string
		info: null
	} | null
	endGameOverlay: {
		reason: GameEndReasonT
		outcome: GameEndOutcomeT
	} | null
	chat: Array<Message>
	battleLog: BattleLogModel | null
	currentCoinFlip: CurrentCoinFlip | null
	opponentConnected: boolean
}

export type GameLog = {
	type: 'public' | 'private'
	startHand1: Array<CardComponent>
	startHand2: Array<CardComponent>
	startTimestamp: number
	startDeck: string
}
