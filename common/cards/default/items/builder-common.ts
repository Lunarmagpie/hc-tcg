import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import Card, {Item} from '../../base/card'

class BuilderCommonItem extends Card<Item> {
	props: Item = {
		id: 'item_builder_common',
		type: 'item',
		expansion: 'default',
		numericId: 51,
		name: 'Builder',
		rarity: 'common',
		hermitType: 'builder',
	}

	override getEnergy(game: GameModel, pos: CardPosModel) {
		return [this.props.hermitType]
	}
}

export default BuilderCommonItem
