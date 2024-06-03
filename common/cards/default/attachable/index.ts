import ShieldEffectCard from './shield'
import IronArmorEffectCard from './iron-armor'
import GoldArmorEffectCard from './gold-armor'
import DiamondArmorEffectCard from './diamond-armor'
import NetheriteArmorEffectCard from './netherite-armor'
import WolfEffectCard from './wolf'
import TotemEffectCard from './totem'
import BedEffectCard from './bed'
import ThornsEffectCard from './thorns'
import LoyaltyEffectCard from './loyalty'
import WaterBucketEffectCard from './water-bucket'
import MilkBucketEffectCard from './milk-bucket'
import { AttachableCard } from '../../base/attachable-card'
import { Card } from '../../base/card'

const effectCardClasses: Array<typeof Card<any> = [
	BedEffectCard,
	WolfEffectCard,
	GoldArmorEffectCard,
	IronArmorEffectCard,
	ShieldEffectCard,
	DiamondArmorEffectCard,
	NetheriteArmorEffectCard,
	TotemEffectCard,
	ThornsEffectCard,
	LoyaltyEffectCard,
	WaterBucketEffectCard,
	MilkBucketEffectCard,
]

export default effectCardClasses
