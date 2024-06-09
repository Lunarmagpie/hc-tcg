import cn from 'classnames'
import css from './card.module.scss'
import Tooltip from 'components/tooltip'
import CardTooltip from './card-tooltip'
import HermitCardModule, {HermitCardProps} from './hermit-card-svg'
import EffectCardModule, {EffectCardProps} from './effect-card-svg'
import ItemCardModule, {ItemCardProps} from './item-card-svg'
import HealthCardModule, {HealthCardProps} from './health-card-svg'
import {Card} from 'common/cards/base/card'

interface CardProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	card: Card
	selected?: boolean
	picked?: boolean
	tooltipAboveModal?: boolean
	onClick?: () => void
}

const CardComponent = (props: CardProps) => {
	const {category} = props.card.props
	const {onClick, selected, picked, ...otherProps} = props
	let card = null
	if (category === 'hermit') card = <HermitCardModule {...(otherProps as HermitCardProps)} />
	else if (category === 'item') card = <ItemCardModule {...(otherProps as ItemCardProps)} />
	else if (['effect', 'single_use'].includes(category))
		card = <EffectCardModule {...(otherProps as EffectCardProps)} />
	else if (category === 'health') card = <HealthCardModule {...(otherProps as HealthCardProps)} />
	else throw new Error('Unsupported card category: ' + category)
	return (
		<Tooltip tooltip={<CardTooltip card={props.card} />} showAboveModal={props.tooltipAboveModal}>
			<button
				{...props}
				className={cn(props.className, css.card, {
					[css.selected]: selected,
					[css.picked]: picked,
				})}
				onClick={onClick}
			>
				{card}
			</button>
		</Tooltip>
	)
}

export default CardComponent
