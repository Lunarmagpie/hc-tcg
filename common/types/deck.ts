import {Card} from '../cards/base/card'

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

type TransferCardT = {
	cardId: string
	instance: string
}
export type TransferDeckT = {
	name: string
	icon: PlayerDeckT['icon']
	cards: Array<TransferCardT>
}
