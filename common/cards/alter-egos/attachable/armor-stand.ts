import { isTargetingPos } from '../../../utils/attacks'
import { GameModel } from '../../../models/game-model'
import { discardCard } from '../../../utils/movement'
import { CardPosModel } from '../../../models/card-pos-model'
import {
	EffectDisplayInfo,
	HasDescription,
	HasHealth,
	Card,
	OverridesAttach,
	OverridesDetach,
	effectDisplayInfoDefaults,
	hasDescriptionDefaults,
	hasHealthDefaults,
	isCardDefaults,
	overridesAttachDefaults,
	overridesDetachDefaults,
} from '../../base/card'
import { attachableCardDefaults } from '../../base/attachable-card'
import { PlayCardLog } from '../../../types/cards'
import combinators from '../../base/attachable'

const ArmorStandEffectCard = (): Card &
	EffectDisplayInfo &
	HasDescription &
	HasHealth &
	OverridesAttach &
	OverridesDetach => {
	return {
		...isCardDefaults,
		...effectDisplayInfoDefaults,
		...hasDescriptionDefaults,
		...hasHealthDefaults,
		...overridesAttachDefaults,
		...overridesDetachDefaults,
		...attachableCardDefaults,
		health: 50,
		id: 'armor_stand',
		numericId: 118,
		name: 'Armour Stand',
		rarity: 'ultra_rare',
		description:
			'Use like a Hermit card with a maximum 50hp.\nYou can not attach any cards to this card. While this card is active, you can not attack, or use damaging effect cards.\nIf this card is knocked out, it does not count as a knockout.',
		canBeAttachedTo: combinators.every(combinators.player, combinators.hermit),
		log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${values.pos.name}$`,
		onAttach(game: GameModel, pos: CardPosModel) {
			const { player, opponentPlayer, row } = pos
			if (!row) return

			if (player.board.activeRow === null) {
				game.changeActiveRow(player, pos.rowIndex)
			}

			// The menu won't show up but just in case someone tries to cheat
			player.hooks.blockedActions.add(this, (blockedActions) => {
				if (player.board.activeRow === pos.rowIndex) {
					blockedActions.push('PRIMARY_ATTACK')
					blockedActions.push('SECONDARY_ATTACK')
					blockedActions.push('SINGLE_USE_ATTACK')
				}

				return blockedActions
			})

			player.hooks.afterAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (!row.health && attacker && isTargetingPos(attack, pos)) {
					// Discard to prevent losing a life
					discardCard(game, row.hermitCard)

					const activeRow = player.board.activeRow
					const isActive = activeRow !== null && activeRow == pos.rowIndex
					if (isActive && attacker.player.id !== player.id) {
						// Reset the active row so the player can switch
						game.changeActiveRow(player, null)
					}
				}
			})

			opponentPlayer.hooks.afterAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (!row.health && attacker && isTargetingPos(attack, pos)) {
					// Discard to prevent losing a life
					const activeRow = player.board.activeRow
					const isActive = activeRow !== null && activeRow == pos.rowIndex
					if (isActive && attacker.player.id !== player.id) {
						// Reset the active row so the player can switch
						game.changeActiveRow(player, null)
					}
				}
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const { player, opponentPlayer, slot, row } = pos
			if (slot && slot.type === 'hermit' && row) {
				row.health = null
				row.effectCard = null
				row.itemCards = []
			}

			player.hooks.blockedActions.remove(this)
			player.hooks.afterAttack.remove(this)
			player.hooks.canAttach.remove(this)
			opponentPlayer.hooks.afterAttack.remove(this)
		},
		expansion: 'alter_egos',
		sidebarDescriptions: [
			{
				type: 'glossary',
				name: 'knockout',
			},
		],
	}
}

export default ArmorStandEffectCard
