import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {OverridesAttach, OverridesDetach} from '../../base/card'
import {overridesAttachDefaults, overridesDetachDefaults} from '../../base/card'

const Cubfan135RareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		...overridesDetachDefaults,
		id: 'cubfan135_rare',
		numericId: 10,
		name: 'Cub',
		rarity: 'rare',
		hermitType: 'speedrunner',
		health: 260,
		primary: {
			name: 'Dash',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: "Let's Go",
			cost: ['speedrunner', 'speedrunner', 'speedrunner'],
			damage: 100,
			power: 'After attack, you can choose to go AFK.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.afterAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || attack.type !== 'secondary') return

				// We used our secondary attack, activate power
				// AKA remove change active hermit from blocked actions
				game.removeBlockedActions('game', 'CHANGE_ACTIVE_HERMIT')
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.afterAttack.remove(this)
		},
	}
}

export default Cubfan135RareHermitCard
