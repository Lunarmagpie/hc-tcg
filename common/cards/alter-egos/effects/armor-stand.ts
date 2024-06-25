import EffectCard from '../../base/effect-card'
import {GameModel} from '../../../models/game-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {hermitCardBattleLog} from '../../base/hermit-card'
import {slot} from '../../../slot'
import Card, {Effect, HermitSlot} from '../../base/card'
import {formatText} from '../../../utils/formatting'

class ArmorStandEffectCard extends Card<HermitSlot & Effect> {
	props: HermitSlot & Effect = {
		id: 'armor_stand',
		expansion: 'alter_egos',
		type: 'effect',
		numericId: 118,
		name: 'Armour Stand',
		rarity: 'ultra_rare',
		health: 50,
		description: formatText(
			'Use like a Hermit card with a maximum 50hp.\nYou can not attach any cards to this card. While this card is active, you can not attack, or use damaging effect cards.\nIf this card is knocked out, it does not count as a knockout.'
		),
		sidebarDescriptions: [
			{
				type: 'glossary',
				name: 'knockout',
			},
		],
		log: hermitCardBattleLog('Armour Stand'),
	}

	override _attachCondition = slot.every(
		slot.hermitSlot,
		slot.player,
		slot.empty,
		slot.actionAvailable('PLAY_EFFECT_CARD'),
		slot.not(slot.frozen)
	)

	override onAttach(game: GameModel, pos: CardPosModel) {
		const {player, row} = pos
		if (!row) return

		if (player.board.activeRow === null) {
			game.changeActiveRow(player, pos.rowIndex)
		}

		// The menu won't show up but just in case someone tries to cheat
		player.hooks.blockedActions.add(this, (blockedActions) => {
			if (player.board.activeRow === pos.rowIndex) {
				blockedActions.push('PRIMARY_ATTACK')
				blockedActions.push('SECONDARY_ATTACK')
				blockedActions.push('SINGLE_USE_ATTACK')
			}

			return blockedActions
		})

		player.hooks.freezeSlots.add(this, () => {
			return slot.every(slot.player, slot.rowIndex(pos.rowIndex))
		})
	}

	override onDetach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		game.battleLog.addEntry(player.id, `$pArmor Stand$ was knocked out`)

		player.hooks.blockedActions.remove(this)
		player.hooks.afterAttack.remove(this)
		opponentPlayer.hooks.afterAttack.remove(this)
		player.hooks.freezeSlots.remove(this)
	}
}

export default ArmorStandEffectCard
