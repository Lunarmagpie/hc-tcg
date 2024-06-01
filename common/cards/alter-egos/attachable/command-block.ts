import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {AttachableCard, attachableCardDefaults} from '../../base/attachable-card'

const CommandBlockEffectCard = (): AttachableCard => {
	return {
		...attachableCardDefaults,
		id: 'command_block',
		numericId: 120,
		name: 'Command Block',
		rarity: 'rare',
		description:
			'The Hermit this card is attached to can use items of any type. Once attached, this card can not be removed from this Hermit.',
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onSlotChange.add(this, (slot) => {
				if (slot.rowIndex === pos.rowIndex && slot.slot.type === 'effect') return true
				return false
			})
			player.hooks.availableEnergy.add(this, (availableEnergy) => {
				const {activeRow, rows} = player.board

				// Make sure it's our row
				if (activeRow === null) return availableEnergy
				if (activeRow !== pos.rowIndex) return availableEnergy
				const row = rows[activeRow]

				// Make sure this row has our instance
				if (row.effectCard !== this) return availableEnergy

				// Turn all the energy into any energy
				return availableEnergy.map(() => 'any')
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.availableEnergy.remove(this)
			player.hooks.onSlotChange.remove(this)
		},
		expansion: 'alter_egos',
	}
}

export default CommandBlockEffectCard
