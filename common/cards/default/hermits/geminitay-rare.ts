import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {discardSingleUse} from '../../../utils/movement'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {OverridesAttach, OverridesDetach} from '../../base/card'

// Because of this card we can't rely elsewhere on the suCard to be in state on turnEnd hook
const GeminiTayRareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...hermitCardDefaults,
		id: 'geminitay_rare',
		numericId: 28,
		name: 'Gem',
		rarity: 'rare',
		hermitType: 'terraform',
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
			power: 'At the end of your turn, you may use an additional single use effect card.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.afterAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || attack.type !== 'secondary') return

				// To keep this simple gem will discard the single use card, if it's used
				if (player.board.singleUseCardUsed) {
					discardSingleUse(game, player)
				}

				// We are hooking into afterAttack, so we just remove the blocks on actions
				// The beauty of this is that there is no need to replicate any of the existing logic anymore
				game.removeCompletedActions('SINGLE_USE_ATTACK', 'PLAY_SINGLE_USE_CARD')
				game.removeBlockedActions('game', 'PLAY_SINGLE_USE_CARD')
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			// Remove hook
			player.hooks.afterAttack.remove(this)
		},
	}
}

export default GeminiTayRareHermitCard
