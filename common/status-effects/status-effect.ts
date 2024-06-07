import {Card} from '../cards/base/card'
import {CardPosModel} from '../models/card-pos-model'
import {GameModel} from '../models/game-model'

export class StatusEffect<T extends StatusEffectProps = StatusEffectProps> {
	public readonly props: T
	
	constructor(defs: T) {
		 this.props = defs
	}

	implementsDuration(this: any): this is StatusEffect<T & HasDuration> {
		return 'duration' in this
	}

	implementsCounter(this: any): this is StatusEffect<T & HasCounter> {
		return 'counter' in this
	}
	
	/**
	 * Called when this statusEffect is applied
	 */
	onApply(game: GameModel, pos: CardPosModel): void {}
	/**
	 * Called when the statusEffect is removed, from either timeout or other means
	 */
	onRemoval(game: GameModel, pos: CardPosModel): void {}
	
}

export interface StatusEffectProps {
	id: string
	name: string
	description: string
	damageEffect: boolean
	/* The target of this status effect */
	target: Card
}

export interface HasDuration {
	duration: number
}

export interface HasCounter {
	counter: number
}
