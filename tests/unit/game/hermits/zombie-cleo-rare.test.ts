import {describe, expect, test} from '@jest/globals'
import BoomerBdubsRare from 'common/cards/alter-egos-ii/hermits/boomerbdubs-rare'
import ArchitectFalseRare from 'common/cards/alter-egos-iii/hermits/architectfalse-rare'
import BeetlejhostRare from 'common/cards/alter-egos-iii/hermits/beetlejhost-rare'
import WormManRare from 'common/cards/alter-egos-iii/hermits/wormman-rare'
import Cubfan135Rare from 'common/cards/default/hermits/cubfan135-rare'
import EthosLabCommon from 'common/cards/default/hermits/ethoslab-common'
import HypnotizdRare from 'common/cards/default/hermits/hypnotizd-rare'
import JoeHillsRare from 'common/cards/default/hermits/joehills-rare'
import ZombieCleoRare from 'common/cards/default/hermits/zombiecleo-rare'
import PvPItem from 'common/cards/default/items/pvp-common'
import Bow from 'common/cards/default/single-use/bow'
import ChorusFruit from 'common/cards/default/single-use/chorus-fruit'
import SmallishbeansCommon from 'common/cards/season-x/hermits/smallishbeans-common'
import {
	CardComponent,
	RowComponent,
	SlotComponent,
	StatusEffectComponent,
} from 'common/components'
import query from 'common/components/query'
import {GameModel} from 'common/models/game-model'
import ChromaKeyedEffect from 'common/status-effects/chroma-keyed'
import {SecondaryAttackDisabledEffect} from 'common/status-effects/singleturn-attack-disabled'
import {LocalCopyAttack} from 'common/types/server-requests'
import {getLocalModalData} from 'server/utils/state-gen'
import {
	attack,
	changeActiveHermit,
	endTurn,
	finishModalRequest,
	pick,
	playCardFromHand,
	removeEffect,
	testGame,
} from '../utils'

function* testPrimaryDoesNotCrash(game: GameModel) {
	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)

	yield* endTurn(game)

	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)

	yield* endTurn(game)

	yield* attack(game, 'primary')

	// Verify that the attack worked.
	expect(
		game.components.find(
			RowComponent,
			query.row.active,
			query.row.opponentPlayer,
		)?.health,
	).not.toEqual(EthosLabCommon.health)
}

function* testAmnesiaDisablesPuppetry(game: GameModel) {
	yield* playCardFromHand(game, ArchitectFalseRare, 'hermit', 0)

	yield* endTurn(game)

	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 1)

	yield* attack(game, 'secondary')

	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)

	yield* finishModalRequest(game, {pick: 'primary'})

	yield* endTurn(game)

	yield* attack(game, 'secondary')

	expect(
		game.components.find(
			StatusEffectComponent,
			query.effect.is(SecondaryAttackDisabledEffect),
			query.effect.targetIsCardAnd(
				query.card.opponentPlayer,
				query.card.active,
			),
		),
	).not.toBe(null)
}

function* testAmnesiaBlocksPuppetryMock(game: GameModel) {
	yield* playCardFromHand(game, ArchitectFalseRare, 'hermit', 0)
	yield* endTurn(game)

	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)
	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 1)
	yield* playCardFromHand(game, ChorusFruit, 'single_use')
	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	yield* endTurn(game)

	yield* attack(game, 'secondary')
	expect(
		game.components.find(
			StatusEffectComponent,
			query.effect.is(SecondaryAttackDisabledEffect),
			query.effect.targetIsCardAnd(
				query.card.opponentPlayer,
				query.card.row(query.row.index(0)),
			),
		),
	).not.toBe(null)
	yield* endTurn(game)

	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(0),
	)
	expect(
		(
			getLocalModalData(
				game,
				game.state.modalRequests[0].modal,
			) as LocalCopyAttack.Data
		).blockedActions,
	).toContain('SECONDARY_ATTACK')
	yield* finishModalRequest(game, {pick: 'primary'})
}

