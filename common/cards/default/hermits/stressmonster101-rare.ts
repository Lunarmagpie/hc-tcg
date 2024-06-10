import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {HasAttach} from '../../base/card'

<<<<<<< HEAD
const StressMonster101RareHermitCard = (): HermitCard & HasAttach => {
	return {
		...hermitCardDefaults,
		id: 'stressmonster101_rare',
		numericId: 93,
		name: 'Stress',
		rarity: 'rare',
		hermitType: 'prankster',
		health: 300,
		primary: {
			name: 'Plonker',
			cost: ['prankster'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Yolo',
			cost: ['prankster', 'prankster', 'prankster'],
			damage: 0,
			power:
				"You and your opponent's active Hermit take damage equal to your active Hermit's health.\nAny damage this Hermit takes due to this ability can not be redirected.",
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
=======
class StressMonster101RareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'stressmonster101_rare',
			numericId: 93,
			name: 'Stress',
			rarity: 'rare',
			hermitType: 'prankster',
			health: 300,
			primary: {
				name: 'Plonker',
				cost: ['prankster'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Yolo',
				cost: ['prankster', 'prankster', 'prankster'],
				damage: 0,
				power:
					"You and your opponent's active Hermit take damage equal to your active Hermit's health.\nAny damage this Hermit takes due to this ability can not be redirected.",
			},
		})
	}
>>>>>>> upstream/dev

			player.hooks.onAttack.add(this, (attack) => {
				if (attack.getCreator() !== this || attack.type !== 'secondary') return
				const attacker = attack.getAttacker()
				if (!attacker) return

				const backlashAttack = new AttackModel({
					creator: this,
					attacker,
					target: attacker,
					type: 'secondary',
					isBacklash: true,
					log: (values) => ` and took ${values.damage} backlash damage`,
				})
				const attackDamage = attacker.row.health
				attack.addDamage(this.id, attackDamage)
				backlashAttack.addDamage(this.id, attackDamage)

<<<<<<< HEAD
				attack.addNewAttack(backlashAttack)
=======
			const backlashAttack = new AttackModel({
				id: this.getInstanceKey(instance, 'selfAttack'),
				attacker,
				target: attacker,
				type: 'secondary',
				isBacklash: true,
				log: (values) => ` and took ${values.damage} backlash damage`,
>>>>>>> upstream/dev
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(this)
		},
	}
}

export default StressMonster101RareHermitCard
