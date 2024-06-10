import {HasDuration, StatusEffect, StatusEffectProps} from './status-effect'
import {GameModel} from '../models/game-model'
import {CardPosModel, getBasicCardPos} from '../models/card-pos-model'
import {removeStatusEffect} from '../utils/board'
import {Card} from '../cards/base/card'

class SleepingStatusEffect extends StatusEffect<StatusEffectProps & HasDuration> {
	constructor(target: Card) {
		super({
			id: 'sleeping',
			name: 'Sleep',
			description:
				'While your Hermit is sleeping, you can not attack or make your active Hermit go AFK. If sleeping Hermit is made AFK by your opponent, they wake up.',
			duration: 3,
			damageEffect: false,
			target: target,
		})
	}

<<<<<<< HEAD
	override onApply(game: GameModel, pos: CardPosModel) {
		const {player, card, row, rowIndex} = pos

		if (!card || !row || !rowIndex || !card.implementsHasHealth()) return
=======
	override onApply(game: GameModel, statusEffectInfo: StatusEffectT, pos: CardPosModel) {
		const {player, card, row, rowIndex} = pos

		if (!card || !row?.hermitCard || rowIndex === null) return
>>>>>>> upstream/dev

		game.state.statusEffects.push(this)
		game.addBlockedActions(
			this.props.id,
			'PRIMARY_ATTACK',
			'SECONDARY_ATTACK',
			'CHANGE_ACTIVE_HERMIT'
		)

		row.health = card.props.health

		game.battleLog.addEntry(
			player.id,
<<<<<<< HEAD
			`$p${card.props.name}$ went to $eSleep$ and restored $gfull health$`
		)
=======
			`$p${HERMIT_CARDS[card.cardId].name}$ went to $eSleep$ and restored $gfull health$`
		)

		player.hooks.onTurnStart.add(statusEffectInfo.statusEffectInstance, () => {
			const targetPos = getBasicCardPos(game, statusEffectInfo.targetInstance)
			if (!targetPos || !statusEffectInfo.duration) return
			statusEffectInfo.duration--
>>>>>>> upstream/dev

		player.hooks.onTurnStart.add(this, () => {
			const targetPos = getBasicCardPos(game, this.props.target)
			if (!targetPos) return
			this.props.duration--

			if (this.props.duration === 0 || player.board.activeRow !== targetPos.rowIndex) {
				removeStatusEffect(game, pos, this)
				return
			}

			if (player.board.activeRow === targetPos.rowIndex)
				game.addBlockedActions(
					this.props.id,
					'PRIMARY_ATTACK',
					'SECONDARY_ATTACK',
					'CHANGE_ACTIVE_HERMIT'
				)
		})

		player.hooks.afterDefence.add(this, (attack) => {
			const attackTarget = attack.getTarget()
			if (!attackTarget) return
			if (attackTarget.row.hermitCard !== this.props.target) return
			if (attackTarget.row.health > 0) return
			removeStatusEffect(game, pos, this)
		})
	}

	override onRemoval(game: GameModel, pos: CardPosModel) {
		const {player} = pos
		player.hooks.onTurnStart.remove(this)
		player.hooks.afterDefence.remove(this)
	}
}

export default SleepingStatusEffect
