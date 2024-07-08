import ranks from './ranks.json'
import expansions from './expansions.json'
import * as dotenv from 'dotenv'

// __APP_VERSION__ is defined in vite.config.js and esbuild.js.
declare const __APP_VERSION__: string
let appVersion
try {
	appVersion = __APP_VERSION__
} catch {
	// We are running with tsx, so __APP_VERSION__ was not set.
	appVersion = 'unknown'
}
export const VERSION = appVersion

try {
	dotenv.config()
} catch {}

export const GAME_CONFIG = {
	limits: {
		maxTurnTime: parseInt(process.env.LIMITS_MAX_TURN_TIME as string),
		extraActionTime: parseInt(process.env.LIMITS_EXTRA_ACTION_TIME as string),
		minCards: parseInt(process.env.LIMITS_MIN_CARDS as string),
		maxCards: parseInt(process.env.LIMITS_MAX_CARDS as string),
		maxDuplicates: parseInt(process.env.LIMITS_MAX_DUPLICATES as string),
		maxDeckCost: parseInt(process.env.LIMITS_MAX_DECK_COST as string),
	},
	logoSubText: process.env.LOGO_SUB_TEXT as string,
}

function parseBool(content: string): boolean {
	if (content == 'true') return true
	if (content == 'false') return false
	throw new Error(`Expected true or false, got \`${content}\``)
}

export const DEBUG_CONFIG = {
	disableDeckValidation: parseBool(process.env.DISABLE_DECK_VALIDATION as string),
	extraStartingCards: JSON.stringify(process.env.EXTRA_STARTING_CARDS),
	noItemRequirements: parseBool(process.env.NO_ITEM_REQUIREMENTS as string),
	forceCoinFlip: parseBool(process.env.FORCE_COIN_FLIP as string),
	oneShotMode: parseBool(process.env.ONE_SHOT_MODE as string),
	disableDamage: parseBool(process.env.DISABLE_DAMAGE as string),
	disableDeckOut: parseBool(process.env.DISABLE_DECK_OUT as string),
	startWithAllCards: parseBool(process.env.START_WITH_ALL_CARDS as string),
	unlimitedCards: parseBool(process.env.UNLIMITED_CARDS as string),
	blockedActions: JSON.parse(process.env.BLOCKED_ACTIONS as string),
	availableActions: JSON.parse(process.env.AVAILABLE_ACTIONS as string),
	showHooksState: {
		enabled: parseBool(process.env.SHOW_HOOK_STATE_ENABLED as string),
		clearConsole: parseBool(process.env.SHOW_HOOK_STATE_CLEAR_CONSOLE as string),
	},
	autoEndTurn: parseBool(process.env.AUTO_END_TURN as string),
	logAttackHistory: parseBool(process.env.LOG_ATTACK_HISTORY as string),
}

export const RANKS = ranks
export const EXPANSIONS = expansions
