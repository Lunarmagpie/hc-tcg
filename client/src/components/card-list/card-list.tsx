import cn from 'classnames'
import CardComponent from 'components/card'
import css from './card-list.module.scss'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {Card} from 'common/cards/base/card'

type CardListProps = {
	cards: Array<Card>
	disabled?: Array<string>
	selected?: Array<Card | null>
	picked?: Array<Card>
	onClick?: (card: Card) => void
	wrap?: boolean
	tooltipAboveModal?: boolean
}

const CardList = (props: CardListProps) => {
	const {wrap, onClick, cards, disabled, selected, picked} = props

	console.log(cards)

	const cardsOutput = cards.map((card) => {
		const info = card
		const isSelected = selected ? selected.some((selectedCard) => card === selectedCard) : false
		const isPicked = !!picked?.find((pickedCard) => card === pickedCard)
		const isDisabled = !!disabled?.find((id) => card.props.id === id)

		return (
			<CSSTransition
				timeout={250}
				key={JSON.stringify(card)}
				unmountOnExit={true}
				classNames={{
					enter: css.enter,
					enterActive: css.enterActive,
					enterDone: css.enterDone,
					exit: css.exit,
					exitActive: css.exitActive,
				}}
			>
				<CardComponent
					key={JSON.stringify(card)}
					className={cn(css.card, {
						[css.clickable]: !!onClick && !isDisabled,
					})}
					onClick={onClick && !isDisabled ? () => onClick(card) : undefined}
					card={info}
					disabled={isDisabled}
					selected={isSelected}
					picked={!!isPicked}
					tooltipAboveModal={props.tooltipAboveModal}
				/>
			</CSSTransition>
		)
	})

	return (
		<TransitionGroup className={cn(css.cardList, {[css.wrap]: wrap})}>
			{cardsOutput}
		</TransitionGroup>
	)
}

export default CardList
