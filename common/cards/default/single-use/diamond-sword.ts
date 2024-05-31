import {CARDS} from '../..'
import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {applySingleUse, getActiveRowPos} from '../../../utils/board'
import {DamageSingleUseCard, defaultDamagingSingleUseInfo} from '../../base/single-use-card'

const DiamondSwordSingleUseCard = (): DamageSingleUseCard => {
	return {
		...defaultDamagingSingleUseInfo,
		id: 'diamond_sword',
		numericId: 14,
		name: 'Diamond Sword',
		rarity: 'rare',
		description: "Do 40hp damage to your opponent's active Hermit.",
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			player.hooks.getAttack.add(this, () => {
				const activePos = getActiveRowPos(player)
				if (!activePos) return null

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
	}
}

export default DiamondSwordSingleUseCard
