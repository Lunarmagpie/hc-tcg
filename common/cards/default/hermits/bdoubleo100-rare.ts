import {HERMIT_CARDS} from '../..'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {HermitCard, defaultHermitInfo} from '../../base/hermit-card'
import {applyStatusEffect, getActiveRow, removeStatusEffect} from '../../../utils/board'
import {OverridesAttach, OverridesDetach} from '../../base/card'

const BdoubleO100RareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...defaultHermitInfo,
		id: 'bdoubleo100_rare',
		numericId: 1,
		name: 'Bdubs',
		rarity: 'rare',
		hermitType: 'balanced',
		health: 260,
		primary: {
			name: 'Retexture',
			cost: ['any'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Shreep',
			cost: ['balanced', 'balanced', 'any'],
			damage: 0,
			power:
				'This Hermit restores all HP, then sleeps for the rest of this turn, and the following two turns, before waking up.',
		},

		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || !attack.isType('secondary')) return

				const row = getActiveRow(player)

				if (!row) return

				// Add new sleeping statusEffect
				applyStatusEffect(game, 'sleeping', this)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
		sidebarDescriptions: [
			{
				type: 'statusEffect',
				name: 'sleeping',
			},
		],
	}
}

export default BdoubleO100RareHermitCard
