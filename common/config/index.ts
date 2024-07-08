import debugConfig from './debug-config.json'
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

export let CONFIG: any 
try {
	dotenv.config()

	CONFIG = {
		port: parseInt(process.env.PORT),
		clientDevPort: parseInt(process.env.CLIENT_DEV_PORT),
		clientPath: process.env.CLIENT_PATH,
		cors: JSON.parse(process.env.CORS),
		world: process.env.WORLD,
		limits: {
			maxTurnTime: parseInt(process.env.LIMITS_MAX_TURN_TIME),
			extraActionTime: parseInt(process.env.LIMITS_EXTRA_ACTION_TIME),
			minCards: parseInt(process.env.LIMITS_MIN_CARDS),
			maxCards: parseInt(process.env.LIMITS_MAX_CARDS),
			maxDuplicates: parseInt(process.env.LIMITS_MAX_DUPLICATES),
			maxDeckCost: parseInt(process.env.LIMITS_MAX_DECK_COST),
		},
		logoSubText: process.env.LOGO_SUB_TEXT,
	}
} catch {
	CONFIG = {}
}

export const DEBUG_CONFIG = debugConfig
export const RANKS = ranks
export const EXPANSIONS = expansions
