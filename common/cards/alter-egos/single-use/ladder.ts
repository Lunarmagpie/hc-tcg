import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {slot} from '../../../slot'
import {applySingleUse} from '../../../utils/board'
import {formatText} from '../../../utils/formatting'
import Card, {SingleUse, singleUse} from '../../base/card'
import SingleUseCard from '../../base/single-use-card'

class LadderSingleUseCard extends Card {
	pickCondition = slot.every(
		slot.player,
		slot.hermitSlot,
		slot.not(slot.empty),
		slot.adjacentTo(slot.activeRow)
	)

	props: SingleUse = {
		...singleUse,
		id: 'ladder',
		expansion: 'alter_egos',
		numericId: 143,
		name: 'Ladder',
		rarity: 'ultra_rare',
		description:
			'Before your attack, swap your active Hermit card with one of your adjacent AFK Hermit cards.\nAll cards attached to both Hermits, including health, remain in place. Your active Hermit remains active after swapping.',
		attachCondition: slot.every(
			singleUse.attachCondition,
			slot.someSlotFulfills(this.pickCondition)
		),
	}

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		game.addPickRequest({
			creator: this,
			playerId: player.id,
			message: 'Pick an AFK Hermit adjacent to your active Hermit',
			canPick: this.pickCondition,
			onResult(pickedSlot) {
				applySingleUse(game)

				game.swapSlots(
					pickedSlot,
					game.findSlot(slot.every(slot.player, slot.hermitSlot, slot.activeRow))
				)

				game.changeActiveRow(player, pickedSlot.rowIndex)
			},
		})
	}
}

export default LadderSingleUseCard
