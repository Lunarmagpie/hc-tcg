import {RowState} from 'common/types/game-state'
import css from './board.module.scss'
import cn from 'classnames'
import {SlotInfo} from 'common/types/server-requests'
import {BoardSlotTypeT} from 'common/types/cards'
import StatusEffect from 'common/status-effects/status-effect'
import {Card} from 'common/cards/base/card'
import SlotComponent from './board-slot'

const getCardBySlot = (slot: SlotInfo, row: RowState | null): Card | null => {
	if (!row) return null
	if (slot.type === 'hermit') return row.hermitCard || null
	if (slot.type === 'effect') return row.effectCard || null
	if (slot.type === 'item') return row.itemCards[slot.index] || null
	return null
}

type BoardRowProps = {
	type: 'left' | 'right'
	onClick: (card: Card | null, slot: SlotInfo) => void
	rowState: RowState
	active: boolean
	statusEffects: Array<StatusEffect>
}
const BoardRow = ({type, onClick, rowState, active, statusEffects}: BoardRowProps) => {
	const slotTypes: Array<BoardSlotTypeT> = ['item', 'item', 'item', 'effect', 'hermit', 'health']
	const slots = slotTypes.map((slotType, index) => {
		const slotInfo: SlotInfo = {type: slotType, index: index < 3 ? index : 0}
		const card = getCardBySlot(slotInfo, rowState)
		const cssId = slotType === 'item' ? slotType + (index + 1) : slotType
		return (
			<SlotComponent
				cssId={cssId}
				onClick={() => onClick(card, slotInfo)}
				card={card}
				rowState={rowState}
				active={active}
				key={slotType + '-' + index}
				type={slotType}
				statusEffects={statusEffects}
			/>
		)
	})

	return (
		<div
			className={cn(css.row, {
				[css.active]: active,
				[css.reversed]: type === 'right',
			})}
		>
			{slots}
		</div>
	)
}

export default BoardRow
