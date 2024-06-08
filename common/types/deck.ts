import {Card} from '../cards/base/card'

type DeckCardT = {
	id: string
	instance: string
}

export type PlayerDeckT = {
	name: string
	icon:
		| 'any'
		| 'balanced'
		| 'builder'
		| 'explorer'
		| 'farm'
		| 'miner'
		| 'prankster'
		| 'pvp'
		| 'redstone'
		| 'speedrunner'
		| 'terraform'
	cards: Array<Card>
}

// Weird type needed for importing and exporting. Hopefully can be removed when we redo the system.
export type SavedDeckT = {
	name: string
	icon: PlayerDeckT['icon']
	cards: Array<{id: string}>
}
