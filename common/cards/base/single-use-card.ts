<<<<<<< HEAD
import {PlayCardLog, CardRarityT, CardCategoryT} from '../../types/cards'
import {
	AllowAttacks,
	EffectDisplayInfo,
	HasDescription,
	HasAttach,
	isCardDefaults,
	effectDisplayInfoDefaults,
	hasDescriptionDefaults,
	CardProps,
} from './card'
=======
import {PlayCardLog, CardRarityT} from '../../types/cards'
import Card, {CanAttachResult} from './card'
>>>>>>> upstream/dev
import {GameModel} from '../../models/game-model'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'
<<<<<<< HEAD
import attachableTo from './attachable'

export type SingleUseCard = CardProps & EffectDisplayInfo & HasDescription & HasAttach

export const defaultSingleUseInfo = {
	...isCardDefaults,
	...effectDisplayInfoDefaults,
	...hasDescriptionDefaults,
	canBeAttachedTo: attachableTo.every(attachableTo.player, attachableTo.singleUse),
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: CardProps & HasDescription) {
		return formatText(this.description)
	},
}

export const defaultDamagingSingleUseInfo = {
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: CardProps & HasDescription) {
		return formatText(this.description)
	},
	log: [],
	allowAttacks: false,
=======

export type SingleUseDefs = {
	id: string
	numericId: number
	name: string
	rarity: CardRarityT
	description: string
	log?: ((values: PlayCardLog) => string) | null
}

class SingleUseCard extends Card {
	public description: string

	constructor(defs: SingleUseDefs) {
		super({
			type: 'single_use',
			id: defs.id,
			numericId: defs.numericId,
			name: defs.name,
			rarity: defs.rarity,
		})

		this.description = defs.description
		if (defs.log !== null)
			this.updateLog((values) => {
				if (defs.log === undefined) return values.defaultLog
				if (defs.log === null) return ''
				return defs.log(values)
			})
	}

	public override canAttach(game: GameModel, pos: CardPosModel): CanAttachResult {
		if (pos.slot.type !== 'single_use') return ['INVALID_SLOT']

		return []
	}

	public override getActions(game: GameModel): TurnActions {
		const {currentPlayer} = game

		const hasHermit = currentPlayer.board.rows.some((row) => !!row.hermitCard)
		const spaceForSingleUse = !currentPlayer.board.singleUseCard

		return hasHermit && spaceForSingleUse ? ['PLAY_SINGLE_USE_CARD'] : []
	}

	public override showSingleUseTooltip(): boolean {
		return true
	}

	/**
	 * Returns whether this card has apply functionality or not
	 */
	public canApply(): boolean {
		// default is no
		return false
	}

	/**
	 * Returns whether you can attack with this card alone or not
	 */
	public canAttack(): boolean {
		// default is no
		return false
	}

	public override getFormattedDescription(): FormattedTextNode {
		return formatText(`*${this.description}*`)
	}
>>>>>>> upstream/dev
}
