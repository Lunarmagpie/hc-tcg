import React from 'react'
import {HermitTypeT} from 'common/types/cards'
import css from './card-tooltip.module.scss'
import {STRENGTHS} from 'common/const/strengths'
import {getCardRank} from 'common/utils/ranks'
import {EXPANSIONS} from 'common/config'
import classNames from 'classnames'
import {GLOSSARY} from 'common/glossary'
import {useSelector} from 'react-redux'
import {getSettings} from 'logic/local-settings/local-settings-selectors'
import {FormattedText} from 'components/formatting/formatting'
import {Card} from 'common/cards/base/card'

const HERMIT_TYPES: Record<string, string> = {
	balanced: 'Balanced',
	builder: 'Builder',
	speedrunner: 'Speedrunner',
	redstone: 'Redstone',
	farm: 'Farm',
	pvp: 'PvP',
	terraform: 'Terraform',
	prankster: 'Prankster',
	miner: 'Miner',
	explorer: 'Explorer',
}

type Props = {
	card: Card
}

const getDescription = (card: Card): React.ReactNode => {
	return FormattedText(card.props.getDescription())
}

const joinJsx = (array: Array<React.ReactNode>) => {
	if (array.length === 0) return <span>None</span>
	if (array.length < 2) return array
	return array.reduce((prev: any, curr: any): any => [prev, ' ', curr])
}

const getStrengthsAndWeaknesses = (card: Card): React.ReactNode => {
	if (card.props.category !== 'hermit') return null
	if (!card.implementsHasHermitType()) return null

	const strengths = STRENGTHS[card.props.hermitType]
	const weaknesses = Object.entries(STRENGTHS)
		.filter(([, value]) => value.includes(card.props.hermitType))
		.map(([key]) => key) as Array<HermitTypeT>

	const result = (
		<div className={css.strengthsAndWeaknesses}>
			<div className={css.strengths}>
				<span className={css.swTitle}>Strengths: </span>
				{joinJsx(
					strengths.map((hermitType) => (
						<span key={hermitType} className={css[hermitType]}>
							{HERMIT_TYPES[hermitType]}
						</span>
					))
				)}
			</div>
			<div className={css.weaknesses}>
				<span className={css.swTitle}>Weaknesses: </span>
				{joinJsx(
					weaknesses.map((hermitType) => (
						<span key={hermitType} className={css[hermitType]}>
							{HERMIT_TYPES[hermitType]}
						</span>
					))
				)}
			</div>
		</div>
	)
	return result
}

const getName = (card: Card): React.ReactNode => {
	let className = classNames(
		css.name,
		card.implementsHasHermitType() ? css[card.props.hermitType] : ''
	)
	return <div className={className}>{card.props.name}</div>
}

const getRank = (card: Card): React.ReactNode => {
	const {name, cost} = getCardRank(card.props.id)
	const highlight = name === 'stone' || name === 'iron' ? '■' : '★'
	return (
		<div className={classNames(css.rank, css[name])}>
			{highlight} {name.charAt(0).toUpperCase() + name.slice(1)} Rank {highlight}
		</div>
	)
}

const getExpansion = (card: Card): React.ReactNode => {
	if (card.props.expansion !== 'default') {
		const expansion = card.props.expansion
		return (
			<div className={classNames(css.expansion, css[expansion])}>
				■ {(EXPANSIONS.expansions as Record<string, string>)[expansion]} Card ■
			</div>
		)
	}
}

const getHermitType = (card: Card): React.ReactNode => {
	if (card.props.category === 'hermit' && card.implementsHasHermitType()) {
		return (
			<div className={classNames(css.hermitType, css[card.props.hermitType])}>
				{HERMIT_TYPES[card.props.hermitType] || card.props.hermitType} Type
			</div>
		)
	}
	return null
}

const getSidebarDescriptions = (card: Card): React.ReactNode => {
	// return card.props.sidebarDescriptions.map((description, i) => {
	// 	if (description.type === 'statusEffect') {
	// 		const statusEffect = description.name
	// 		return (
	// 			<div key={i} className={classNames(css.cardTooltip, css.small)}>
	// 				<b>
	// 					<u>{statusEffect.name}</u>
	// 				</b>
	// 				<p>{statusEffect.description}</p>
	// 			</div>
	// 		)
	// 	}
	// 	if (description.type === 'glossary') {
	// 		const glossaryItem = description.name
	// 		return (
	// 			<div key={i} className={classNames(css.cardTooltip, css.small)}>
	// 				<b>
	// 					<u>{GLOSSARY[glossaryItem].name}</u>
	// 				</b>
	// 				<p>{GLOSSARY[glossaryItem].description}</p>
	// 			</div>
	// 		)
	// 	}
	// })
	return <div></div>
}

const CardTooltip = ({card}: Props) => {
	const settings = useSelector(getSettings)

	return (
		<div className={css.cardTooltipContainer}>
			{settings.showAdvancedTooltips === 'on' && (
				<div className={css.tooltipBelow}>{getSidebarDescriptions(card)}</div>
			)}
			<div className={css.cardTooltip}>
				<div className={css.topLine} key={0}>
					{getName(card)}
					{getHermitType(card)}
				</div>
				<div className={css.description} key={1}>
					{getExpansion(card)}
					{getRank(card)}
					{getStrengthsAndWeaknesses(card)}
					{getDescription(card)}
				</div>
				<div></div>
			</div>
		</div>
	)
}

export default CardTooltip
