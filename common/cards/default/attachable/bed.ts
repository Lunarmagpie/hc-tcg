import { AttachableCard, attachableCardDefaults } from '../../base/attachable-card'
import { GameModel } from '../../../models/game-model'
import { discardCard } from '../../../utils/movement'
import { CardPosModel } from '../../../models/card-pos-model'
import { applyStatusEffect } from '../../../utils/board'
import { HermitCard } from '../../base/hermit-card'
import SleepingStatusEffect from '../../../status-effects/sleeping'
import { combinators } from '../../base/attachable'

const BedAttachableCard = (): AttachableCard => {
	return {
		...attachableCardDefaults,
		id: 'bed',
		numericId: 2,
		name: 'Bed',
		rarity: 'ultra_rare',
		description:
			'Attach to your active Hermit. This Hermit restores all HP, then sleeps for the rest of this turn, and the following two turns, before waking up. Discard after your Hermit wakes up.',
		log: null,
		canBeAttachedTo: combinators.every(combinators.player, combinators.effect, combinators.activeRow),
		onAttach(game: GameModel, pos: CardPosModel) {
			// Give the current row sleeping for 3 turns
			const { player, row } = pos
			let hermitSlot: HermitCard;

			if (row && row.hermitCard) {
				applyStatusEffect(game, SleepingStatusEffect(row.hermitCard))
			}

			// Knockback/Tango/Jevin/etc
			player.hooks.onTurnStart.add(this, () => {
				const isSleeping = game.state.statusEffects.some(
					(effect) => effect.target == row?.hermitCard && effect.id == 'sleeping'
				)
				if (!isSleeping) {
					discardCard(game, row?.effectCard || null)
					return
				}
			})

			player.hooks.beforeApply.add(this, () => {
				if (!row?.hermitCard) return
				hermitSlot = row?.hermitCard
			})

			//Ladder
			player.hooks.afterApply.add(this, () => {
				if (hermitSlot != row?.hermitCard && row && row.hermitCard) {
					row.health = hermitSlot.health

					// Add new sleeping statusEffect
					applyStatusEffect(game, SleepingStatusEffect(row.hermitCard))
				}
			})

			player.hooks.onTurnEnd.add(this, () => {
				const isSleeping = game.state.statusEffects.some(
					(effect) => effect.target == row?.hermitCard && effect.id == 'sleeping'
				)

				// if sleeping has worn off, discard the bed
				if (!isSleeping) {
					discardCard(game, row?.effectCard || null)
					player.hooks.onTurnEnd.remove(this)
				}
			})
		},

		onDetach(game: GameModel, pos: CardPosModel) {
			const { player } = pos
			player.hooks.onTurnEnd.remove(this)
			player.hooks.onTurnStart.remove(this)
			player.hooks.beforeApply.remove(this)
			player.hooks.afterApply.remove(this)
		},

		sidebarDescriptions:
			[
				{
					type: 'statusEffect',
					name: 'sleeping',
				},
			]
	}
}

export default BedAttachableCard
