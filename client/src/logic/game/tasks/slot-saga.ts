import {select} from 'typed-redux-saga'
import {put, takeLeading, call} from 'redux-saga/effects'
import {SagaIterator} from 'redux-saga'
import {RootState as RS} from 'store'
import {CardT} from 'types/game-state'
import {CardInfoT} from 'types/cards'
import CARDS from 'server/cards'
import DAMAGE from 'server/const/damage'
import {runPickProcessSaga, REQS} from './pick-process-saga'

import {getPlayerId} from 'logic/session/session-selectors'
import {
	getAvailableActions,
	getSelectedCard,
	getPickProcess,
	getPlayerStateById,
} from 'logic/game/game-selectors'
import {setSelectedCard, setOpenedModalId} from 'logic/game/game-actions'

import {
	changeActiveHermit,
	applyEffect,
	playCard,
} from 'logic/game/game-actions'

const TYPED_CARDS = CARDS as Record<string, CardInfoT>
type SlotPickedAction = {type: 'SLOT_PICKED'; payload: any}

/*
1. attack with a crossbow
2. activate picker
3. send attack msg with pick info
*/

function* pickWithSelectedSaga(
	action: SlotPickedAction,
	selectedCard: CardT
): SagaIterator {
	const {slotType} = action.payload
	const selectedCardInfo = TYPED_CARDS[selectedCard.cardId]

	// Validations
	if (!selectedCardInfo) {
		console.log('Unknown card id: ', selectedCard)
		return
	}

	const suBucket =
		slotType == 'single_use' &&
		['water_bucket', 'milk_bucket'].includes(selectedCardInfo.id)
	if (selectedCardInfo.type !== slotType && !suBucket) {
		console.log(
			`Invalid slot. Trying to place card of type [${selectedCardInfo.type}] to a slot of type [${slotType}]`
		)
		return
	}

	yield put(playCard({...action.payload, card: selectedCard}))

	if (slotType === 'single_use') {
		const damageInfo = DAMAGE[selectedCardInfo.id]
		if (
			[
				'splash_potion_of_healing',
				'lava_bucket',
				'splash_potion_of_poison',
				'clock',
				'invisibility_potion',
				'fishing_rod',
				'emerald',
				'flint_&_steel',
				'spyglass',
				'efficiency',
				'curse_of_binding',
				'curse_of_vanishing',
				'looting',
				'fortune',
			].includes(selectedCard.cardId)
		) {
			yield put(setOpenedModalId('confirm'))
		} else if (selectedCard.cardId === 'chest') {
			yield put(setOpenedModalId('chest'))

			// TODO - damageInfo - hacky check for now to avoid instant selection for attack effects
		} else if (REQS[selectedCard.cardId] && !damageInfo) {
			const result = yield call(runPickProcessSaga, selectedCard.cardId)
			if (!result || !result.length) return
			// problem je ze v REQS je i bow/crossbow takze se zavola apply effect
			yield put(applyEffect({pickedCards: {[selectedCard.cardId]: result}}))
		}
	}

	yield put(setSelectedCard(null))
}

function* pickWithoutSelectedSaga(action: SlotPickedAction): SagaIterator {
	const {slotType, rowHermitCard, rowIndex} = action.payload
	const playerId = yield* select(getPlayerId)
	const playerState = yield* select(getPlayerStateById(playerId))
	const clickedOnHermit = slotType === 'hermit' && rowHermitCard
	if (!playerState || !clickedOnHermit) return
	if (playerId !== action.payload.playerId) return

	if (playerState.board.activeRow === rowIndex) {
		yield put(setOpenedModalId('attack'))
	} else {
		yield put(changeActiveHermit(action.payload))
	}
}

function* slotPickedSaga(action: SlotPickedAction): SagaIterator {
	const availableActions = yield* select(getAvailableActions)
	const selectedCard = yield* select(getSelectedCard)
	const pickProcess = yield* select(getPickProcess)
	if (availableActions.includes('WAIT_FOR_TURN')) return

	if (pickProcess) {
		return
	} else if (selectedCard) {
		yield call(pickWithSelectedSaga, action, selectedCard)
	} else {
		yield call(pickWithoutSelectedSaga, action)
	}
}

function* slotSaga(): SagaIterator {
	yield takeLeading('SLOT_PICKED', slotPickedSaga)
}

export default slotSaga