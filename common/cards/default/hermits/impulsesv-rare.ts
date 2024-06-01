import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {OverridesAttach, OverridesDetach} from '../../base/card'
import {overridesAttachDefaults, overridesDetachDefaults} from '../../base/card'

const ImpulseSVRareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		...overridesDetachDefaults,
		id: 'impulsesv_rare',
		numericId: 41,
		name: 'Impulse',
		rarity: 'rare',
		hermitType: 'redstone',
		health: 250,
		primary: {
			name: 'Bop',
			cost: ['redstone'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Boomer',
			cost: ['redstone', 'any'],
			damage: 70,
			power:
				'For each of your AFK Bdubs or Tangos on the game board, do an additional 40hp damage, up to a maximum of 80hp additional damage.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || attack.type !== 'secondary') return
				const boomerAmount = player.board.rows.filter(
					(row, index) =>
						row.hermitCard &&
						index !== player.board.activeRow &&
						['bdoubleo100_common', 'bdoubleo100_rare', 'tangotek_common', 'tangotek_rare'].includes(
							row.hermitCard.id
						)
				).length

				attack.addDamage(this.id, Math.min(boomerAmount, 2) * 40)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default ImpulseSVRareHermitCard
