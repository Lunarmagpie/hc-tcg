import {PlayerId, PlayerModel} from './player-model'
import {
	TurnAction,
	GameState,
	ActionResult,
	Message,
	TurnActionQuery,
	isAttackAction,
	isSlotAction,
} from '../types/game-state'
import {getGameState, setupComponents} from '../utils/state-gen'
import {PickRequest} from '../types/server-requests'
import {BattleLogModel} from './battle-log-model'
import {ComponentQuery} from '../components/query'
import * as query from '../components/query'
import {CardComponent, PlayerComponent, RowComponent, SlotComponent} from '../components'
import {AttackDefs} from '../types/attack'
import {AttackModel} from './attack-model'
import ComponentTable from '../types/ecs'
import {PlayerEntity, SlotEntity} from '../entities'
import {CopyAttack, ModalRequest, SelectCards} from '../types/modal-requests'

export class GameModel {
	private internalCreatedTime: number
	private internalId: string
	private internalCode: string | null

	public chat: Array<Message>
	public battleLog: BattleLogModel
	public players: Record<PlayerId, PlayerModel>
	public task: any
	public state: GameState

	/** The objects used in the game. */
	public components: ComponentTable

	public endInfo: {
		deadPlayerIds: Array<string>
		winner: string | null
		outcome: 'timeout' | 'forfeit' | 'tie' | 'player_won' | 'error' | null
		reason: 'hermits' | 'lives' | 'cards' | 'time' | null
	}

	constructor(player1: PlayerModel, player2: PlayerModel, code: string | null = null) {
		this.internalCreatedTime = Date.now()
		this.internalId = 'game_' + Math.random().toString()
		this.internalCode = code
		this.chat = []
		this.battleLog = new BattleLogModel(this)

		this.task = null

		this.endInfo = {
			deadPlayerIds: [],
			winner: null,
			outcome: null,
			reason: null,
		}

		this.players = {
			[player1.id]: player1,
			[player2.id]: player2,
		}

		this.components = new ComponentTable(this)
		setupComponents(this.components, player1, player2)

		this.state = getGameState(this)
	}

	public get currentPlayerEntity() {
		return this.state.order[(this.state.turn.turnNumber + 1) % 2]
	}

	public get opponentPlayerEntity() {
		return this.state.order[this.state.turn.turnNumber % 2]
	}

	public get currentPlayer(): PlayerComponent {
		return this.components.getOrError(this.currentPlayerEntity)
	}

	public get opponentPlayer(): PlayerComponent {
		return this.components.getOrError(this.opponentPlayerEntity)
	}

	public getPlayerIds() {
		return Object.keys(this.players) as Array<PlayerId>
	}

	public getPlayers() {
		return Object.values(this.players)
	}

	public get createdTime() {
		return this.internalCreatedTime
	}

	public get id() {
		return this.internalId
	}

	public get code() {
		return this.internalCode
	}

	public otherPlayerEntity(player: PlayerEntity): PlayerEntity {
		const otherPlayer = this.components.findEntity(
			PlayerComponent,
			(_game, otherPlayer) => player !== otherPlayer.entity
		)
		if (!otherPlayer)
			throw new Error('Can not query for other before because both player components are created')
		return otherPlayer
	}

	// Functions
	public getAllActions(): Array<TurnAction> {
		let attackActions: Array<TurnAction> = this.components
			.filter(CardComponent, query.card.onBoard)
			.flatMap((card) => {
				return [
					{type: 'PRIMARY_ATTACK', card: card.entity},
					{type: 'SECONDARY_ATTACK', card: card.entity},
				]
			})
		let slotActions: Array<TurnAction> = this.components.filter(SlotComponent).flatMap((slot) => {
			return [
				{type: 'PLAY_CARD_IN_SLOT', slot: slot.entity},
				{type: 'PICK_SLOT', slot: slot.entity},
			]
		})

		return [
			...attackActions,
			...slotActions,
			{type: 'END_TURN'},
			{type: 'APPLY_EFFECT'},
			{type: 'REMOVE_EFFECT'},
			{type: 'CHANGE_ACTIVE_HERMIT'},
			{type: 'PICK_REQUEST'},
			{type: 'MODAL_REQUEST'},
			{type: 'WAIT_FOR_TURN'},
			{type: 'WAIT_FOR_OPPONENT_ACTION'},
		]
	}

