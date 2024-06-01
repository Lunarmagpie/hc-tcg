import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach, overridesAttachDefaults} from '../../base/card'

const FalseSymmetryRareHermitCard = (): HermitCard & HasAttach => {
	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'falsesymmetry_rare',
		numericId: 23,
		name: 'False',
		rarity: 'rare',
		hermitType: 'builder',
		health: 250,
		primary: {
			name: 'High Noon',
			cost: ['builder'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Supremacy',
			cost: ['builder', 'any'],
			damage: 70,
			power: 'Flip a coin.\nIf heads, heal this Hermit 40hp.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !attacker) return

				const coinFlip = flipCoin(player, attacker.row.hermitCard)

				if (coinFlip[0] === 'tails') return

				// Heal 40hp
				const maxHealth = Math.max(attacker.row.health, attacker.row.hermitCard.health)
				attacker.row.health = Math.min(attacker.row.health + 40, maxHealth)

				game.battleLog.addEntry(player.id, `$p${attacker.row.hermitCard.name}$ healed $g40hp$`)
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default FalseSymmetryRareHermitCard
