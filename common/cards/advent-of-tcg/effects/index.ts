import BrewingStandEffectCard from './brewing-stand'
import FurnaceEffectCard from './furnace'
import SlimeballEffectCard from './slimeball'
import CatEffectCard from './cat'
import BerryBushEffectCard from './berry-bush'
import TrapdoorEffectCard from './trapdoor'
import { AttachableCard } from '../../base/attachable-card'

const effectCardClasses: Array<AttachableCard> = [
	// Advent of TCG cards
	BrewingStandEffectCard,
	FurnaceEffectCard,
	SlimeballEffectCard,
	CatEffectCard,
	BerryBushEffectCard,
	TrapdoorEffectCard,
]

export default effectCardClasses
