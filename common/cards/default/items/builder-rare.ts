import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import Card, {Item, item} from '../../base/card'

class BuilderRareItem extends Card<Item> {
	props: Item = {
		...item,
		id: 'item_builder_common',
		expansion: 'default',
		numericId: 51,
		name: 'Builder',
		rarity: 'rare',
		hermitType: 'builder',
	}

	override getEnergy(game: GameModel, pos: CardPosModel) {
		return [this.props.hermitType, this.props.hermitType]
	}
}

export default BuilderRareItem
