import classnames from 'classnames'
import {RowState} from 'common/types/game-state'
import css from './board.module.scss'
import {SlotTypeT} from 'common/types/cards'
import {Card} from 'common/cards/base/card'
import StatusEffectComponent from 'components/status-effects/status-effect'
import CardComponent from 'components/card'
import {StatusEffect} from 'common/status-effects/status-effect'
import {createCard} from 'common/cards'
import HealthCard from 'common/cards/base/health-card'

export type SlotProps = {
	type: SlotTypeT
	onClick?: () => void
	card: Card | null
	rowState?: RowState
	active?: boolean
	cssId?: string
	statusEffects: Array<StatusEffect>
}
const SlotComponent = ({
	type,
	onClick,
	card,
	rowState,
	active,
	cssId,
	statusEffects,
}: SlotProps) => {
	let cardInfo: Card | null = card
	if (type === 'health' && rowState?.health) {
		cardInfo = new HealthCard()
		if (!cardInfo || !cardInfo.implementsHasHealth()) return null
		cardInfo.props.health = rowState.health
	}

	function getDuration(statusEffect: StatusEffect): number {
		if (statusEffect.implementsDuration()) return statusEffect.props.duration
		if (statusEffect.implementsCounter()) return statusEffect.props.counter
		return 0
	}

	const renderStatusEffects = (cleanedStatusEffects: StatusEffect[]) => {
		return (
			<div className={css.statusEffectContainer}>
				{cleanedStatusEffects.map((statusEffect) => {
					if (!statusEffect) return null
					if (statusEffect.props.damageEffect == true) return null
					return (
						<StatusEffectComponent
							statusEffect={statusEffect}
							duration={getDuration(statusEffect)}
						/>
					)
				})}
			</div>
		)
	}
	const renderDamageStatusEffects = (cleanedStatusEffects: StatusEffect[] | null) => {
		return (
			<div className={css.damageStatusEffectContainer}>
				{cleanedStatusEffects
					? cleanedStatusEffects.map((statusEffect) => {
							if (!statusEffect) return null
							if (statusEffect.props.damageEffect == false) return null
							return <StatusEffectComponent statusEffect={statusEffect} />
					  })
					: null}
			</div>
		)
	}

	const hermitStatusEffects = Array.from(
		new Set(
			statusEffects
				.filter((a) => rowState?.hermitCard && a.props.target == rowState.hermitCard)
				.map((a) => a) || []
		)
	)
	const effectStatusEffects = Array.from(
		new Set(
			statusEffects.filter((a) => rowState?.effectCard && a.props.target == rowState.effectCard) ||
				[]
		)
	)
	const frameImg = type === 'hermit' ? '/images/game/frame_glow.png' : '/images/game/frame.png'

	return (
		<div
			onClick={onClick}
			id={css[cssId || 'slot']}
			className={classnames(css.slot, {
				[css.available]: !!onClick,
				[css[type]]: true,
				[css.empty]: !cardInfo,
				// [css.afk]: cardInfo && !active,
				// [css.afk]: cardInfo?.type === 'hermit' && !active,
				[css.afk]: !active && type !== 'single_use',
			})}
		>
			{cardInfo ? (
				<div className={css.cardWrapper}>
					<CardComponent card={createCard(cardInfo.props.id)} />
					{type === 'health'
						? renderStatusEffects(hermitStatusEffects)
						: type === 'effect'
						? renderStatusEffects(effectStatusEffects)
						: null}
					{type === 'health'
						? renderDamageStatusEffects(hermitStatusEffects)
						: type === 'effect'
						? renderDamageStatusEffects(effectStatusEffects)
						: renderDamageStatusEffects(null)}
				</div>
			) : type === 'health' ? null : (
				<img draggable="false" className={css.frame} src={frameImg} />
			)}
		</div>
	)
}

export default SlotComponent
