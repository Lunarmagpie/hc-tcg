import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {discardCard} from '../../../utils/movement'
import {Card} from '../../base/card'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach} from '../../base/card'
import {getActiveRow, getSlotPos} from '../../../utils/board'

const TinFoilChefUltraRareHermitCard = (): HermitCard & HasAttach => {
	let limit: Array<Card> = []

	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'tinfoilchef_ultra_rare',
		numericId: 99,
		name: 'TFC',
		rarity: 'ultra_rare',
		hermitType: 'miner',
		health: 300,
		primary: {
			name: 'Phone Call',
			cost: ['miner'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Take It Easy',
			cost: ['miner', 'miner', 'miner'],
			damage: 100,
			power:
				'Flip a coin.\nIf heads, your opponent must discard any effect card attached to their active Hermit.\nOnly one effect card per Hermit can be discarded using this ability.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			player.hooks.beforeAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !attacker) return

				if (opponentPlayer.board.activeRow === null) return
				const opponentActiveRow = getActiveRow(opponentPlayer)
				if (!opponentActiveRow) return
				const results = opponentPlayer.hooks.onSlotChange.call(
					getSlotPos(opponentPlayer, opponentPlayer.board.activeRow, 'effect')
				)
				if (results.includes(false)) return

				// Can't discard two items on the same hermit
				if (limit.includes(opponentActiveRow.hermitCard)) return

				const coinFlip = flipCoin(player, attacker.row.hermitCard)
				if (coinFlip[0] === 'tails') return

				limit.push(opponentActiveRow.hermitCard)

				discardCard(game, opponentActiveRow.effectCard)
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.beforeAttack.remove(this)
		},
	}
}

export default TinFoilChefUltraRareHermitCard
