import Card, {CardProps, Effect, Hermit} from './base/card'
import EffectCard from './base/effect-card'
import HermitCard from './base/hermit-card'
import ItemCard from './base/item-card'
import SingleUseCard from './base/single-use-card'
// import defaultEffectCards from './default/effects'
// import alterEgosEffectCards from './alter-egos/effects'
// import adventOfTcgEffectCards from './advent-of-tcg/effects'
import defaultHermitCards from './default/hermits'
// import alterEgosHermitCards from './alter-egos/hermits'
// import adventOfTcgHermitCards from './advent-of-tcg/hermits'
// import defaultItemCards from './default/items'
// import defaultSingleUseCards from './default/single-use'
// import alterEgosSingleUseCards from './alter-egos/single-use'
// import adventOfTcgSingleUseCards from './advent-of-tcg/single-use'
// import alterEgosIIHermitCards from './alter-egos-ii/hermits/index'

// const effectCardClasses: Array<typeof Card<Effect>> = [
// 	...defaultEffectCards,
// 	...alterEgosEffectCards,
// 	...adventOfTcgEffectCards,
// ]

const hermitCardClasses: Array<typeof Card<Hermit>> = [
	...defaultHermitCards,
	// ...alterEgosHermitCards,
	// ...adventOfTcgHermitCards,
	// ...alterEgosIIHermitCards,
]

// const itemCardClasses: Array<typeof Card<CardProps>> = [...defaultItemCards]

// const singleUseCardClasses: Array<typeof Card> = [
// 	...defaultSingleUseCards,
// 	...alterEgosSingleUseCards,
// 	...adventOfTcgSingleUseCards,
// ]

export const CARDS: Array<typeof Card<CardProps>> = [
	// ...effectCardClasses,
	...hermitCardClasses,
	// ...itemCardClasses,
	// ...singleUseCardClasses,
]

export const HERMIT_CARDS = {}
export const SINGLE_USE_CARDS = {}
export const ITEM_CARDS = {}
export const EFFECT_CARDS = {}
