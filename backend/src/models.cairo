use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct PlayerData {
    #[key]
    pub player: ContractAddress,
    pub username: felt252
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct PlayerState {
    #[key]
    pub player: ContractAddress,
    pub game_id: usize,
    pub current_floor: u16,
    pub position: Vec2,
    pub coins: u16
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct PlayerPowerUps {
    #[key]
    pub player: ContractAddress,
    pub powers: Array<PowerUp>,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GameData {
    #[key]
    pub game_id: usize,
    pub player: ContractAddress,
    pub floor_reached: u16,
    pub total_score: u16,
    pub start_time: u64,
    pub end_time: u64
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct GameFloor {
    #[key]
    pub game_id: usize,
    pub size: Vec2,
    pub path: Array<Direction>,
    pub end_tile: Vec2
}

#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct GameCoins {
    #[key]
    pub game_id: usize,
    pub coins: Array<Vec2>
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct GameObstacles {
    #[key]
    pub game_id: usize,
    pub instances: Array<Obstacle>,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct PowerUp {
    pub power_type: PowerUpType,
    pub powerup_felt: felt252,
}

#[derive(Copy, Serde, Drop, Introspect)]
pub enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct Vec2 {
    pub x: u32,
    pub y: u32
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum PowerUpType {
    // DoubleDash, // Player can trigger a double dash, skips fall tiles too
    Shield, // Projectiles defense
    Sword, // Melee defense
    // PeriferalVision, // Vision distance increases 1 tile
    // Spotlight, // Random spot in map is cleared up in the beginning of the run
    // FireSpheres, // Spheres around player killing melee enemies in the fog (1 tile around the
    // player)
    // Magnet, // Attracts coins in a 2 tiles radius
    FireDefense, // Fire traps defense
    PoisonDefense, // Poison traps defense
    None,
    Wings
    // // TODO: add more powerups
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct Obstacle {
    pub obstacle_type: ObstacleType,
    pub position: Vec2
}

#[derive(Drop, Serde, Introspect, Copy)]
pub enum ObstacleType {
    // FloorTrap,
    RangeTrap,
    MeleeEnemy,
    NoTile,
    FireTrap,
    PoisonTrap
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct PlayerCreated {
    #[key]
    player: ContractAddress,
    username: felt252
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct GameCreated {
    #[key]
    player: ContractAddress,
    game_id: usize
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct GameEnded {
    #[key]
    player: ContractAddress,
    game_id: usize
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct FloorCleared {
    #[key]
    player: ContractAddress,
    game_id: usize
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct Moved {
    #[key]
    player: ContractAddress,
    direction: Direction
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct ObstacleFound {
    #[key]
    player: ContractAddress,
    obstacle_type: ObstacleType,
    obstacle_position: Vec2,
    defended: bool
}

#[derive(Copy, Drop, Destruct)]
#[dojo::event]
struct CoinFound {
    #[key]
    player: ContractAddress,
    coin_count: u16
}

impl DirectionIntoFelt252 of Into<Direction, felt252> {
    fn into(self: Direction) -> felt252 {
        match self {
            Direction::None => 0,
            Direction::Left => 1,
            Direction::Right => 2,
            Direction::Up => 3,
            Direction::Down => 4,
        }
    }
}

impl PowerUpIntoFelt252 of Into<PowerUpType, felt252> {
    fn into(self: PowerUpType) -> felt252 {
        match self {
            // PowerUpType::DoubleDash => 0,
            PowerUpType::Shield => 1,
            PowerUpType::Sword => 2,
            // PowerUpType::PeriferalVision => 3,
            // PowerUpType::Spotlight => 4,
            // PowerUpType::FireSpheres => 5,
            // PowerUpType::Magnet => 6,
            PowerUpType::FireDefense => 7,
            PowerUpType::PoisonDefense => 8,
            PowerUpType::None => 9,
            PowerUpType::Wings => 10,
        }
    }
}


impl ObstacleTypeIntoFelt252 of Into<ObstacleType, felt252> {
    fn into(self: ObstacleType) -> felt252 {
        match self {
            // ObstacleType::FloorTrap => 0,
            ObstacleType::RangeTrap => 1,
            ObstacleType::MeleeEnemy => 2,
            ObstacleType::NoTile => 3,
            ObstacleType::FireTrap => 4,
            ObstacleType::PoisonTrap => 5,
        }
    }
}

#[generate_trait]
impl Vec2Impl of Vec2Trait {
    fn is_zero(self: Vec2) -> bool {
        if self.x - self.y == 0 {
            return true;
        }
        false
    }

    fn is_equal(self: Vec2, b: Vec2) -> bool {
        self.x == b.x && self.y == b.y
    }
}
