import classnames from 'classnames'
import HermitCard from '../../../../common/cards/base/hermit-card'
import css from './hermit-card-svg.module.scss'
import {useSelector} from 'react-redux'
import {getGameState} from 'logic/game/game-selectors'
import {getCardRank} from 'common/utils/ranks'
import {EXPANSIONS} from 'common/config'
import {memo} from 'react'

export type HermitCardProps = {
	card: HermitCard
}

const COST_PAD = 20
const COST_SIZE = 28
const COST_X = [
	[COST_PAD + COST_SIZE],
	[COST_PAD + COST_SIZE / 2, COST_PAD + COST_SIZE + COST_SIZE / 2],
	[COST_PAD, COST_PAD + COST_SIZE, COST_PAD + COST_SIZE * 2],
]

const HermitCardModule = memo(({card}: HermitCardProps) => {
	const hermitFullName = card.id.split('_')[0]

	const rank = getCardRank(card.id)
	const palette = card.getPalette()
	const backgroundName = card.getBackground()
	const showCost = !useSelector(getGameState)
	const name = card.getShortName()
	const nameLength = name.length
	const disabled = EXPANSIONS.disabled.includes(card.getExpansion()) ? 'disabled' : 'enabled'

	return (
		<svg
			className={classnames(css.card, css[disabled])}
			width="100%"
			height="100%"
			viewBox="0 0 400 400"
		>
		</svg>
	)
})

export default HermitCardModule
