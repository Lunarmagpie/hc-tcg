import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach} from '../../base/card'

<<<<<<< HEAD
const TinFoilChefRareHermitCard = (): HermitCard & HasAttach => {
	return {
		...hermitCardDefaults,
		id: 'tinfoilchef_rare',
		numericId: 98,
		name: 'TFC',
		rarity: 'rare',
		hermitType: 'miner',
		health: 300,
		primary: {
			name: 'True Hermit',
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'Branch Mine',
			cost: ['miner', 'miner'],
			damage: 80,
			power: 'Flip a coin.\nIf heads, you draw an extra card at the end of your turn.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
=======
class TinFoilChefRareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'tinfoilchef_rare',
			numericId: 98,
			name: 'TFC',
			rarity: 'rare',
			hermitType: 'miner',
			health: 300,
			primary: {
				name: 'True Hermit',
				cost: ['any'],
				damage: 40,
				power: null,
			},
			secondary: {
				name: 'Branch Mine',
				cost: ['miner', 'miner'],
				damage: 80,
				power: 'Flip a coin.\nIf heads, you draw an extra card at the end of your turn.',
			},
		})
	}
>>>>>>> upstream/dev

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !attacker) return

				const coinFlip = flipCoin(player, attacker.row.hermitCard)
				if (coinFlip[0] === 'tails') return

				const drawCard = player.pile.shift()
				if (drawCard) player.hand.push(drawCard)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default TinFoilChefRareHermitCard
