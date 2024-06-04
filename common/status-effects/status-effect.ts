import {Card} from '../cards/base/card'
import {CardPosModel} from '../models/card-pos-model'
import {GameModel} from '../models/game-model'

export class StatusEffect<T extends StatusEffectProps = StatusEffectProps> {
	public id: string
	public name: string
	public description: string
	public damageEffect: boolean
	public target: Card
	
	constructor(defs: StatusEffectProps) {
		this.id = defs.id
		this.name = defs.name
		this.description = defs.description
		this.damageEffect = defs.damageEffect
		this.target = defs.target
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