function* testPuppetryCanceling(game: GameModel) {
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)

	yield* endTurn(game)

	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 1)
	yield* playCardFromHand(game, BoomerBdubsRare, 'hermit', 2)

	yield* attack(game, 'secondary')

	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)

	yield* finishModalRequest(game, {pick: 'secondary'})

	expect(game.state.pickRequests).toHaveLength(1)
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(2),
	)

	yield* finishModalRequest(game, {cancel: true})

	yield* attack(game, 'secondary')

	expect(game.state.pickRequests).toHaveLength(1)
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)

	yield* finishModalRequest(game, {pick: 'secondary'})

	expect(game.state.pickRequests).toHaveLength(1)
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(2),
	)

	yield* finishModalRequest(game, {pick: 'secondary'})
	// Flip one coin for "Watch This"
	yield* finishModalRequest(game, {result: true, cards: null})
	yield* finishModalRequest(game, {result: false, cards: null})

	expect(
		game.components.find(
			RowComponent,
			query.row.opponentPlayer,
			query.row.active,
		)?.health,
	).toBe(
		EthosLabCommon.health -
			80 /** Boomer Bdubs' base secondary damage */ -
			20 /** Extra damage from exactly 1 heads */,
	)
}

function* testPuppetingJopacity(game: GameModel) {
	yield* playCardFromHand(game, SmallishbeansCommon, 'hermit', 0)

	yield* endTurn(game)

	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
	yield* playCardFromHand(game, BeetlejhostRare, 'hermit', 1)
	yield* playCardFromHand(game, SmallishbeansCommon, 'hermit', 2)

	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	yield* finishModalRequest(game, {pick: 'secondary'})

	yield* endTurn(game)
	yield* endTurn(game)

	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	yield* finishModalRequest(game, {pick: 'secondary'})

	expect(game.opponentPlayer.activeRow?.health).toBe(
		SmallishbeansCommon.health -
			BeetlejhostRare.secondary.damage -
			(BeetlejhostRare.secondary.damage - 10),
	)

	yield* endTurn(game)
	yield* endTurn(game)

	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(2),
	)
	yield* finishModalRequest(game, {pick: 'secondary'})

	expect(game.opponentPlayer.activeRow?.health).toBe(
		SmallishbeansCommon.health -
			BeetlejhostRare.secondary.damage -
			(BeetlejhostRare.secondary.damage - 10) -
			SmallishbeansCommon.secondary.damage,
	)

	expect(
		game.components.find(
			StatusEffectComponent,
			query.effect.is(ChromaKeyedEffect),
			query.effect.targetIsCardAnd(query.card.currentPlayer),
		),
	).toBe(null)
}

function* testPuppetryDiscardingItem(game: GameModel) {
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 1)
	yield* endTurn(game)

	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
	yield* playCardFromHand(game, PvPItem, 'item', 0, 0)
	yield* playCardFromHand(game, HypnotizdRare, 'hermit', 1)
	yield* attack(game, 'secondary')

	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)

	yield* finishModalRequest(game, {pick: 'secondary'})

	yield* pick(
		game,
		query.slot.opponent,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)

	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.item,
		query.slot.index(0),
		query.slot.rowIndex(0),
	)

	expect(
		game.components
			.find(
				SlotComponent,
				query.slot.currentPlayer,
				query.slot.item,
				query.slot.rowIndex(0),
				query.slot.index(0),
			)
			?.getCard(),
	).toBe(null)
}

function* testPuppetingTotalAnonymity(game: GameModel) {
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)
	yield* endTurn(game)

	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
	yield* playCardFromHand(game, WormManRare, 'hermit', 1)
	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	yield* finishModalRequest(game, {pick: 'secondary'})
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 2)
	expect(
		game.components.find(
			CardComponent,
			query.card.currentPlayer,
			query.card.slot(query.slot.rowIndex(2)),
		)?.turnedOver,
	).toBe(true)
	yield* endTurn(game)

	yield* attack(game, 'secondary')
	yield* endTurn(game)

	yield* endTurn(game)

	yield* attack(game, 'secondary')
	yield* endTurn(game)

	yield* endTurn(game)

	yield* attack(game, 'secondary')
	expect(
		game.components.find(
			CardComponent,
			query.card.opponentPlayer,
			query.card.slot(query.slot.rowIndex(2)),
		)?.turnedOver,
	).toBe(false)
}

function* testPuppetingTimeSkip(game: GameModel) {
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)
	yield* playCardFromHand(game, EthosLabCommon, 'hermit', 1)
	yield* endTurn(game)

	yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
	yield* playCardFromHand(game, JoeHillsRare, 'hermit', 1)
	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	yield* finishModalRequest(game, {pick: 'secondary'})
	yield* endTurn(game)

	yield* changeActiveHermit(game, 1)
	yield* endTurn(game)

	yield* playCardFromHand(game, Bow, 'single_use')
	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	expect(
		(
			getLocalModalData(
				game,
				game.state.modalRequests[0].modal,
			) as LocalCopyAttack.Data
		).blockedActions,
	).toContain('SECONDARY_ATTACK')
	yield* finishModalRequest(game, {pick: 'primary'})
	yield* removeEffect(game)
	yield* attack(game, 'secondary')
	yield* pick(
		game,
		query.slot.currentPlayer,
		query.slot.hermit,
		query.slot.rowIndex(1),
	)
	yield* finishModalRequest(game, {pick: 'primary'})
}

