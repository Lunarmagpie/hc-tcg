import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {OverridesAttach, OverridesDetach} from '../../base/card'
import {overridesAttachDefaults, overridesDetachDefaults} from '../../base/card'

const EthosLabUltraRareHermitCard = (): HermitCard & OverridesAttach & OverridesDetach => {
	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		...overridesDetachDefaults,
		id: 'ethoslab_ultra_rare',
		numericId: 21,
		name: 'Etho',
		rarity: 'ultra_rare',
		hermitType: 'pvp',
		health: 250,
		primary: {
			name: 'Ladders',
			cost: ['any'],
			damage: 30,
			power: null,
		},
		secondary: {
			name: 'Slab',
			cost: ['any', 'any'],
			damage: 70,
			power: 'Flip a coin 3 times.\nDo an additional 20hp damage for every heads.',
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onAttack.add(this, (attack) => {
				const attacker = attack.getAttacker()
				if (attack.getCreator() !== this || attack.type !== 'secondary' || !attacker) return

				const coinFlip = flipCoin(player, attacker.row.hermitCard, 3)
				const headsAmount = coinFlip.filter((flip) => flip === 'heads').length
				attack.addDamage(this.id, headsAmount * 20)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default EthosLabUltraRareHermitCard
