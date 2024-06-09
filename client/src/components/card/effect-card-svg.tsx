import css from './effect-card-svg.module.scss'
import {useSelector} from 'react-redux'
import {getGameState} from 'logic/game/game-selectors'
import EffectCard from 'common/cards/base/effect-card'
import SingleUseCard from 'common/cards/base/single-use-card'
import {getCardRank} from 'common/utils/ranks'
import {EXPANSIONS} from 'common/config'
import classNames from 'classnames'
import {memo} from 'react'

export type EffectCardProps = {
	card: EffectCard | SingleUseCard
}

const EffectCardModule = memo(({card}: EffectCardProps) => {
	const rank = getCardRank(card.id)
	const showCost = !useSelector(getGameState)
	const disabled = EXPANSIONS.disabled.includes(card.getExpansion()) ? 'disabled' : 'enabled'

	return (
		<svg
			className={classNames(css.card, css[disabled])}
			width="100%"
			height="100%"
			viewBox="0 0 400 400"
		>
		</svg>

	)
})

export default EffectCardModule
