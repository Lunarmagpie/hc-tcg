import { CardPosModel } from '../../../models/card-pos-model'
import { GameModel } from '../../../models/game-model'
import { isTargetingPos } from '../../../utils/attacks'
import { discardCard } from '../../../utils/movement'
import { removeStatusEffect } from '../../../utils/board'
import { AttachableCard, attachableCardDefaults } from '../../base/attachable-card'
import { Card, HasAttach } from '../../base/card'

class TotemEffectCard extends Card<AttachableCard> implements HasAttach {
	override props: AttachableCard = {
		...attachableCardDefaults,
		id: 'totem',
		numericId: 101,
		name: 'Totem',
		rarity: 'ultra_rare',
		description:
			'If the Hermit this card is attached to is knocked out, they are revived with 10hp.\nDoes not count as a knockout. Discard after use.',
		sidebarDescriptions: [
			{
				type: 'glossary',
				name: 'knockout',
			},
		]
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const { player, opponentPlayer } = pos

		// If we are attacked from any source
		// Add before any other hook so they can know a hermits health reliably
		player.hooks.afterDefence.addBefore(this, (attack) => {
			const target = attack.getTarget()
			if (!isTargetingPos(attack, pos) || !target) return
			const { row } = target
			if (row.health) return

			row.health = 10

			const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
				return ail.target === pos.card
			})
			statusEffectsToRemove.forEach((ail) => {
				removeStatusEffect(game, pos, ail)
			})

			const revivedHermit = row.hermitCard.name

			game.battleLog.addEntry(player.id, `Using $eTotem$, $p${revivedHermit}$ revived with $g10hp$`)

			// This will remove this hook, so it'll only be called once
			discardCard(game, row.effectCard)
		})

		// Also hook into afterAttack of opponent before other hooks, so that health will always be the same when their hooks are called
		// @TODO this is slightly more hacky than I'd like
		opponentPlayer.hooks.afterAttack.addBefore(this, (attack) => {
			const target = attack.getTarget()
			if (!isTargetingPos(attack, pos) || !target) return
			const { row } = target
			if (row.health) return

			row.health = 10

			const thisHermitId = pos.row?.hermitCard

			const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
				return ail.target === thisHermitId
			})
			statusEffectsToRemove.forEach((ail) => {
				removeStatusEffect(game, pos, ail)
			})

			// This will remove this hook, so it'll only be called once
			discardCard(game, row.effectCard)
		})
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		pos.player.hooks.afterDefence.remove(this)
		pos.opponentPlayer.hooks.afterAttack.remove(this)
	}

}

export default TotemEffectCard
