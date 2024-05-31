import TridentSingleUseCard from './trident'
import SweepingEdgeSingleUseCard from './sweeping-edge'
import AnvilSingleUseCard from './anvil'
import PotionOfSlownessSingleUseCard from './potion-of-slowness'
import PotionOfWeaknessSingleUseCard from './potion-of-weakness'
import EggSingleUseCard from './egg'
import EnderPearlSingleUseCard from './ender-pearl'
import LadderSingleUseCard from './ladder'
import BadOmenSingleUseCard from './bad-omen'
import FireChargeSingleUseCard from './fire-charge'
import PistonSingleUseCard from './piston'
import SplashPotionOfHealingIISingleUseCard from './splash-potion-of-healing-ii'
import TargetBlockSingleUseCard from './target-block'
import { SingleUseCard } from '../../base/single-use-card'

const singleUseCardClasses: Array<SingleUseCard> = [
	// AE Cards
	AnvilSingleUseCard,
	BadOmenSingleUseCard,
	EggSingleUseCard,
	EnderPearlSingleUseCard,
	FireChargeSingleUseCard,
	LadderSingleUseCard,
	PistonSingleUseCard,
	PotionOfSlownessSingleUseCard,
	PotionOfWeaknessSingleUseCard,
	SplashPotionOfHealingIISingleUseCard,
	SweepingEdgeSingleUseCard,
	TargetBlockSingleUseCard,
	TridentSingleUseCard,
]

export default singleUseCardClasses
