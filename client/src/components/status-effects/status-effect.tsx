import cn from 'classnames'
import css from './status-effect.module.scss'
import Tooltip from 'components/tooltip'
import StatusEffectTooltip from './status-effect-tooltip'
import StatusEffect from 'common/status-effects/status-effect'

interface StatusEffectProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	statusEffect: StatusEffect
	duration?: number | undefined
}

const StatusEffectComponent = (props: StatusEffectProps) => {
	const {id, damageEffect} = props.statusEffect

	const extension = ['sleeping', 'poison', 'fire'].includes(id) ? '.gif' : '.png'
	const StatusEffect = damageEffect == true ? css.damageStatusEffectImage : css.statusEffectImage

	return (
		<Tooltip
			tooltip={<StatusEffectTooltip statusEffect={props.statusEffect} duration={props.duration} />}
		>
			<div className={css.statusEffect}>
				<img className={StatusEffect} src={'/images/status/' + id + extension}></img>
				{props.duration !== undefined && <p className={css.durationIndicator}>{props.duration}</p>}
			</div>
		</Tooltip>
	)
}

export default StatusEffectComponent
