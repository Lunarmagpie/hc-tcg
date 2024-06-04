import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {TurnActions} from '../../../types/game-state'
import {AttachableCard, attachableCardDefaults} from '../../base/attachable-card'
import {CARDS} from '../..'
import {applySingleUse, removeStatusEffect} from '../../../utils/board'
import {Card, HasAttach} from '../../base/card'
import attachableTo from '../../base/attachable'

class MilkBucketEffectCard extends Card<AttachableCard> implements HasAttach {
	override props: AttachableCard = {
		...attachableCardDefaults,
		id: 'milk_bucket',
		numericId: 79,
		name: 'Milk Bucket',
		rarity: 'common',
		description:
			'Remove poison and bad omen from one of your Hermits.\nIf attached, prevents the Hermit this card is attached to from being poisoned.',
		canBeAttachedTo: attachableTo.every(
			attachableTo.player,
			attachableTo.some(attachableTo.effect, attachableTo.singleUse)
		),
		log: (values) => {
			if (values.pos.slotType === 'single_use')
				return `${values.defaultLog} on $p${values.pick.name}$`
			return `$p{You|${values.player}}$ attached $e${this.props.name}$ to $p${values.pos.hermitCard}$`
		},
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer, slot, row} = pos
		if (slot.type === 'single_use') {
			game.addPickRequest({
				playerId: player.id,
				id: this,
				message: 'Pick one of your Hermits',
				onResult(pickResult) {
					if (pickResult.playerId !== player.id) return 'FAILURE_INVALID_PLAYER'
					if (pickResult.rowIndex === undefined) return 'FAILURE_INVALID_SLOT'

					if (pickResult.slot.type !== 'hermit') return 'FAILURE_INVALID_SLOT'
					if (!pickResult.card) return 'FAILURE_INVALID_SLOT'

					const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
						return (
							ail.target === pickResult.card?.cardInstance &&
							(ail.name == 'poison' || ail.name == 'badomen')
						)
					})
					statusEffectsToRemove.forEach((ail) => {
						removeStatusEffect(game, pos, ail)
					})

					applySingleUse(game, pickResult)

					return 'SUCCESS'
				},
			})
		} else if (slot.type === 'effect') {
			// Straight away remove poison
			const poisonStatusEffect = game.state.statusEffects.find((ail) => {
				return ail.target === row?.hermitCard && ail.name == 'poison'
			})
			if (poisonStatusEffect) {
				removeStatusEffect(game, pos, poisonStatusEffect)
			}

			player.hooks.onDefence.add(this, (attack) => {
				if (!row) return
				const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
					return ail.target === row.hermitCard && (ail.name == 'poison' || ail.name == 'badomen')
				})
				statusEffectsToRemove.forEach((ail) => {
					removeStatusEffect(game, pos, ail)
				})
			})

			opponentPlayer.hooks.afterApply.add(this, () => {
				if (!row) return
				const statusEffectsToRemove = game.state.statusEffects.filter((ail) => {
					return ail.target === row.hermitCard && (ail.name == 'poison' || ail.name == 'badomen')
				})
				statusEffectsToRemove.forEach((ail) => {
					removeStatusEffect(game, pos, ail)
				})
			})
		}
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		player.hooks.onDefence.remove(this)
		opponentPlayer.hooks.afterApply.remove(this)
	}
}

export default MilkBucketEffectCard