describe('Test Zombie Cleo', () => {
	test('Test Zombie Cleo Primary Does Not Crash Server', () => {
		testGame(
			{
				saga: testPrimaryDoesNotCrash,
				playerOneDeck: [ZombieCleoRare],
				playerTwoDeck: [EthosLabCommon],
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test('Test Puppetry is Disabled by Amnesia', () => {
		testGame(
			{
				saga: testAmnesiaDisablesPuppetry,
				playerOneDeck: [ArchitectFalseRare],
				playerTwoDeck: [ZombieCleoRare, EthosLabCommon],
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test('Test Amnesia Blocks Mocking Attack with Puppetry', () => {
		testGame(
			{
				saga: testAmnesiaBlocksPuppetryMock,
				playerOneDeck: [ArchitectFalseRare],
				playerTwoDeck: [EthosLabCommon, ZombieCleoRare, ChorusFruit],
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test('Test Puppetry After Canceling', () => {
		testGame(
			{
				saga: testPuppetryCanceling,
				playerOneDeck: [EthosLabCommon],
				playerTwoDeck: [ZombieCleoRare, ZombieCleoRare, BoomerBdubsRare],
			},
			{startWithAllCards: true, noItemRequirements: true, forceCoinFlip: true},
		)
	})

	test('Test using Puppetry on Jopacity', () => {
		testGame(
			{
				saga: testPuppetingJopacity,
				playerOneDeck: [SmallishbeansCommon],
				playerTwoDeck: [ZombieCleoRare, BeetlejhostRare, SmallishbeansCommon],
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test('Test Puppeting an attack that requites an item to be discarded', () => {
		testGame(
			{
				saga: testPuppetryDiscardingItem,
				playerOneDeck: [EthosLabCommon, EthosLabCommon],
				playerTwoDeck: [ZombieCleoRare, PvPItem, HypnotizdRare],
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test('Test using Puppetry on Total Anonymity', () => {
		testGame(
			{
				saga: testPuppetingTotalAnonymity,
				playerOneDeck: [EthosLabCommon],
				playerTwoDeck: [ZombieCleoRare, WormManRare, EthosLabCommon],
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test("Test using Puppetry on Let's Go with Chorus Fruit", () => {
		testGame(
			{
				playerOneDeck: [EthosLabCommon],
				playerTwoDeck: [ZombieCleoRare, Cubfan135Rare, ChorusFruit],
				saga: function* (game) {
					yield* playCardFromHand(game, EthosLabCommon, 'hermit', 0)
					yield* endTurn(game)

					yield* playCardFromHand(game, ZombieCleoRare, 'hermit', 0)
					yield* playCardFromHand(game, Cubfan135Rare, 'hermit', 1)
					yield* playCardFromHand(game, ChorusFruit, 'single_use')
					yield* attack(game, 'secondary')
					yield* pick(
						game,
						query.slot.currentPlayer,
						query.slot.hermit,
						query.slot.rowIndex(1),
					)
					yield* finishModalRequest(game, {pick: 'secondary'})
					yield* pick(
						game,
						query.slot.currentPlayer,
						query.slot.hermit,
						query.slot.rowIndex(1),
					)
					expect(game.currentPlayer.activeRow?.index).toBe(1)
					yield* pick(
						game,
						query.slot.currentPlayer,
						query.slot.hermit,
						query.slot.rowIndex(0),
					)
					expect(game.currentPlayer.activeRow?.index).toBe(0)
				},
			},
			{startWithAllCards: true, noItemRequirements: true},
		)
	})

	test('Test using Puppetry on Time Skip', () => {
		testGame(
			{
				saga: testPuppetingTimeSkip,
				playerOneDeck: [EthosLabCommon, EthosLabCommon],
				playerTwoDeck: [ZombieCleoRare, JoeHillsRare, Bow],
			},
			{startWithAllCards: true, noItemRequirements: true, forceCoinFlip: true},
		)
	})
})
