import classnames from 'classnames'
import ItemCard from '../../../../common/cards/base/item-card'
import css from './item-card-svg.module.scss'
import {useSelector} from 'react-redux'
import {getGameState} from 'logic/game/game-selectors'
import {getCardRank} from 'common/utils/ranks'
import {memo} from 'react'

export type ItemCardProps = {
	card: ItemCard
}

const ItemCardModule = memo(({card}: ItemCardProps) => {
	const rank = getCardRank(card.id)
	const showCost = !useSelector(getGameState)
	return <svg className={css.card} width="100%" height="100%" viewBox="0 0 400 400"></svg>
})

export default ItemCardModule
