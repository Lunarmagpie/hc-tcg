import {HermitCard, createHermitAttackModel, getHermitsAttack, hermitCardDefaults} from '../../base/hermit-card'
import {Card, CardProps, GetAttack, HasAttach} from '../../base/card'
import {GameModel} from '../../../models/game-model'
import {CardPosModel, getBasicCardPos} from '../../../models/card-pos-model'
import {HermitAttackType} from '../../../types/attack'
import {getNonEmptyRows} from '../../../utils/board'

class RendogRareHermitCard extends Card<HermitCard> implements HasAttach, GetAttack {
	override props: HermitCard = {
		...hermitCardDefaults,
		id: 'rendog_rare',
		numericId: 87,
		name: 'Rendog',
		rarity: 'rare',
		hermitType: 'builder',
		health: 250,
		primary: {
			name: "Comin' At Ya",
			cost: ['builder'],
			damage: 50,
			power: null,
		},
		secondary: {
			name: 'Role Play',
			cost: ['builder', 'builder', 'builder'],
			damage: 0,
			power: "Use an attack from any of your opponent's Hermits.",
		},
	}

	private imitatingCard: Card<CardProps> | null = null
	private attackType: HermitAttackType | null = null

	getAttack(game: GameModel, pos: CardPosModel, hermitAttackType: HermitAttackType) {
		const attack = createHermitAttackModel(this, game, pos, hermitAttackType)

		if (!attack || attack.type !== 'secondary') return attack
		if (attack.getCreator() !== this) return attack

		if (!this.imitatingCard) return null
		if (!this.imitatingCard.implementsCanAttack()) return null

		// No loops please
		if (this.imitatingCard.props.id === this.props.id) return null

		if (!this.attackType) return null

		// Return the attack we picked from the card we picked
		const newAttack = getHermitsAttack(this.imitatingCard, game, pos, this.attackType)
		if (!newAttack) return null

		const attackName =
			newAttack.type === 'primary' ? this.props.primary.name : this.props.secondary.name
		newAttack.updateLog(
			(values) =>
				`${values.attacker} ${values.coinFlip ? values.coinFlip + ', then ' : ''} attacked ${
					values.target
				} with $v${hermitInfo.name}'s ${attackName}$ for ${values.damage} damage`
		)
		return newAttack
	}

	onAttach(game: GameModel, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		const imitatingCardInstance = Math.random().toString()

		player.hooks.getAttackRequests.add(this, (activeInstance, hermitAttackType) => {
			// Make sure we are attacking
			if (activeInstance !== this) return
			// Only activate power on secondary attack
			if (hermitAttackType !== 'secondary') return

			game.addPickRequest({
				playerId: player.id,
				id: this.props.id,
				message: "Pick one of your opponent's Hermits",
				onResult: (pickResult) => {
					if (pickResult.playerId !== opponentPlayer.id) return 'FAILURE_INVALID_PLAYER'

					const rowIndex = pickResult.rowIndex
					if (rowIndex === undefined) return 'FAILURE_INVALID_SLOT'

					if (pickResult.slot.type !== 'hermit') return 'FAILURE_INVALID_SLOT'
					const pickedCard = pickResult.card
					if (!pickedCard) return 'FAILURE_INVALID_SLOT'

					// No picking the same card as us
					if (pickedCard.props.id === this.props.id) return 'FAILURE_WRONG_PICK'

					game.addModalRequest({
						playerId: player.id,
						data: {
							modalId: 'copyAttack',
							payload: {
								modalName: 'Rendog: Choose an attack to copy',
								modalDescription: "Which of the Hermit's attacks do you want to copy?",
								cardPos: getBasicCardPos(game, pickedCard),
							},
						},
						onResult: (modalResult) => {
							if (!modalResult) return 'FAILURE_INVALID_DATA'
							if (modalResult.cancel) {
								// Cancel this attack so player can choose a different hermit to imitate
								game.state.turn.currentAttack = null
								game.cancelPickRequests()
								return 'SUCCESS'
							}
							if (!modalResult.pick) return 'FAILURE_INVALID_DATA'
							const attack: HermitAttackType = modalResult.pick

							// Store the chosen attack to copy
							this.attackType = attack

							// Replace the hooks of the card we're imitating only if it changed
							if (!this.imitatingCard || pickedCard.props.id !== this.imitatingCard.props.id) {
								if (this.imitatingCard?.implementsAttach()) {
									this.imitatingCard.onDetach(game, pos)
								}

								// Attach the new card
								if (pickedCard.implementsAttach()) pickedCard.onAttach(game, pos)

								// Store which card we are imitating with our own instance
								this.imitatingCard = pickedCard
							}

							// Add the attack requests of the chosen card
							if (this.imitatingCard) {
								player.hooks.getAttackRequests.call(this.imitatingCard, modalResult.pick)
							}

							return 'SUCCESS'
						},
						onTimeout: () => {
							this.attackType = 'primary'
						},
					})

					return 'SUCCESS'
				},
				onTimeout: () => {
					// We didn't pick someone to imitate so do nothing
				},
			})
		})

		player.hooks.onActiveRowChange.add(this, (oldRow, newRow) => {
			if (pos.rowIndex === oldRow) {
				// We switched away from ren, delete the imitating card
				if (this.imitatingCard?.implementsAttach()) {
					// Detach the old card
					this.imitatingCard.onDetach(game, pos)
				}
			}
		})

		player.hooks.blockedActions.add(this, (blockedActions) => {
			// Block "Role Play" if there are not opposing Hermit cards other than rare Ren(s)
			const opposingHermits = getNonEmptyRows(opponentPlayer, false).filter((rowPos) => {
				return rowPos.row.hermitCard && rowPos.row.hermitCard.props.id !== this.props.id
			}).length
			if (
				player.board.activeRow === pos.rowIndex &&
				opposingHermits <= 0 &&
				!blockedActions.includes('SECONDARY_ATTACK')
			) {
				blockedActions.push('SECONDARY_ATTACK')
			}

			return blockedActions
		})
	}
	onDetach(game: GameModel, pos: CardPosModel) {
		const {player} = pos

		// If the card we are imitating is still attached, detach it
		if (this.imitatingCard?.implementsAttach()) {
			this.imitatingCard.onDetach(game, pos)
		}

		// Remove hooks and custom data
		player.hooks.getAttackRequests.remove(this)
		player.hooks.onActiveRowChange.remove(this)
		player.hooks.blockedActions.remove(this)
	}
}

export default RendogRareHermitCard
