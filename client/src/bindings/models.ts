type Vec2 = {
    x: number;
    y: number;
}

enum Direction {
    None = "None",
    Left = "Left",
    Right = "Right",
    Up = "Up",
    Down = "Down",
}

enum PowerUp {
    DoubleDash = "DoubleDash",
    Shield = "Shield",
    Sword = "Sword",
    PeriferalVision = "PeriferalVision",
    Spotlight = "Spotlight",
    FireSpheres = "FireSpheres",
    Magnet = "Magnet",
    FireDefense = "FireDefense",
    PoisonDefense = "PoisonDefense",
}

enum ObstacleType {
    FloorTrap = "FloorTrap",
    RangeTrap = "RangeTrap",
    MeleeEnemy = "MeleeEnemy",
    NoTile = "NoTile",
    FireTrap = "FireTrap",
    PoisonTrap = "PoisonTrap",
}

type PlayerData = {
    player: string;
    username: BigInt;  // felt252 as a string representation
}

type PlayerState = {
    player: string;
    game_id: number;
    current_floor: number;
    position: Vec2;
    coins: number;
}

type PlayerPowerUps = {
    player: string;
    powers: PowerUp[];
}

type GameData = {
    game_id: number;
    player: string;
    floor_reached: number;
    total_score: number;
    start_time: number;
    end_time: number;
}

type GameFloor = {
    game_id: number;
    size: Vec2;
    path: Direction[];
}

type GameCoin = {
    position: Vec2;
    collected: boolean;
}

type GameCoins = {
    game_id: number;
    coins: GameCoin[];
}

type Obstacle = {
    obstacle_type: ObstacleType;
    position: Vec2;
}

type GameObstacles = {
    game_id: number;
    instances: Obstacle[];
}

type Schema = {
    depths_of_dread: {
        PlayerData: PlayerData,
        PlayerState: PlayerState,
        PlayerPowerUps: PlayerPowerUps,
        GameData: GameData,
        GameFloor: GameFloor,
        GameObstacles: GameObstacles,
        GameCoins: GameCoins,
        GameCoin: GameCoin,
        Moved: Moved
    };
};

enum Models {
    PlayerData = "depths_of_dread-PlayerData",
    PlayerState = "depths_of_dread-PlayerState",
    PlayerPowerUps = "depths_of_dread-PlayerPowerUps",
    GameData = "depths_of_dread-GameData",
    GameFloor = "depths_of_dread-GameFloor",
    GameObstacles = "depths_of_dread-GameObstacles",
    GameCoins = "depths_of_dread-GameCoins",
    Moved = "depths_of_dread-Moved",
}

const schema: Schema = {
    depths_of_dread: {
        GameCoins: {
            fieldOrder: ['game_id', 'coins'],
            game_id: 0,
            coins: [
                {
                    position: { x: 0, y: 0 },
                    collected: false
                }
            ],
        },
        GameCoin: {
            fieldOrder: ['position', 'collected'],
            position: {
                x: 0,
                y: 0,
            },
            collected: false,
        },
        Vec2: {
            fieldOrder: ['x', 'y'],
            x: 0,
            y: 0,
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
        GameFloor: {
            fieldOrder: ['game_id', 'size', 'path'],
            game_id: 0,
            size: {
                x: 0,
                y: 0,
            },
            path: [Direction.None],
        },
        Obstacle: {
            fieldOrder: ['obstacle_type', 'position'],
            obstacle_type: ObstacleType.FloorTrap,
            position: {
                x: 0,
                y: 0,
            },
        },
        GameObstacles: {
            fieldOrder: ['game_id', 'instances'],
            game_id: 0,
            instances: [
                {
                    obstacle_type: ObstacleType.FloorTrap,
                    position: { x: 0, y: 0 }
                }
            ],
        },
        Moved: {
            fieldOrder: ['player', 'direction'],
            player: "",
            direction: Direction.None,
        },
        PlayerData: {
            fieldOrder: ['player', 'username'],
            player: "",
            username: 0,
        },
        PlayerPowerUps: {
            fieldOrder: ['player', 'powers'],
            player: "",
            powers: [PowerUp.DoubleDash],
        },
        PlayerState: {
            fieldOrder: ['player', 'game_id', 'current_floor', 'position', 'coins'],
            player: "",
            game_id: 0,
            current_floor: 0,
            position: {
                x: 0,
                y: 0,
            },
            coins: 0,
        },
    }
};

export type { Schema, PlayerData, PlayerState, PlayerPowerUps, GameData, GameFloor, GameObstacles, GameCoins, GameCoin, Obstacle, Vec2 };
export { Direction, schema, Models, PowerUp, ObstacleType};