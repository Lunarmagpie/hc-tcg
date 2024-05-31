import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {defaultCardInfo} from '../../base/card'
import {CustomAttachHermitCard} from '../../base/hermit-card'

const PearlescentMoonRareHermitCard = (): CustomAttachHermitCard => {
	return {
		...defaultCardInfo,
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
		sidebarDescriptions: [
			{
				type: 'glossary',
				name: 'missed',
			},
		],
		onAttach: (instance: CustomAttachHermitCard, game: GameModel, pos: CardPosModel) => {
			const {player, opponentPlayer} = pos
			let status: 'none' | 'missed' | 'heads' | 'tails' = 'none'
			status = 'none'

			player.hooks.onAttack.add(instance, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== instance || attack.type !== 'secondary' || !attacker) return

				if (status === 'missed') {
					status = 'none'
					return
				}

				const attackerHermit = attacker.row.hermitCard
				opponentPlayer.hooks.beforeAttack.add(instance, (attack) => {
					if (!attack.isType('primary', 'secondary')) return

					const hasFlipped = status === 'heads' || status === 'tails'

					// Only flip a coin once
					if (!hasFlipped) {
						const coinFlip = flipCoin(player, attackerHermit, 1, opponentPlayer)
						status = coinFlip[0]
					}

					if (status === 'heads') {
						attack.multiplyDamage(instance.id, 0).lockDamage(instance.id)
					}
				})

				opponentPlayer.hooks.onTurnEnd.add(instance, () => {
					if (status === 'heads') status = 'missed'

					opponentPlayer.hooks.beforeAttack.remove(instance)
					opponentPlayer.hooks.onTurnEnd.remove(instance)
				})
			})

			// If the opponent missed the previous turn and we switch hermits or we don't
			// attack this turn then we reset the status
			player.hooks.onTurnEnd.add(instance, () => {
				status = 'none'
			})
		},

		onDetach: (instance: CustomAttachHermitCard, game: GameModel, pos: CardPosModel) => {
			const {player, opponentPlayer} = pos
			player.hooks.onAttack.remove(instance)
			player.hooks.onTurnEnd.remove(instance)
			opponentPlayer.hooks.beforeAttack.remove(instance)
			opponentPlayer.hooks.onTurnEnd.remove(instance)
		},
	}
}

export default PearlescentMoonRareHermitCard
