import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach, overridesAttachDefaults} from '../../base/card'
import {getActiveRowPos} from '../../../utils/board'
const XBCraftedRareHermitCard = (): HermitCard & HasAttach => {
	let ignore: boolean = false

	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'xbcrafted_rare',
		numericId: 110,
		name: 'xB',
		rarity: 'rare',
		hermitType: 'explorer',
		health: 270,
		primary: {
			name: 'Giggle',
			cost: ['explorer'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Noice!',
			cost: ['explorer', 'any'],
			damage: 70,
			power:
				"Any effect card attached to your opponent's active Hermit is ignored during this turn.",
		},
		getAttack(game, pos, hermitAttackType) {
			const attack = {...this, ...hermitCardDefaults}.getAttack(game, pos, hermitAttackType)
			if (!attack) return null

			if (attack.type === 'secondary') {
				// Noice attack, set flag to ignore target effect card
				ignore = true
			}

			return attack
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			player.hooks.beforeAttack.addBefore(this, (attack) => {
				if (!ignore) return
				const opponentActivePos = getActiveRowPos(opponentPlayer)
				if (!opponentActivePos) return

				// All attacks from our side should ignore opponent attached effect card this turn
				attack.shouldIgnoreCards.push((instance) => {
					if (!pos || !pos.row || !pos.row.effectCard) return false

					// It's not the targets effect card, do not ignore it
					if (pos.slot.type !== 'effect') return false

					// Not attached to the same row as the opponent's active Hermit, do not ignore it
					if (pos.rowIndex !== opponentActivePos.rowIndex) return false

					// Do not ignore the player's effect.
					if (pos.player === player) return false

					return true
				})
			})

			player.hooks.onTurnEnd.add(this, () => {
				// Remove ignore flag
				ignore = false
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.beforeAttack.remove(this)
			player.hooks.afterAttack.remove(this)
		},
	}
}

export default XBCraftedRareHermitCard
