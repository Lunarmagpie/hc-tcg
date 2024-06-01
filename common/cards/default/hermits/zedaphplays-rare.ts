import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach, overridesAttachDefaults} from '../../base/card'
import {CoinFlipT} from '../../../types/game-state'

const ZedaphPlaysRareHermitCard = (): HermitCard & HasAttach => {
	let coinFlipResult: CoinFlipT | null = null

	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'zedaphplays_rare',
		numericId: 114,
		name: 'Zedaph',
		rarity: 'rare',
		hermitType: 'explorer',
		health: 290,
		primary: {
			name: 'Sheep Stare',
			cost: ['explorer'],
			damage: 50,
			power:
				"Flip a coin.\nIf heads, on your opponent's next turn, flip a coin.\nIf heads, your opponent's active Hermit attacks themselves.",
		},
		secondary: {
			name: 'Get Dangled',
			cost: ['explorer', 'explorer'],
			damage: 80,
			power: null,
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== this || attack.type !== 'primary' || !attacker) return

				const attackerHermit = attacker.row.hermitCard
				const coinFlip = flipCoin(player, attackerHermit)
				if (coinFlip[0] !== 'heads') return

				opponentPlayer.hooks.beforeAttack.add(this, (attack) => {
					if (!attack.isType('primary', 'secondary') || attack.isBacklash) return
					if (!attack.getAttacker()) return

					// No need to flip a coin for multiple attacks
					if (!coinFlipResult) {
						const coinFlip = flipCoin(player, attackerHermit, 1, opponentPlayer)
						coinFlipResult = coinFlip[0]
					}

					if (coinFlipResult === 'heads') {
						// Change attack target - this just works
						attack.setTarget(this.id, attack.getAttacker())
					}
				})

				opponentPlayer.hooks.onTurnEnd.add(this, () => {
					// Delete our hook at the end of opponents turn
					opponentPlayer.hooks.onTurnEnd.remove(this)
					opponentPlayer.hooks.beforeAttack.remove(this)
				})
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default ZedaphPlaysRareHermitCard
