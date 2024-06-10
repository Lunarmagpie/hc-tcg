import {CARDS} from '../..'
import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {applySingleUse, getActiveRowPos} from '../../../utils/board'
import {SingleUseAttack, singleUseAttackDefaults} from '../../base/card'
import {SingleUseCard, defaultDamagingSingleUseInfo} from '../../base/single-use-card'

<<<<<<< HEAD
const DiamondSwordSingleUseCard = (): SingleUseCard & SingleUseAttack => {
	return {
		...defaultDamagingSingleUseInfo,
		...singleUseAttackDefaults,
		id: 'diamond_sword',
		numericId: 14,
		name: 'Diamond Sword',
		rarity: 'rare',
		description: "Do 40hp damage to your opponent's active Hermit.",
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos
=======
class DiamondSwordSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'diamond_sword',
			numericId: 14,
			name: 'Diamond Sword',
			rarity: 'rare',
			description: "Do 40hp damage to your opponent's active Hermit.",
			log: null,
		})
	}
>>>>>>> upstream/dev

			player.hooks.getAttack.add(this, () => {
				const activePos = getActiveRowPos(player)
				if (!activePos) return null

<<<<<<< HEAD
				const opponentIndex = opponentPlayer.board.activeRow
				if (opponentIndex === null || opponentIndex === undefined) return null
				const opponentRow = opponentPlayer.board.rows[opponentIndex]
				if (!opponentRow || !opponentRow.hermitCard) return null

				const swordAttack = new AttackModel({
					creator: this,
					attacker: activePos,
					target: {
						player: opponentPlayer,
						rowIndex: opponentIndex,
						row: opponentRow,
					},
					type: 'effect',
					log: (values) =>
						`${values.defaultLog} to attack ${values.target} for ${values.damage} damage`,
				}).addDamage(this.id, 40)

				return swordAttack
			})

			player.hooks.onAttack.add(this, (attack) => {
				if (attack.getCreator() !== this) return

				// We've executed our attack, apply effect
				applySingleUse(game)
			})
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos
			player.hooks.getAttack.remove(this)
			player.hooks.onAttack.remove(this)
		},
=======
		player.hooks.getAttack.add(instance, () => {
			const activePos = getActiveRowPos(player)
			if (!activePos) return null

			const opponentIndex = opponentPlayer.board.activeRow
			if (opponentIndex === null || opponentIndex === undefined) return null
			const opponentRow = opponentPlayer.board.rows[opponentIndex]
			if (!opponentRow || !opponentRow.hermitCard) return null

			const swordAttack = new AttackModel({
				id: this.getInstanceKey(instance, 'attack'),
				attacker: activePos,
				target: {
					player: opponentPlayer,
					rowIndex: opponentIndex,
					row: opponentRow,
				},
				type: 'effect',
				log: (values) =>
					`${values.defaultLog} to attack ${values.target} for ${values.damage} damage`,
			}).addDamage(this.id, 40)

			return swordAttack
		})

		player.hooks.onAttack.add(instance, (attack) => {
			const attackId = this.getInstanceKey(instance, 'attack')
			if (attack.id !== attackId) return

			// We've executed our attack, apply effect
			applySingleUse(game)
		})
	}

	override onDetach(game: GameModel, instance: string, pos: CardPosModel) {
		const {player} = pos
		player.hooks.getAttack.remove(instance)
		player.hooks.onAttack.remove(instance)
	}

	override canAttack() {
		return true
>>>>>>> upstream/dev
	}
}

export default DiamondSwordSingleUseCard