	/** Set actions as blocked so they cannot be done this turn */
	public blockAction(toBlock: TurnActionQuery) {
		this.state.turn.blockedActions.push(
			...this.state.turn.availableActions.filter((action) => {
				if (isAttackAction(action) && isAttackAction(toBlock)) {
					let card = this.components.get(action.card)
					if (card) {
						return toBlock.card(this, card)
					}
					return false
				}
				if (isSlotAction(action) && isSlotAction(toBlock)) {
					let slot = this.components.get(action.slot)
					if (slot) {
						return toBlock.slot(this, slot)
					}
					return false
				}
				return action.type === toBlock.type
			})
		)
	}

	/** Remove action from the completed list so they can be done again this turn */
	public unblockAction(toUnblock: TurnActionQuery) {
		this.state.turn.blockedActions = this.state.turn.blockedActions.filter((action) => {
			if (isAttackAction(action) && isAttackAction(toUnblock)) {
				let card = this.components.get(action.card)
				if (card) {
					return !toUnblock.card(this, card)
				}
				return true
			}
			if (isSlotAction(action) && isSlotAction(toUnblock)) {
				let slot = this.components.get(action.slot)
				if (slot) {
					return !toUnblock.slot(this, slot)
				}
				return true
			}
			return action.type !== toUnblock.type
		})
	}

	/** Returns true if the current blocked actions list includes the given action */
	public isActionBlocked(action: TurnAction) {
		return this.state.turn.blockedActions.some((blockedAction) => {
			if (action.type !== blockedAction.type) return false
			if (isAttackAction(action) && isAttackAction(blockedAction)) {
				return action.card === blockedAction.card
			}
			if (isSlotAction(action) && isSlotAction(blockedAction)) {
				return action.slot === blockedAction.slot
			}
			return true
		})
	}
	
	public setLastActionResult(action: TurnAction, result: ActionResult) {
		this.state.lastActionResult = {action, result}
	}

	public addPickRequest(newRequest: PickRequest, before = false) {
		if (before) {
			this.state.pickRequests.unshift(newRequest)
		} else {
			this.state.pickRequests.push(newRequest)
		}
	}
	public removePickRequest(index = 0, timeout = true) {
		if (this.state.pickRequests[index] !== undefined) {
			const request = this.state.pickRequests.splice(index, 1)[0]
			if (timeout) {
				request.onTimeout?.()
			}
		}
	}
	public cancelPickRequests() {
		if (this.state.pickRequests[0]?.playerId === this.currentPlayer.id) {
			// Cancel and clear pick requests
			for (let i = 0; i < this.state.pickRequests.length; i++) {
				this.state.pickRequests[i].onCancel?.()
			}
			this.state.pickRequests = []
		}
	}

	public addModalRequest(newRequest: SelectCards.Request, before?: boolean): void
	public addModalRequest(newRequest: CopyAttack.Request, before?: boolean): void
	public addModalRequest(newRequest: ModalRequest, before = false) {
		if (before) {
			this.state.modalRequests.unshift(newRequest)
		} else {
			this.state.modalRequests.push(newRequest)
		}
	}
	public removeModalRequest(index = 0, timeout = true) {
		if (this.state.modalRequests[index] !== undefined) {
			const request = this.state.modalRequests.splice(index, 1)[0]
			if (timeout) {
				request.onTimeout()
			}
		}
	}

	public newAttack(defs: AttackDefs): AttackModel {
		return new AttackModel(this, defs)
	}

	public hasActiveRequests(): boolean {
		return this.state.pickRequests.length > 0 || this.state.modalRequests.length > 0
	}

	/**Helper method to swap the positions of two rows on the board. Returns whether or not the change was successful. */
	public swapRows(oldRow: RowComponent, newRow: RowComponent) {
		let oldIndex = oldRow.index
		oldRow.index = newRow.index
		newRow.index = oldIndex
	}

	/**
	 * Swaps the positions of two cards on the board.
	 * This function does not check whether the cards can be placed in the other card's slot.
	 * If one of the slots is undefined, do not swap the slots.
	 */
	public swapSlots(slotA: SlotComponent | null, slotB: SlotComponent | null): void {
		if (!slotA || !slotB) return

		const slotACards = this.components.filter(CardComponent, query.card.slotEntity(slotA.entity))
		const slotBCards = this.components.filter(CardComponent, query.card.slotEntity(slotB.entity))

		slotACards.forEach((card) => {
			card.slotEntity = slotB.entity
		})
		slotBCards.forEach((card) => {
			card.slotEntity = slotA.entity
		})
	}

	public getPickableSlots(predicate: ComponentQuery<SlotComponent>): Array<SlotEntity> {
		return this.components.filter(SlotComponent, predicate).map((slotInfo) => slotInfo.entity)
	}
}
