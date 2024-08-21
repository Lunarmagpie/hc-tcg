import {
	BoardSlotComponent,
	CardComponent,
	ObserverComponent,
} from '../../../components'
import query from '../../../components/query'
import {GameModel} from '../../../models/game-model'
import {hermit} from '../../base/defaults'
import {Hermit} from '../../base/types'

// Because of this card we can't rely elsewhere on the suCard to be in state on turnEnd hook
const GeminiTayRare: Hermit = {
	...hermit,
	id: 'geminitay_rare',
	numericId: 28,
	name: 'Gem',
	expansion: 'default',
	rarity: 'rare',
	tokens: 1,
	type: 'terraform',
	health: 270,
	primary: {
		name: "It's Fine",
		cost: ['terraform'],
		damage: 60,
		power: null,
	},
	secondary: {
		name: 'Geminislay',
		cost: ['terraform', 'terraform'],
		damage: 80,
		power:
			'At the end of your turn, you may use an additional single use effect card.',
	},
	onAttach(
		game: GameModel,
		component: CardComponent,
		observer: ObserverComponent,
	) {
		const {player} = component

		let oldSingleUse: CardComponent | null = null

		observer.subscribe(player.hooks.onAttack, (attack) => {
			if (!attack.isAttacker(component.entity) || attack.type !== 'secondary')
				return

			observer.subscribe(player.hooks.afterAttack, (_attack) => {
				// Discard the single-use card.
				oldSingleUse = game.components.find(
					CardComponent,
					query.card.slot(query.slot.singleUse),
				)

				if (!oldSingleUse) return

				// The old single use card is still attached to the board but can not be interacted with.
				oldSingleUse.attach(
					game.components.new(
						BoardSlotComponent,
						{type: 'single_use'},
						null,
						null,
						true,
					),
				)

				// We are hooking into afterAttack, so we just remove the blocks on actions
				// The beauty of this is that there is no need to replicate any of the existing logic anymore
				game.removeCompletedActions('SINGLE_USE_ATTACK', 'PLAY_SINGLE_USE_CARD')
				game.removeBlockedActions('game', 'PLAY_SINGLE_USE_CARD')
				player.singleUseCardUsed = false

				observer.unsubscribe(player.hooks.afterAttack)
			})
		})

		observer.subscribe(player.hooks.onTurnEnd, () => {
			oldSingleUse?.discard()
		})
	},
}

export default GeminiTayRare
