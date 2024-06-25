import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {discardCard} from '../../../utils/movement'
import {applySingleUse, removeStatusEffect} from '../../../utils/board'
import {slot} from '../../../slot'
import Card, {Attachable, SingleUse, attachable, singleUse} from '../../base/card'
import {formatText} from '../../../utils/formatting'

class WaterBucket extends Card {
	props: Attachable & SingleUse = {
		...attachable,
		...singleUse,
		id: 'water_bucket',
		expansion: 'default',
		numericId: 105,
		name: 'Water Bucket',
		rarity: 'common',
		description: formatText(
			'Remove burn and String from one of your Hermits.\nIf attached, prevents the Hermit this card is attached to from being burned.'
		),
		attachCondition: slot.some(attachable.attachCondition, singleUse.attachCondition),
		log: (values) => {
			if (values.pos.slotType === 'single_use')
				return `${values.defaultLog} on $p${values.pick.name}$`
			return `$p{You|${values.player}}$ attached $e${this.props.name}$ to $p${values.pos.hermitCard}$`
		},
	}

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer, row} = pos
		if (pos.type === 'single_use') {
			game.addPickRequest({
				creator: this,
				playerId: player.id,
				message: 'Pick one of your Hermits',
				canPick: slot.every(slot.player, slot.hermitSlot, slot.not(slot.empty)),
				onResult(pickedSlot) {
					if (pickedSlot.rowIndex === null) return

					const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
						return ail.target === pickedSlot.card && ail.statusEffectId == 'fire'
					})
					statusEffectsToRemove.forEach((ail) => {
						removeStatusEffect(game, pos, ail.statusEffectInstance)
					})

					if (player.board.rows[pickedSlot.rowIndex].effectCard?.props.id === 'string') {
						discardCard(game, player.board.rows[pickedSlot.rowIndex].effectCard)
					}
					for (let i = 0; i < player.board.rows[pickedSlot.rowIndex].itemCards.length; i++) {
						if (player.board.rows[pickedSlot.rowIndex].itemCards[i]?.props.id === 'string') {
							discardCard(game, player.board.rows[pickedSlot.rowIndex].itemCards[i])
						}
					}

					applySingleUse(game, pickedSlot)
				},
			})
		} else if (pos.type === 'effect') {
			// Straight away remove fire
			const fireStatusEffect = game.state.statusEffects.find((ail) => {
				return ail.target === row?.hermitCard && ail.statusEffectId == 'fire'
			})
			if (fireStatusEffect) {
				removeStatusEffect(game, pos, fireStatusEffect.statusEffectInstance)
			}

			player.hooks.onDefence.add(this, (attack) => {
				if (!row) return
				const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
					return ail.target === row.hermitCard && ail.statusEffectId == 'fire'
				})
				statusEffectsToRemove.forEach((ail) => {
					removeStatusEffect(game, pos, ail.statusEffectInstance)
				})
			})

			opponentPlayer.hooks.afterApply.add(this, () => {
				if (!row) return
				const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
					return ail.target === row.hermitCard && ail.statusEffectId == 'fire'
				})
				statusEffectsToRemove.forEach((ail) => {
					removeStatusEffect(game, pos, ail.statusEffectInstance)
				})
			})
		}
	}

	override onDetach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		opponentPlayer.hooks.afterApply.remove(this)
		player.hooks.onDefence.remove(this)
	}

	override showSingleUseTooltip(): boolean {
		return true
	}
}

export default WaterBucket
