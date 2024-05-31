import { AttackModel } from '../../models/attack-model'
import { GameModel } from '../../models/game-model'
import { IsCard, IsAttachableToHermitSlots, OverridesDetach, HasHermitType, HasHealth, OverridesAttach, HermitDisplayInfo, CanAttack } from './card'
import { CardCategoryT, CardRarityT, HermitAttackInfo, HermitTypeT, PlayCardLog } from '../../types/cards'
import { HermitAttackType } from '../../types/attack'
import { CardPosModel } from '../../models/card-pos-model'
import { TurnActions } from '../../types/game-state'
import { FormattedTextNode, formatText } from '../../utils/formatting'


export type HermitCard =
	& IsCard
	& IsAttachableToHermitSlots
	& HasHermitType
	& HasHealth
	& CanAttack
	& HermitDisplayInfo

export const defaultHermitInfo = {
	category: 'hermit' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	getBackground(this: IsCard) {
		return this.id.split('_')[0]
	},
	getShortName(this: IsCard) {
		return null
	},
	getDescription(this: IsCard & HasPrimaryAttack & HasSecondaryAttack) {
		return formatText(
			(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
			(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
		)
	},
	sidebarDescriptions: [],
}

// Default is to return
function createAttackModel(
	game: GameModel,
	hermit: IsCard & CanAttack,
	pos: CardPosModel,
	hermitAttackType: HermitAttackType
): AttackModel | null {
	if (pos.rowIndex === null || !pos.row || !pos.row.hermitCard) return null

	const { opponentPlayer: opponentPlayer } = game
	const targetIndex = opponentPlayer.board.activeRow
	if (targetIndex === null) return null

	const targetRow = opponentPlayer.board.rows[targetIndex]
	if (!targetRow.hermitCard) return null

	// Create an attack with default damage
	const attack = new AttackModel({
		creator: hermit,
		attacker: {
			player: pos.player,
			rowIndex: pos.rowIndex,
			row: pos.row,
		},
		target: {
			player: opponentPlayer,
			rowIndex: targetIndex,
			row: targetRow,
		},
		type: hermitAttackType,
		createWeakness: 'ifWeak',
		log: (values) =>
			`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${values.target
			} with ${values.attackName} for ${values.damage} damage`,
	})

	if (hermitAttackType == 'primary') {
		attack.addDamage(hermit, hermit.primary.damage)
	} else if (hermitAttackType == 'secondary') {
		attack.addDamage(hermit, hermit.secondary.damage)
	}

	return attack
}

function getActions(game: GameModel): TurnActions {
	const {currentPlayer} = game

	// Is there a hermit slot free on the board
	const spaceForHermit = currentPlayer.board.rows.some((row) => !row.hermitCard)

	return spaceForHermit ? ['PLAY_HERMIT_CARD'] : []
}

// export function getFormattedDescription(): FormattedTextNode {
// 	return formatText(
// 		(this.primary.power ? `**${this.primary.name}**\n*${this.primary.power}*` : '') +
// 			(this.secondary.power ? `**${this.secondary.name}**\n*${this.secondary.power}*` : '')
// 	)
// }


export function getHermitCardDefaults(name: string) {
	return {
		log: (values: PlayCardLog) => `$p{You|${values.player}}$ placed $p${name}$`
	}
}

