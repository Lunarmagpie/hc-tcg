import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {applyStatusEffect} from '../../../utils/board'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {Card, HasAttach, overridesAttachDefaults} from '../../base/card'
import UsedClockStatusEffect from '../../../status-effects/used-clock'

const JoeHillsRareHermitCard = (): HermitCard & HasAttach => {
	let skipped: Card | null = null

	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'joehills_rare',
		numericId: 70,
		name: 'Joe',
		rarity: 'rare',
		hermitType: 'farm',
		health: 270,
		primary: {
			name: 'Grow Hills',
			cost: ['farm'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Time Skip',
			cost: ['farm', 'farm', 'any'],
			damage: 90,
			power:
				'Flip a coin.\nIf heads, your opponent skips their next turn. "Time Skip" can not be used consecutively if successful.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
			// null | card instance
			skipped = null

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (!attacker || attack.type !== 'secondary') return

				if (game.state.statusEffects.some((effect) => effect.id === 'used-clock')) {
					return
				}

				const coinFlip = flipCoin(player, attacker.row.hermitCard, 1)
				if (coinFlip[0] !== 'heads') return

				attack.log = (values) =>
					`${values.attacker} ${values.coinFlip}, attacked ${values.target} with ${values.attackName} for ${values.damage} damage, then skipped  {$o${values.opponent}'s$|your} turn`

				// This will tell us to block actions at the start of our next turn
				// Storing the cardInstance of the card that attacked
				skipped = attacker.row.hermitCard

				applyStatusEffect(game, UsedClockStatusEffect(this))

				// Block all actions of opponent for one turn
				opponentPlayer.hooks.onTurnStart.add(this, () => {
					game.addBlockedActions(
						this.id,
						'APPLY_EFFECT',
						'REMOVE_EFFECT',
						'SINGLE_USE_ATTACK',
						'PRIMARY_ATTACK',
						'SECONDARY_ATTACK',
						'PLAY_HERMIT_CARD',
						'PLAY_ITEM_CARD',
						'PLAY_SINGLE_USE_CARD',
						'PLAY_EFFECT_CARD'
					)
					opponentPlayer.hooks.onTurnStart.remove(this)
				})
			})

			// Block secondary attack if we skipped
			player.hooks.onTurnStart.add(this, () => {
				const sameActive = game.activeRow?.hermitCard === skipped
				if (skipped && sameActive) {
					// We skipped last turn and we are still the active hermit, block secondary attacks
					game.addBlockedActions(this.id, 'SECONDARY_ATTACK')
				}

				skipped = null
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
			player.hooks.onTurnStart.remove(this)
		},
		sidebarDescriptions: [
			{
				type: 'glossary',
				name: 'turnSkip',
			},
		],
	}
}

export default JoeHillsRareHermitCard
