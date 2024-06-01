import {HermitCard, hermitCardDefaults} from '../../base/hermit-card'
import {
	Card,
	HasAttach,
	implementsCanAttack,
	implementsCard,
	implementsHasAttach,
} from '../../base/card'
import {GameModel} from '../../../models/game-model'
import {CardPosModel, getBasicCardPos} from '../../../models/card-pos-model'
import {HermitAttackType} from '../../../types/attack'
import {getNonEmptyRows} from '../../../utils/board'
import {overridesAttachDefaults} from '../../base/card'

const ZombieCleoRareHermitCard = (): HermitCard & HasAttach => {
	let imitatingCard: Card | null = null
	let attackType: HermitAttackType | null = null

	return {
		...hermitCardDefaults,
		...overridesAttachDefaults,
		id: 'zombiecleo_rare',
		numericId: 116,
		name: 'Cleo',
		rarity: 'rare',
		hermitType: 'pvp',
		health: 290,
		primary: {
			name: 'Dismissed',
			cost: ['pvp'],
			damage: 60,
			power: null,
		},
		secondary: {
			name: 'Puppetry',
			cost: ['pvp', 'pvp', 'pvp'],
			damage: 0,
			power: 'Use an attack from any of your AFK Hermits.',
		},
		getAttack(game: GameModel, pos: CardPosModel, hermitAttackType: HermitAttackType) {
			const attack = {
				...this,
				...hermitCardDefaults,
			}.getAttack(game, pos, hermitAttackType)

			if (!attack || attack.type !== 'secondary') return attack
			if (attack.getCreator() !== this) return attack

			if (!imitatingCard) return null
			if (!implementsCard(imitatingCard) || !implementsCanAttack(imitatingCard)) return null

			// No loops please
			if (imitatingCard.id === this.id) return null

			if (!attackType) return null

			// Return the attack we picked from the card we picked
			const newAttack = imitatingCard.getAttack(game, pos, attackType)
			if (!newAttack) return null

			const attackName =
				newAttack.type === 'primary' ? imitatingCard.primary.name : imitatingCard.secondary.name
			newAttack.log = (values) => {
				return imitatingCard
					? `${values.attacker} attacked ${values.target} with $v${imitatingCard.name}'s ${attackName}$ for ${values.damage} damage`
					: ''
			}

			attackType === null

			return newAttack
		},
		onAttach(game: GameModel, pos: CardPosModel) {
			const {player, opponentPlayer} = pos

			player.hooks.getAttackRequests.add(this, (activeInstance, hermitAttackType) => {
				// Make sure we are attacking
				if (activeInstance !== this) return

				// Only secondary attack
				if (hermitAttackType !== 'secondary') return

				// Make sure we have an afk hermit to pick
				const afk = getNonEmptyRows(player, true)
				if (afk.length === 0) return

				game.addPickRequest({
					playerId: player.id,
					id: this.id,
					message: 'Pick one of your AFK Hermits',
					onResult(pickResult) {
						if (pickResult.playerId !== player.id) return 'FAILURE_INVALID_PLAYER'

						const rowIndex = pickResult.rowIndex
						if (rowIndex === undefined) return 'FAILURE_INVALID_SLOT'
						if (rowIndex === player.board.activeRow) return 'FAILURE_INVALID_SLOT'

						if (pickResult.slot.type !== 'hermit') return 'FAILURE_INVALID_SLOT'
						const pickedCard = pickResult.card
						if (!pickedCard) return 'FAILURE_INVALID_SLOT'

						// No picking the same card as us
						if (pickedCard.id === this.id) return 'FAILURE_WRONG_PICK'

						game.addModalRequest({
							playerId: player.id,
							data: {
								modalId: 'copyAttack',
								payload: {
									modalName: 'Cleo: Choose an attack to copy',
									modalDescription: "Which of the Hermit's attacks do you want to copy?",
									cardPos: getBasicCardPos(game, pickedCard),
								},
							},
							onResult(modalResult) {
								if (!modalResult) return 'FAILURE_INVALID_DATA'
								if (modalResult.cancel) {
									// Cancel this attack so player can choose a different hermit to imitate
									game.state.turn.currentAttack = null
									game.cancelPickRequests()
									return 'SUCCESS'
								}
								if (!modalResult.pick) return 'FAILURE_INVALID_DATA'

								// Store the card id to use when getting attacks
								imitatingCard = pickedCard
								attackType = modalResult.pick

								// Add the attack requests of the chosen card as they would not be called otherwise
								player.hooks.getAttackRequests.call(pickedCard, modalResult.pick)

								return 'SUCCESS'
							},
							onTimeout() {
								imitatingCard = pickedCard
								attackType = 'primary'
							},
						})

						return 'SUCCESS'
					},
					onTimeout() {
						// We didn't pick someone so do nothing
					},
				})
			})

			// @TODO requires getActions to be able to remove
			player.hooks.blockedActions.add(this, (blockedActions) => {
				// Block "Puppetry" if there are not AFK Hermit cards other than rare Cleo(s)
				const afkHermits = getNonEmptyRows(player, true).filter((rowPos) => {
					return rowPos.row.hermitCard.id !== this.id
				}).length
				if (
					player.board.activeRow === pos.rowIndex &&
					afkHermits <= 0 &&
					!blockedActions.includes('SECONDARY_ATTACK')
				) {
					blockedActions.push('SECONDARY_ATTACK')
				}

				return blockedActions
			})

			player.hooks.onActiveRowChange.add(this, (oldRow, newRow) => {
				if (pos.rowIndex === oldRow) {
					// We switched away from ren, delete the imitating card
					if (implementsHasAttach(imitatingCard)) {
						// Detach the old card
						imitatingCard.onDetach(game, pos)
					}
				}
			})

			player.hooks.blockedActions.add(this, (blockedActions) => {
				// Block "Role Play" if there are not opposing Hermit cards other than rare Ren(s)
				const opposingHermits = getNonEmptyRows(opponentPlayer, false).filter((rowPos) => {
					return rowPos.row.hermitCard && rowPos.row.hermitCard.id !== this.id
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
		},
		onDetach(game: GameModel, pos: CardPosModel) {
			const {player} = pos

			// If the card we are imitating is still attached, detach it
			if (implementsHasAttach(imitatingCard)) {
				imitatingCard.onDetach(game, pos)
			}

			// Remove hooks and custom data
			player.hooks.getAttackRequests.remove(this)
			player.hooks.onActiveRowChange.remove(this)
			player.hooks.blockedActions.remove(this)
		},
	}
}

export default ZombieCleoRareHermitCard
