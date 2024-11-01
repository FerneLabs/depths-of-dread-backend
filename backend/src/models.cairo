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
    pub path: Array<Direction>
}

#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct GameCoins {
    #[key]
    pub game_id: usize,
    pub coins: Array<GameCoin>
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct GameObstacles {
    #[key]
    pub game_id: usize,
    pub instances: Array<Obstacle>,
}

#[derive(Drop, Serde, Introspect)]
pub struct GameCoin {
    pub position: Vec2,
    pub collected: bool
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

#[derive(Drop, Serde, Introspect)]
pub enum PowerUp {
    DoubleDash, // Player can trigger a double dash, skips fall tiles too
    Shield, // Projectiles defense
    Sword, // Melee defense
    PeriferalVision, // Vision distance increases 1 tile
    Spotlight, // Random spot in map is cleared up in the beginning of the run 
    FireSpheres, // Spheres around player killing melee enemies in the fog (1 tile around the player)
    Magnet, // Attracts coins in a 2 tiles radius
    FireDefense, // Fire traps defense
    PoisonDefense // Poison traps defense
    // TODO: add more powerups
}

#[derive(Drop, Serde, Introspect)]
pub struct Obstacle {
    pub obstacle_type: ObstacleType,
    pub position: Vec2
}

#[derive(Drop, Serde, Introspect, Copy)]
pub enum ObstacleType {
    FloorTrap,
    RangeTrap,
    MeleeEnemy,
    NoTile,
    FireTrap,
    PoisonTrap
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

impl PowerUpIntoFelt252 of Into<PowerUp, felt252> {
    fn into(self: PowerUp) -> felt252 {
        match self {
            PowerUp::DoubleDash => 0,
            PowerUp::Shield => 1,
            PowerUp::Sword => 2,
            PowerUp::PeriferalVision => 3,
            PowerUp::Spotlight => 4,
            PowerUp::FireSpheres => 5,
            PowerUp::Magnet => 6,
            PowerUp::FireDefense => 7,
            PowerUp::PoisonDefense => 8,
        }
    }
}

impl ObstacleTypeIntoFelt252 of Into<ObstacleType, felt252> {
    fn into(self: ObstacleType) -> felt252 {
        match self {
            ObstacleType::FloorTrap => 0,
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
