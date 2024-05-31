import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {applyStatusEffect, getActiveRow} from '../../../utils/board'
import {OverridesAttach, OverridesDetach} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import FireStatusEffect from '../../../status-effects/fire'

const EthosLabRareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		id: 'ethoslab_rare',
		numericId: 20,
		name: 'Etho',
		rarity: 'rare',
		hermitType: 'redstone',
		health: 280,
		primary: {
			name: 'Oh Snappers',
			cost: ['redstone'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Blue Fire',
			cost: ['redstone', 'redstone'],
			damage: 80,
			power: "Flip a coin.\nIf heads, burn your opponent's active Hermit.",
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				const target = attack.getTarget()?.row.hermitCard
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !target || !attacker)
					return

				const coinFlip = flipCoin(player, attacker.row.hermitCard)

				if (coinFlip[0] !== 'heads') return

				const opponentActiveRow = getActiveRow(opponentPlayer)
				if (!opponentActiveRow || !opponentActiveRow.hermitCard) return

				applyStatusEffect(game, FireStatusEffect(target))
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
		sidebarDescriptions: [
			{
				type: 'statusEffect',
				name: 'fire',
			},
		],
	}
}

export default EthosLabRareHermitCard
