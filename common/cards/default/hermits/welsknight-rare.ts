import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach, overridesAttachDefaults} from '../../base/card'

const WelsknightRareHermitCard = (): HermitCard & HasAttach => {
	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'welsknight_rare',
		numericId: 107,
		name: 'Wels',
		rarity: 'rare',
		hermitType: 'pvp',
		health: 280,
		primary: {
			name: "Knight's Blade",
			cost: ['any'],
			damage: 40,
			power: null,
		},
		secondary: {
			name: 'Vengeance',
			cost: ['pvp', 'pvp', 'pvp'],
			damage: 100,
			power:
				"If this Hermit's HP is orange (190-100), do an additional 20hp damage.\nIf this Hermit's HP is red (90 or lower), do an additional 40hp damage.",
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || attack.type !== 'secondary') return
				const attacker = attack.getAttacker()
				if (!attacker) return

				if (attacker.row.health < 200) attack.addDamage(this.id, 20)
				if (attacker.row.health < 100) attack.addDamage(this.id, 20)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default WelsknightRareHermitCard
