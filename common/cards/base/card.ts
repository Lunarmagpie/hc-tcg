import {
	PlayCardLog,
	CardRarityT,
	CardTypeT,
	HermitTypeT,
	HermitAttackInfo,
	ExpansionT,
} from '../../types/cards'
import {GameModel} from '../../models/game-model'
import {CardPosModel} from '../../models/card-pos-model'
import {FormattedTextNode} from '../../utils/formatting'
import {slot, SlotCondition} from '../../slot'
import {HermitAttackType} from '../../types/attack'
import {AttackModel} from '../../models/attack-model'

export type CanAttachError =
	| 'INVALID_PLAYER'
	| 'INVALID_SLOT'
	| 'UNMET_CONDITION'
	| 'UNMET_CONDITION_SILENT'
	| 'UNKNOWN_ERROR'

export type CanAttachResult = Array<CanAttachError>

export type CardProps = {
	type: CardTypeT
	id: string
	expansion: ExpansionT
	numericId: number
	name: string
	rarity: CardRarityT
	sidebarDescriptions?: Array<{type: string; name: string}>
	/** The battle log attached to this card */
	/** Set to string when the card should generate a log when played or applied, and null otherwise */
	log?: (values: PlayCardLog) => string
}

export type Item = CardProps & {
	type: 'item'
	hermitType: HermitTypeT
}

export type HermitSlot = CardProps & {
	health: number
}

export type Hermit = HermitSlot & {
	type: 'hermit'
	hermitType: HermitTypeT
	primary: HermitAttackInfo
	secondary: HermitAttackInfo
}

export type Effect = CardProps & {
	type: 'effect'
	description: FormattedTextNode
}

export type SingleUse = CardProps & {
	type: 'single_use'
	description: FormattedTextNode
}

abstract class Card<Props extends CardProps = CardProps> {
	public abstract props: Props
	public instance: string
	private log: Array<(values: PlayCardLog) => string>

	constructor(props: Props) {
		this.instance = Math.random().toString()
		this._attachCondition = slot.nothing
		this.log = []
	}

	/**
	 * A combinator expression that returns if the card can be attached to a specified slot.
	 */
	protected _attachCondition: SlotCondition
	public get attachCondition(): SlotCondition {
		return this._attachCondition
	}

	/**
	 * Called when an instance of this card is attached to the board
	 */
	public onAttach(game: GameModel, pos: CardPosModel) {
		// default is do nothing
	}

	/**
	 * Called when an instance of this card is removed from the board
	 */
	public onDetach(game: GameModel, pos: CardPosModel) {
		// default is do nothing
	}

	public isItemCard(): this is Card<CardProps & Item> {
		return this.props.type === 'item'
	}

	public getEnergy(this: Card<Item>, game: GameModel, pos: CardPosModel): Array<HermitTypeT> {
		return []
	}

	public isHermitCard(): this is Card<CardProps & Hermit> {
		return this.props.type === 'hermit'
	}

	public getAttack(
		this: Card<Hermit>,
		game: GameModel,
		pos: CardPosModel,
		hermitAttackType: HermitAttackType
	): AttackModel | null {
		if (pos.rowIndex === null || !pos.row || !pos.row.hermitCard) return null

		const {opponentPlayer: opponentPlayer} = game
		const targetIndex = opponentPlayer.board.activeRow
		if (targetIndex === null) return null

		const targetRow = opponentPlayer.board.rows[targetIndex]
		if (!targetRow.hermitCard) return null

		// Create an attack with default damage
		const attack = new AttackModel({
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
				`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${
					values.target
				} with ${values.attackName} for ${values.damage} damage`,
		})

		if (attack.type === 'primary') {
			attack.addDamage(this.props.id, this.props.primary.damage)
		} else if (attack.type === 'secondary') {
			attack.addDamage(this.props.id, this.props.secondary.damage)
		}

		return attack
	}

	public hasAttacks(this: Card<HermitSlot>): this is Card<Props & Hermit> {
		return 'primary' in this.props && 'secondary' in this.props
	}

	public isEffectCard(): this is Card<CardProps & Effect> {
		return this.props.type === 'effect'
	}

	public isSingleUseCard(): this is Card<CardProps & SingleUse> {
		return this.props.type === 'single_use'
	}

	public canAttack(this: Card<SingleUse>): boolean {
		// default is no
		return false
	}

	/**
	 * Returns the palette to use for this card
	 */
	public getPalette(): string {
		return 'default'
	}

	public getBackground(): string {
		return this.props.id.split('_')[0]
	}

	/**
	 * Returns the shortened name to use for this card
	 */
	public getShortName(): string {
		return this.props.name
	}

	/**
	 * Returns whether to show *Attach* on the card tooltip
	 */
	public showAttachTooltip(): boolean {
		return false
	}

	/**
	 * Returns whether to show *Single Use* on the card tooltip
	 */
	public showSingleUseTooltip(): boolean {
		return false
	}

	/**
	 * Returns the sidebar descriptions for this card
	 */
	public sidebarDescriptions(): Array<Record<string, string>> {
		return []
	}

	/** Updates the log entry*/
	public updateLog(logEntry: (values: PlayCardLog) => string) {
		if (logEntry === null) return
		this.log.push(logEntry)
	}

	private consolidateLogs(values: PlayCardLog, logIndex: number) {
		if (logIndex > 0) {
			values.previousLog = this.consolidateLogs(values, logIndex - 1)
		}
		return this.log[logIndex](values)
	}

	/** Gets the log entry for this attack*/
	public getLog(values: PlayCardLog) {
		if (this.log.length === 0) {
			return ''
		}
		return this.consolidateLogs(values, this.log.length - 1)
	}
}

export default Card
