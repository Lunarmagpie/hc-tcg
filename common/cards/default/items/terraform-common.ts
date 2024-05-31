import {ItemCard, itemCardDefaults} from '../../base/item-card'

const TerraformRareItemCard = (): ItemCard => {
	return {
		...itemCardDefaults,
		id: 'item_terraform_rare',
		numericId: 50,
		name: 'Terraform',
		rarity: 'rare',
		hermitType: 'terraform',
	}
}

export default TerraformRareItemCard
