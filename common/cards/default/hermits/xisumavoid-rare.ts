import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {OverridesAttach, OverridesDetach} from '../../base/card'
import {applyStatusEffect, getActiveRow} from '../../../utils/board'

class XisumavoidRareHermitCard  = (): HermitCard & OverridesAttach & OverridesDetach =>  {
	constructor() {
		super({		...hermitCardDefaults,

			id: 'xisumavoid_rare',
			numericId: 112,
			name: 'Xisuma',
			rarity: 'rare',
			hermitType: 'redstone',
			health: 280,
			primary: {
				name: 'Goodness Me',
				cost: ['redstone'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Cup of Tea',
				cost: ['redstone', 'redstone'],
				damage: 80,
				power: "Flip a coin.\nIf heads, poison your opponent's active Hermit.",
			},
		})
	}

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		player.hooks.onAttack.add(instance, (attack) => {
			const attackId = this.getInstanceKey(instance)
			const attacker = attack.getAttacker()
			if (attack.id !== attackId || attack.type !== 'secondary' || !attack.getTarget() || !attacker)
				return

			const coinFlip = flipCoin(player, attacker.row.hermitCard)

			if (coinFlip[0] !== 'heads') return

			const opponentActiveRow = getActiveRow(opponentPlayer)
			if (!opponentActiveRow || !opponentActiveRow.hermitCard) return

			applyStatusEffect(game, 'poison', opponentActiveRow?.hermitCard.cardInstance)
		})
	}

	override onDetach(game: GameModel, pos: CardPosModel) {
		const {player} = pos
		// Remove hooks
		player.hooks.onAttack.remove(instance)
	}

	override sidebarDescriptions() {
		return [
			{
				type: 'statusEffect',
				name: 'poison',
			},
		]
	}
}

export default XisumavoidRareHermitCard
