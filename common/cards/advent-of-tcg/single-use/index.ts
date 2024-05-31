import DropperSingleUseCard from './dropper'
import SplashPotionOfHarmingSingleUseCard from './splash-potion-of-harming'
import BrushSingleUseCard from './brush'
import GlowstoneSingleUseCard from './glowstone'
import LanternSingleUseCard from './lantern'
import FletchingTableSingleUseCard from './fletching-table'
import { SingleUseCard } from '../../base/single-use-card'

const singleUseCardClasses: Array<SingleUseCard> = [
	// Advent calendar cards
	DropperSingleUseCard,
	FletchingTableSingleUseCard,
	BrushSingleUseCard,
	GlowstoneSingleUseCard,
	LanternSingleUseCard,
	SplashPotionOfHarmingSingleUseCard,
]

export default singleUseCardClasses
