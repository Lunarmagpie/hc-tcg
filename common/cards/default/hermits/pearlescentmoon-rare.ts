import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {OverridesAttach, OverridesDetach, defaultHermitDisplayInfo} from '../../base/card'
import {HermitCard} from '../../base/hermit-card'

const PearlescentMoonRareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...defaultHermitDisplayInfo,
		category: 'hermit',
		id: 'pearlescentmoon_rare',
		numericId: 85,
		name: 'Pearl',
		rarity: 'rare',
		hermitType: 'terraform',
		health: 300,
		primary: {
			name: 'Cleaning Lady',
			cost: ['terraform'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Aussie Ping',
			cost: ['terraform', 'any'],
			damage: 70,
			power:
				'If your opponent attacks on their next turn, flip a coin.\nIf heads, their attack $kmisses$. Your opponent can not miss due to this ability on consecutive turns.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
			let status: 'none' | 'missed' | 'heads' | 'tails' = 'none'
			status = 'none'

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !attacker) return

				if (status === 'missed') {
					status = 'none'
					return
				}

				const attackerHermit = attacker.row.hermitCard
				opponentPlayer.hooks.beforeAttack.add(this, (attack) => {
					if (!attack.isType('primary', 'secondary')) return

					const hasFlipped = status === 'heads' || status === 'tails'

					// Only flip a coin once
					if (!hasFlipped) {
						const coinFlip = flipCoin(player, attackerHermit, 1, opponentPlayer)
						status = coinFlip[0]
					}

					if (status === 'heads') {
						attack.multiplyDamage(this.id, 0).lockDamage(this.id)
					}
				})

				opponentPlayer.hooks.onTurnEnd.add(this, () => {
					if (status === 'heads') status = 'missed'

					opponentPlayer.hooks.beforeAttack.remove(this)
					opponentPlayer.hooks.onTurnEnd.remove(this)
				})
			})

			// If the opponent missed the previous turn and we switch hermits or we don't
			// attack this turn then we reset the status
			player.hooks.onTurnEnd.add(this, () => {
				status = 'none'
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
			player.hooks.onAttack.remove(this)
			player.hooks.onTurnEnd.remove(this)
			opponentPlayer.hooks.beforeAttack.remove(this)
			opponentPlayer.hooks.onTurnEnd.remove(this)
		},
		sidebarDescriptions: [
			{
				type: 'glossary',
				name: 'missed',
			},
		],
	}
}

export default PearlescentMoonRareHermitCard
