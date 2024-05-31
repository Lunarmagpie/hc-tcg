import {IsCard} from '../cards/base/card'
import {CardPosModel} from '../models/card-pos-model'
import {GameModel} from '../models/game-model'

export interface StatusEffect {
	__status_effect: undefined

	id: string
	name: string
	description: string
	duration: number
	counter: boolean
	damageEffect: boolean
	/* The target of this status effect */
	target: IsCard

	/**
	 * Called when this statusEffect is applied
	 */
	onApply(game: GameModel, pos: CardPosModel): void
	/**
	 * Called when the statusEffect is removed, from either timeout or other means
	 */
	onRemoval(game: GameModel, pos: CardPosModel): void
}

export const statusEffectDefaults = {__status_effect: undefined}
export function implementsIsCard(obj: any): obj is StatusEffect {
	return '__status_effect' in obj
}

export default StatusEffect
