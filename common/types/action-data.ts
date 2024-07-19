import {SlotEntity} from '../entities'
import {HermitAttackType} from './attack'
import {CardCategoryT} from './cards'
import {AttackAction, AttackActionType, PlayCardAction, PlayCardActionType} from './game-state'
import {LocalCardInstance} from './server-requests'

export const slotToPlayCardAction: Record<CardCategoryT, PlayCardActionType> = {
	hermit: 'PLAY_HERMIT_CARD',
	item: 'PLAY_ITEM_CARD',
	attach: 'PLAY_EFFECT_CARD',
	single_use: 'PLAY_SINGLE_USE_CARD',
}
export const attackToAttackAction: Record<HermitAttackType, AttackActionType> = {
	'single-use': 'SINGLE_USE_ATTACK',
	primary: 'PRIMARY_ATTACK',
	secondary: 'SECONDARY_ATTACK',
}
export const attackActionToAttack: Record<AttackActionType, HermitAttackType> = {
	SINGLE_USE_ATTACK: 'single-use',
	PRIMARY_ATTACK: 'primary',
	SECONDARY_ATTACK: 'secondary',
}

// @TODO long term all data types that can be sent to server should be here
export type PlayCardActionData = {
	type: PlayCardAction
	payload: {
		slot: SlotEntity
		card: LocalCardInstance
	}
}

export type ChangeActiveHermitActionData = {
	type: 'CHANGE_ACTIVE_HERMIT'
	payload: {
		entity: SlotEntity
	}
}

export type AttackActionData = {
	type: AttackAction
	payload: {
		playerId: string
	}
}

export type PickSlotActionData = {
	type: 'PICK_REQUEST'
	payload: {
		entity: SlotEntity
	}
}

export type AnyActionData =
	| PlayCardActionData
	| ChangeActiveHermitActionData
	| AttackActionData
	| PickSlotActionData
