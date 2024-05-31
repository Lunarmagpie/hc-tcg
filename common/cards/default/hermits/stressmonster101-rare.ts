import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {defaultCardInfo} from '../../base/card'
import {CustomAttachHermitCard} from '../../base/hermit-card'

const StressMonster101RareHermitCard = (): CustomAttachHermitCard => {
	return {
		...defaultCardInfo,
		category: 'hermit',
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
		onAttach(instance: CustomAttachHermitCard, game: GameModel, pos: CardPosModel) {
			const {player} = pos

			player.hooks.onAttack.add(instance, (attack) => {
				if (attack.getCreator() !== instance || attack.type !== 'secondary') return
				const attacker = attack.getAttacker()
				if (!attacker) return

				const backlashAttack = new AttackModel({
					creator: instance,
					attacker,
					target: attacker,
					type: 'secondary',
					isBacklash: true,
					log: (values) => ` and took ${values.damage} backlash damage`,
				})
				const attackDamage = attacker.row.health
				attack.addDamage(instance.id, attackDamage)
				backlashAttack.addDamage(instance.id, attackDamage)

				attack.addNewAttack(backlashAttack)
			})
		},
		onDetach(instance: CustomAttachHermitCard, game: GameModel, pos: CardPosModel) {
			const {player} = pos
			// Remove hooks
			player.hooks.onAttack.remove(instance)
		},
	}
}

export default StressMonster101RareHermitCard
