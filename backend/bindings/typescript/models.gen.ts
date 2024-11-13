import type { SchemaType } from "@dojoengine/sdk";

// Type definition for `depths_of_dread::models::GameCoins` struct
export interface GameCoins {
	fieldOrder: string[];
	game_id: number;
	coins: Array<Vec2>;
}

// Type definition for `depths_of_dread::models::GameCoinsValue` struct
export interface GameCoinsValue {
	fieldOrder: string[];
	coins: Array<Vec2>;
}

// Type definition for `depths_of_dread::models::Vec2` struct
export interface Vec2 {
	fieldOrder: string[];
	x: number;
	y: number;
}

// Type definition for `depths_of_dread::models::GameDataValue` struct
export interface GameDataValue {
	fieldOrder: string[];
	player: string;
	floor_reached: number;
	total_score: number;
	start_time: number;
	end_time: number;
}

// Type definition for `depths_of_dread::models::GameData` struct
export interface GameData {
	fieldOrder: string[];
	game_id: number;
	player: string;
	floor_reached: number;
	total_score: number;
	start_time: number;
	end_time: number;
}

// Type definition for `depths_of_dread::models::GameFloorValue` struct
export interface GameFloorValue {
	fieldOrder: string[];
	size: Vec2;
	path: Array<Direction>;
	end_tile: Vec2;
}

// Type definition for `depths_of_dread::models::GameFloor` struct
export interface GameFloor {
	fieldOrder: string[];
	game_id: number;
	size: Vec2;
	path: Array<Direction>;
	end_tile: Vec2;
}

// Type definition for `depths_of_dread::models::Vec2` struct
export interface Vec2 {
	fieldOrder: string[];
	x: number;
	y: number;
}

// Type definition for `depths_of_dread::models::Vec2` struct
export interface Vec2 {
	fieldOrder: string[];
	x: number;
	y: number;
}

// Type definition for `depths_of_dread::models::Obstacle` struct
export interface Obstacle {
	fieldOrder: string[];
	obstacle_type: ObstacleType;
	position: Vec2;
}

// Type definition for `depths_of_dread::models::GameObstaclesValue` struct
export interface GameObstaclesValue {
	fieldOrder: string[];
	instances: Array<Obstacle>;
}

// Type definition for `depths_of_dread::models::GameObstacles` struct
export interface GameObstacles {
	fieldOrder: string[];
	game_id: number;
	instances: Array<Obstacle>;
}

// Type definition for `depths_of_dread::models::PlayerData` struct
export interface PlayerData {
	fieldOrder: string[];
	player: string;
	username: number;
}

// Type definition for `depths_of_dread::models::PlayerDataValue` struct
export interface PlayerDataValue {
	fieldOrder: string[];
	username: number;
}

// Type definition for `depths_of_dread::models::PlayerPowerUpsValue` struct
export interface PlayerPowerUpsValue {
	fieldOrder: string[];
	powers: Array<PowerUp>;
}

// Type definition for `depths_of_dread::models::PlayerPowerUps` struct
export interface PlayerPowerUps {
	fieldOrder: string[];
	player: string;
	powers: Array<PowerUp>;
}

// Type definition for `depths_of_dread::models::PowerUp` struct
export interface PowerUp {
	fieldOrder: string[];
	power_type: PowerUpType;
	powerup_felt: number;
}

// Type definition for `depths_of_dread::models::PlayerState` struct
export interface PlayerState {
	fieldOrder: string[];
	player: string;
	game_id: number;
	current_floor: number;
	position: Vec2;
	coins: number;
}

// Type definition for `depths_of_dread::models::Vec2` struct
export interface Vec2 {
	fieldOrder: string[];
	x: number;
	y: number;
}

// Type definition for `depths_of_dread::models::PlayerStateValue` struct
export interface PlayerStateValue {
	fieldOrder: string[];
	game_id: number;
	current_floor: number;
	position: Vec2;
	coins: number;
}

// Type definition for `depths_of_dread::models::Direction` enum
export enum Direction {
	None,
	Left,
	Right,
	Up,
	Down,
}

// Type definition for `depths_of_dread::models::ObstacleType` enum
export enum ObstacleType {
	RangeTrap,
	MeleeEnemy,
	NoTile,
	FireTrap,
	PoisonTrap,
}

// Type definition for `depths_of_dread::models::PowerUpType` enum
export enum PowerUpType {
	Shield,
	Sword,
	FireDefense,
	PoisonDefense,
	None,
	Wings,
}

