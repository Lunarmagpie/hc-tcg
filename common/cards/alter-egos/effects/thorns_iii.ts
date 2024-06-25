import {AttackModel} from '../../../models/attack-model'
import {CardPosModel} from '../../../models/card-pos-model'
import {GameModel} from '../../../models/game-model'
import {slot} from '../../../slot'
import {executeExtraAttacks, isTargetingPos} from '../../../utils/attacks'
import EffectCard from '../../base/effect-card'
import {ThornsBase} from '../../default/effects/thorns'

class ThornsIII extends ThornsBase {
	damange = 40
	constructor() {
		super()
		this.props.expansion = 'alter_egos'
	}
}

export default ThornsIII
