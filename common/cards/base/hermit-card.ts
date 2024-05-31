import { AttackModel } from '../../models/attack-model'
import { GameModel } from '../../models/game-model'
import { IsCard, CanAttachResult, IsAttachableToHermitSlots, OverridesDetach, HasHermitType, HasHealth, HasPrimaryAttack, HasSecondaryAttack, OverridesAttach } from './card'
import { CardRarityT, HermitAttackInfo, HermitTypeT, PlayCardLog } from '../../types/cards'
import { HermitAttackType } from '../../types/attack'
import { CardPosModel } from '../../models/card-pos-model'
import { TurnActions } from '../../types/game-state'
import { FormattedTextNode, formatText } from '../../utils/formatting'


export type HermitCard =
	& IsCard
	& IsAttachableToHermitSlots
	& HasHermitType
	& HasHealth
	& HasPrimaryAttack
	& HasSecondaryAttack

	// Default is to return
	// 	public getAttacks(
	// 		game: GameModel,
	// 		instance: string,
	// 		pos: CardPosModel,
	// 		hermitAttackType: HermitAttackType
	// 	): AttackModel | null {
	// 		if (pos.rowIndex === null || !pos.row || !pos.row.hermitCard) return null

	// 		const {opponentPlayer: opponentPlayer} = game
	// 		const targetIndex = opponentPlayer.board.activeRow
	// 		if (targetIndex === null) return null

	// 		const targetRow = opponentPlayer.board.rows[targetIndex]
	// 		if (!targetRow.hermitCard) return null

	// 		// Create an attack with default damage
	// 		const attack = new AttackModel({
	// 			id: this.getInstanceKey(instance),
	// 			attacker: {
	// 				player: pos.player,
	// 				rowIndex: pos.rowIndex,
	// 				row: pos.row,
	// 			},
	// 			target: {
	// 				player: opponentPlayer,
	// 				rowIndex: targetIndex,
	// 				row: targetRow,
	// 			},
	// 			type: hermitAttackType,
	// 			createWeakness: 'ifWeak',
	// 			log: (values) =>
	// 				`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${
	// 					values.target
	// 				} with ${values.attackName} for ${values.damage} damage`,
	// 		})

	// 		if (attack.type === 'primary') {
	// 			attack.addDamage(this.id, this.primary.damage)
	// 		} else if (attack.type === 'secondary') {
	// 			attack.addDamage(this.id, this.secondary.damage)
	// 		}

	// 		return attack
	// 	}

	// 	public override getActions(game: GameModel): TurnActions {
	// 		const {currentPlayer} = game

	// 		// Is there a hermit slot free on the board
	// 		const spaceForHermit = currentPlayer.board.rows.some((row) => !row.hermitCard)

	// 		return spaceForHermit ? ['PLAY_HERMIT_CARD'] : []
	// 	}

	// 	public override getFormattedDescription(): FormattedTextNode {
	// 		return formatText(
	// 			(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
	// 				(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
	// 		)
	// 	}
	// }

}

export function getHermitCardDefaults(name: string) {
	return {
		log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${name}$`
	}
}

