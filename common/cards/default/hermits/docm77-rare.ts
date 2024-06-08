import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {flipCoin} from '../../../utils/coinFlips'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach, Card} from '../../base/card'

class Docm77RareHermitCard extends Card<HermitCard> implements HasAttach {
	constructor() {
		super({
			...hermitCardDefaults,
			id: 'docm77_rare',
			numericId: 16,
			name: 'Docm77',
			rarity: 'rare',
			hermitType: 'farm',
			health: 280,
			primary: {
				name: 'Shadow Tech',
				cost: ['any'],
				damage: 40,
				power: null,
			},
			secondary: {
				name: 'World Eater',
				cost: ['farm', 'farm'],
				damage: 80,
				power: 'Flip a Coin.\nIf heads, attack damage doubles.\nIf tails, attack damage is halved.',
			},
		})
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		player.hooks.onAttack.add(this, (attack) => {
			const attacker = attack.getAttacker()
			if (attack.getCreator() !== this || attack.type !== 'secondary' || !attacker) return

			const coinFlip = flipCoin(player, attacker.row.hermitCard)

			if (coinFlip[0] === 'heads') {
				attack.addDamage(this.props.id, this.props.secondary.damage)
			} else {
				attack.reduceDamage(this.props.id, this.props.secondary.damage / 2)
			}
		})
	}

	onDetach(game: GameModel, pos: CardPosModel) {
		pos.player.hooks.onAttack.remove(this)
	}
}

export default Docm77RareHermitCard
