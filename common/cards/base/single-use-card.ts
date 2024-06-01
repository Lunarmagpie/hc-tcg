import {PlayCardLog, CardRarityT, CardCategoryT} from '../../types/cards'
import {
	AllowAttacks,
	EffectDisplayInfo,
	HasDescription,
	IsAttachableToSingleUseSlots,
	Card,
	OverridesAttach,
	OverridesDetach,
	isCardDefaults,
	isAttachableToEffectSlotsDefaults,
	effectDisplayInfoDefaults,
	hasDescriptionDefaults,
	overridesAttachDefaults,
	overridesDetachDefaults,
} from './card'
import {GameModel} from '../../models/game-model'
import {CardPosModel} from '../../models/card-pos-model'
import {TurnActions} from '../../types/game-state'
import {FormattedTextNode, formatText} from '../../utils/formatting'

export type SingleUseCard = Card &
	IsAttachableToSingleUseSlots &
	EffectDisplayInfo &
	HasDescription &
	OverridesAttach &
	OverridesDetach

export const defaultSingleUseInfo = {
	...isCardDefaults,
	...isAttachableToEffectSlotsDefaults,
	...effectDisplayInfoDefaults,
	...hasDescriptionDefaults,
	...overridesAttachDefaults,
	...overridesDetachDefaults,
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: Card & HasDescription) {
		return formatText(this.description)
	},
}

export const defaultDamagingSingleUseInfo = {
	category: 'single_use' as CardCategoryT,
	expansion: 'default',
	palette: 'default',
	sidebarDescriptions: [],
	getDescription(this: Card & HasDescription) {
		return formatText(this.description)
	},
	log: null,
	allowAttacks: false,
}

// export type SingleUseDefs = {
// 	id: string
// 	numericId: number
// 	name: string
// 	rarity: CardRarityT
// 	description: string
// 	log?: ((values: PlayCardLog) => string) | null
// }

// class SingleUseCard extends Card {
// 	public description: string

// 	constructor(defs: SingleUseDefs) {
// 		super({
// 			type: 'single_use',
// 			id: defs.id,
// 			numericId: defs.numericId,
// 			name: defs.name,
// 			rarity: defs.rarity,
// 		})

// 		this.description = defs.description
// 		this.log = defs.log !== undefined ? defs.log : (values) => `${values.defaultLog}`
// 	}

// 	public override canAttach(game: GameModel, pos: CardPosModel): CanAttachResult {
// 		if (pos.slot.type !== 'single_use') return ['INVALID_SLOT']

// 		return []
// 	}

// 	public override getActions(game: GameModel): TurnActions {
// 		const {currentPlayer} = game

// 		const hasHermit = currentPlayer.board.rows.some((row) => !!row.hermitCard)
// 		const spaceForSingleUse = !currentPlayer.board.singleUseCard

// 		return hasHermit && spaceForSingleUse ? ['PLAY_SINGLE_USE_CARD'] : []
// 	}

// 	public override showSingleUseTooltip(): boolean {
// 		return true
// 	}

// 	/**
// 	 * Returns whether this card has apply functionality or not
// 	 */
// 	public canApply(): boolean {
// 		// default is no
// 		return false
// 	}

// 	/**
// 	 * Returns whether you can attack with this card alone or not
// 	 */
// 	public canAttack(): boolean {
// 		// default is no
// 		return false
// 	}

// 	public override getFormattedDescription(): FormattedTextNode {
// 		return formatText(`*${this.description}*`)
// 	}
// }

// export default SingleUseCard
