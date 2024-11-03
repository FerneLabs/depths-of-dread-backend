use depths_of_dread::models::{
    PlayerState, Direction, GameData, GameFloor, GameCoins, Vec2, PlayerPowerUps, PowerUp,
    PowerUpType, Obstacle, ObstacleType, GameObstacles
};
use core::ArrayTrait;
// TODO: Create other floors functions

pub fn gen_floor_1(game_id: usize) -> (GameFloor, GameObstacles, GameCoins) {
    let game_floor = GameFloor { 
        game_id, 
        size: Vec2 { x: 2, y: 2 }, 
        path: array![Direction::Up, Direction::Right, Direction::Right, Direction::Up],
        end_tile: Vec2 { x: 2, y:2 } 
    };
    
    let mut obst_instances = ArrayTrait::<Obstacle>::new();
    obst_instances.append(Obstacle { position: Vec2 { x: 1, y: 0 }, obstacle_type: ObstacleType::FireTrap });
    obst_instances.append(Obstacle { position: Vec2 { x: 0, y: 2 }, obstacle_type: ObstacleType::FireTrap });
    obst_instances.append(Obstacle { position: Vec2 { x: 1, y: 2 }, obstacle_type: ObstacleType::FireTrap });
    
    let game_obstacles = GameObstacles { 
        game_id, 
        instances: obst_instances
    };
    
    let game_coins = GameCoins { 
        game_id, 
        coins: array![Vec2 { x: 2, y: 0 }]
    };

    (game_floor, game_obstacles, game_coins)
}