export interface DepthsOfDreadSchemaType extends SchemaType {
	depths_of_dread: {
		GameCoins: GameCoins,
		GameCoinsValue: GameCoinsValue,
		Vec2: Vec2,
		GameDataValue: GameDataValue,
		GameData: GameData,
		GameFloorValue: GameFloorValue,
		GameFloor: GameFloor,
		Obstacle: Obstacle,
		GameObstaclesValue: GameObstaclesValue,
		GameObstacles: GameObstacles,
		PlayerData: PlayerData,
		PlayerDataValue: PlayerDataValue,
		PlayerPowerUpsValue: PlayerPowerUpsValue,
		PlayerPowerUps: PlayerPowerUps,
		PowerUp: PowerUp,
		PlayerState: PlayerState,
		PlayerStateValue: PlayerStateValue,
		ERC__Balance: ERC__Balance,
		ERC__Token: ERC__Token,
		ERC__Transfer: ERC__Transfer,
	},
}
export const schema: DepthsOfDreadSchemaType = {
	depths_of_dread: {
		GameCoins: {
			fieldOrder: ['game_id', 'coins'],
			game_id: 0,
			coins: [{ fieldOrder: ['x', 'y'], x: 0, y: 0, }],
		},
		GameCoinsValue: {
			fieldOrder: ['coins'],
			coins: [{ fieldOrder: ['x', 'y'], x: 0, y: 0, }],
		},
		Vec2: {
			fieldOrder: ['x', 'y'],
			x: 0,
			y: 0,
		},
		GameDataValue: {
			fieldOrder: ['player', 'floor_reached', 'total_score', 'start_time', 'end_time'],
			player: "",
			floor_reached: 0,
			total_score: 0,
			start_time: 0,
			end_time: 0,
		},
		GameData: {
			fieldOrder: ['game_id', 'player', 'floor_reached', 'total_score', 'start_time', 'end_time'],
			game_id: 0,
			player: "",
			floor_reached: 0,
			total_score: 0,
			start_time: 0,
			end_time: 0,
		},
		GameFloorValue: {
			fieldOrder: ['size', 'path', 'end_tile'],
			size: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
			path: [Direction.None],
			end_tile: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
		},
		GameFloor: {
			fieldOrder: ['game_id', 'size', 'path', 'end_tile'],
			game_id: 0,
			size: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
			path: [Direction.None],
			end_tile: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
		},
		Obstacle: {
			fieldOrder: ['obstacle_type', 'position'],
			obstacle_type: ObstacleType.RangeTrap,
			position: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
		},
		GameObstaclesValue: {
			fieldOrder: ['instances'],
			instances: [{ fieldOrder: ['obstacle_type', 'position'], obstacle_type: ObstacleType, position: Vec2, }],
		},
		GameObstacles: {
			fieldOrder: ['game_id', 'instances'],
			game_id: 0,
			instances: [{ fieldOrder: ['obstacle_type', 'position'], obstacle_type: ObstacleType, position: Vec2, }],
		},
		PlayerData: {
			fieldOrder: ['player', 'username'],
			player: "",
			username: 0,
		},
		PlayerDataValue: {
			fieldOrder: ['username'],
			username: 0,
		},
		PlayerPowerUpsValue: {
			fieldOrder: ['powers'],
			powers: [{ fieldOrder: ['power_type', 'powerup_felt'], power_type: PowerUpType, powerup_felt: 0, }],
		},
		PlayerPowerUps: {
			fieldOrder: ['player', 'powers'],
			player: "",
			powers: [{ fieldOrder: ['power_type', 'powerup_felt'], power_type: PowerUpType, powerup_felt: 0, }],
		},
		PowerUp: {
			fieldOrder: ['power_type', 'powerup_felt'],
			power_type: PowerUpType.Shield,
			powerup_felt: 0,
		},
		PlayerState: {
			fieldOrder: ['player', 'game_id', 'current_floor', 'position', 'coins'],
			player: "",
			game_id: 0,
			current_floor: 0,
			position: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
			coins: 0,
		},
		PlayerStateValue: {
			fieldOrder: ['game_id', 'current_floor', 'position', 'coins'],
			game_id: 0,
			current_floor: 0,
			position: { fieldOrder: ['x', 'y'], x: 0, y: 0, },
			coins: 0,
		},
		ERC__Balance: {
			fieldOrder: ['balance', 'type', 'tokenmetadata'],
			balance: '',
			type: 'ERC20',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
		},
		ERC__Token: {
			fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
			name: '',
			symbol: '',
			tokenId: '',
			decimals: '',
			contractAddress: '',
		},
		ERC__Transfer: {
			fieldOrder: ['from', 'to', 'amount', 'type', 'executed', 'tokenMetadata'],
			from: '',
			to: '',
			amount: '',
			type: 'ERC20',
			executedAt: '',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
			transactionHash: '',
		},

	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}