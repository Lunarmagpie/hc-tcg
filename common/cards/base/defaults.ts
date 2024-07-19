import type {CardCategoryT, PlayCardLog} from '../../types/cards'
import * as query from '../../components/query'

export const item = {
	item: null,
	category: 'item' as CardCategoryT,
	attachCondition: query.every(
		query.slot.currentPlayer,
		query.slot.item,
		query.slot.row(query.row.hasHermit)
	),
	log: (values: PlayCardLog) =>
		`$p{You|${values.player}}$ placed $p${values.pos.name}$ on row #${values.pos.rowIndex}`,
}

export const hermit = {
	hermit: null,
	category: 'hermit' as CardCategoryT,
	attachCondition: query.every(query.slot.hermit, query.slot.currentPlayer, query.slot.empty),
	log: (values: PlayCardLog) =>
		`$p{You|${values.player}}$ placed $p${values.pos.name}$ on row #${values.pos.rowIndex}`,
}

export const attach = {
	attachable: null,
	category: 'attach' as CardCategoryT,
	attachCondition: query.every(
		query.slot.currentPlayer,
		query.slot.attach,
		query.slot.row(query.row.hasHermit)
	),
	log: (values: PlayCardLog) =>
		`$p{You|${values.player}}$ placed $p${values.pos.name}$ on row #${values.pos.rowIndex}`,
}

export const singleUse = {
	singleUse: null,
	showConfirmationModal: false,
	hasAttack: false,
	category: 'single_use' as CardCategoryT,
	attachCondition: query.every(query.slot.singleUse, query.slot.playerHasActiveHermit),
}
