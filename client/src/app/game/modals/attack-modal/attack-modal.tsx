import Modal from 'components/modal'
import {useSelector, useDispatch} from 'react-redux'
import {getPlayerActiveRow, getOpponentActiveRow} from '../../game-selectors'
import css from '../game-modals.module.scss'
import {getPlayerId} from 'logic/session/session-selectors'
import {getAvailableActions, getPlayerStateById} from 'logic/game/game-selectors'
import {startAttack} from 'logic/game/game-actions'
import Attack from './attack'

type Props = {
	closeModal: () => void
}
function AttackModal({closeModal}: Props) {
	const dispatch = useDispatch()
	const activeRow = useSelector(getPlayerActiveRow)
	const opponentRow = useSelector(getOpponentActiveRow)
	const availableActions = useSelector(getAvailableActions)
	const playerId = useSelector(getPlayerId)
	const playerState = useSelector(getPlayerStateById(playerId))
	const singleUseCard = playerState?.board.singleUseCard

	if (!activeRow || !playerState || !activeRow.hermitCard) return null
	if (!opponentRow || !opponentRow.hermitCard) return null
	if (availableActions.includes('WAIT_FOR_TURN')) return null

	const hermitFullName = activeRow.hermitCard.props.id.split('_')[0]

	const handleAttack = (type: 'single-use' | 'primary' | 'secondary') => {
		dispatch(startAttack(type))
		closeModal()
	}

	const effectAttack = () => handleAttack('single-use')
	const primaryAttack = () => handleAttack('primary')
	const secondaryAttack = () => handleAttack('secondary')

	const attacks = []
	if (singleUseCard && availableActions.includes('SINGLE_USE_ATTACK')) {
		attacks.push(
			<Attack
				key="single-use"
				name={singleUseCard.props.name}
				icon={`/images/effects/${singleUseCard.props.id}.png`}
				attackInfo={null}
				onClick={effectAttack}
			/>
		)
	}

	if (availableActions.includes('PRIMARY_ATTACK')) {
		attacks.push(
			<Attack
				key="primary"
				name={activeRow.hermitCard.props.primary.name}
				icon={`/images/hermits-nobg/${hermitFullName}.png`}
				attackInfo={activeRow.hermitCard.props.primary}
				onClick={primaryAttack}
			/>
		)
	}

	if (availableActions.includes('SECONDARY_ATTACK')) {
		attacks.push(
			<Attack
				key="secondary"
				name={activeRow.hermitCard.props.secondary.name}
				icon={`/images/hermits-nobg/${hermitFullName}.png`}
				attackInfo={activeRow.hermitCard.props.secondary}
				onClick={secondaryAttack}
			/>
		)
	}

	return (
		<Modal title="Attack" closeModal={closeModal} centered>
			<div className={css.description}>
				{attacks.length ? (
					<>
						<Modal.Notice icon={'!'}>Attacking will end your turn!</Modal.Notice>
						{attacks}
					</>
				) : (
					<span>No attacks available.</span>
				)}
			</div>
		</Modal>
	)
}

export default AttackModal
