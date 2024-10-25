import {describe, expect, test} from '@jest/globals'
import FletchingTable from 'common/cards/advent-of-tcg/single-use/fletching-table'
import Glowstone from 'common/cards/advent-of-tcg/single-use/glowstone'
import EthosLabCommon from 'common/cards/default/hermits/ethoslab-common'
import BalancedItem from 'common/cards/default/items/balanced-common'
import BuilderItem from 'common/cards/default/items/builder-common'
import MinerItem from 'common/cards/default/items/miner-common'
import {CardComponent} from 'common/components'
import {SelectCards} from 'common/types/modal-requests'
import {
	applyEffect,
	endTurn,
	finishModalRequest,
	playCardFromHand,
	testGame,
} from '../../utils'

describe('Test Glowstone Single Use', () => {
	test('Glowstone functionality', () => {
		testGame(
			{
				playerOneDeck: [EthosLabCommon, Glowstone],
				playerTwoDeck: [
					EthosLabCommon,
					...Array(6).fill(FletchingTable),
					BalancedItem,
					BuilderItem,
					MinerItem,
					FletchingTable,
				],
				saga: function* (game) {
					yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)
					yield* playCardFromHand(game, Glowstone, 'single_use')
					yield* applyEffect(game)
					expect(
						(game.state.modalRequests[0].modal as SelectCards.Data).cards.map(
							(entity) => game.components.get(entity)?.props,
						),
					).toStrictEqual([BalancedItem, BuilderItem, MinerItem])
					const cardEntities = (
						game.state.modalRequests[0].modal as SelectCards.Data
					).cards
					yield* finishModalRequest(game, {
						result: true,
						cards: [cardEntities[1]],
					})
					expect(
						game.opponentPlayer
							.getDeck()
							.sort(CardComponent.compareOrder)
							.map((card) => card.props),
					).toStrictEqual([FletchingTable, BalancedItem, MinerItem])
					expect(
						game.opponentPlayer.getDiscarded().map((card) => card.props),
					).toStrictEqual([BuilderItem])
					yield* endTurn(game)
				},
			},
			{startWithAllCards: false},
		)
	})
})
