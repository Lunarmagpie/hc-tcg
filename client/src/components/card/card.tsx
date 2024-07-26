import cn from 'classnames'
import css from './card.module.scss'
import Tooltip from 'components/tooltip'
import CardInstanceTooltip from './card-tooltip'
import HermitCardModule, {HermitCardProps} from './hermit-card-svg'
import EffectCardModule, {EffectCardProps} from './effect-card-svg'
import ItemCardModule, {ItemCardProps} from './item-card-svg'
import {CardProps} from 'common/cards/base/types'
import {WithoutFunctions} from 'common/types/server-requests'
import {useEffect, useMemo, useRef, useState} from 'react'

interface CardReactProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	card: WithoutFunctions<CardProps>
	selected?: boolean
	picked?: boolean
	unpickable?: boolean
	tooltipAboveModal?: boolean
	onClick?: () => void
}

/** https://bobbyhadz.com/blog/react-check-if-element-in-viewport */
function useIsInViewport(ref) {
	const [isIntersecting, setIsIntersecting] = useState(false)

	const observer = useMemo(
		() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)),
		[]
	)

	useEffect(() => {
		observer.observe(ref.current)

		return () => {
			observer.disconnect()
		}
	}, [ref, observer])

	return isIntersecting
}

const Card = (props: CardReactProps) => {
	const {category} = props.card
	const {onClick, selected, picked, unpickable, ...otherProps} = props
	let card = null
	if (category === 'hermit') card = <HermitCardModule {...(otherProps as HermitCardProps)} />
	else if (category === 'item') card = <ItemCardModule {...(otherProps as ItemCardProps)} />
	else if (['attach', 'single_use'].includes(category))
		card = <EffectCardModule {...(otherProps as EffectCardProps)} />
	else throw new Error('Unsupported card category: ' + category)

	let ref = useRef(null)
	let inViewport = useIsInViewport(ref)

	let inside = <div className={css.placeholder}> </div>

	if (inViewport) {
		inside = card
	}

	return (
		<div ref={ref}>
			<Tooltip
				tooltip={<CardInstanceTooltip card={props.card} />}
				showAboveModal={props.tooltipAboveModal}
			>
				<button
					className={cn(props.className, css.card, {
						[css.selected]: selected,
						[css.picked]: picked,
						[css.unpickable]: unpickable,
					})}
					onClick={unpickable ? () => {} : onClick}
				>
					{inside}
				</button>
			</Tooltip>
		</div>
	)
}

export default Card
