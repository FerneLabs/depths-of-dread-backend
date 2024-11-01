use depths_of_dread::models::{PlayerState, Direction, GameFloor, GameCoins};
use core::ArrayTrait;

// define the interface
#[starknet::interface]
trait IActions<T> {
    fn create_player(ref self: T, username: felt252);
    fn create_game(ref self: T);
    fn move(ref self: T, direction: Direction);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{IActions, gen_game_path, handle_move, handle_coins};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use depths_of_dread::models::{
        PlayerData, PlayerState, GameData, GameFloor, GameCoins, GameObstacles, Vec2, Direction,
        ObstacleType, Obstacle
    };

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Destruct)]
    #[dojo::event]
    struct Moved {
        #[key]
        player: ContractAddress,
        direction: Direction
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create_player(ref self: ContractState, username: felt252) {
            // This will update the player username if a player already uses the same address
            let mut world = self.world(@"depths_of_dread");
            let player = get_caller_address();

            let new_player = PlayerData {
                player, username
            };

            world.write_model(@new_player)
        }

        fn create_game(ref self: ContractState) {
            let mut world = self.world(@"depths_of_dread");
            let player = get_caller_address();
            let game_id = get_block_timestamp().try_into().unwrap();

            let coins = array![Vec2 { x: 1, y: 1 }, Vec2 { x: 1, y: 2 }];
            let obstacle1 = Obstacle {
                position: Vec2 { x: 2, y: 2 }, obstacle_type: ObstacleType::FloorTrap
            };

            let player_state = PlayerState {
                player,
                game_id,
                current_floor: 1,
                position: Vec2 { x: 0, y: 0 },
                coins: 0,
            };

            let game_data = GameData {
                game_id,
                player,
                floor_reached: 1,
                total_score: 0,
                start_time: get_block_timestamp(),
                end_time: 0,
            };

            let game_floor = GameFloor {
                game_id,
                size: Vec2 { x: 4, y: 7 }, // 5x8
                path: gen_game_path(),
            };

            let game_coins = GameCoins {
                game_id,
                coins: coins,
            };

            let game_obstacles = GameObstacles {
                game_id,
                instances: array![obstacle1],
            };

            world.write_model(@player_state);
            world.write_model(@game_data);
            world.write_model(@game_floor);
            world.write_model(@game_coins);
            world.write_model(@game_obstacles);
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref self: ContractState, direction: Direction) {

            let mut world = self.world(@"depths_of_dread");

            let player = get_caller_address();
            let player_state: PlayerState = world.read_model(player);
            let game_floor: GameFloor = world.read_model(player_state.game_id);
            let mut game_coins: GameCoins = world.read_model(player_state.game_id);
            let mut game_obstacles: GameObstacles = world.read_model(player_state.game_id);

            // TODO: check if destination move causes game over

            // Update player position
            let new_state = handle_move(player_state, direction, game_floor);

            if new_state.is_none() {
                return;
            }

            let mut new_state = new_state.unwrap();

            // TODO: Execute obstacle behavior
            let mut obstacle_n = 0;
            while obstacle_n < game_obstacles.instances.len() {
                if *game_obstacles.instances[obstacle_n].position.x == new_state.position.x
                    && *game_obstacles.instances[obstacle_n].position.y == new_state.position.y {
                    match *game_obstacles.instances[obstacle_n].obstacle_type {
                        ObstacleType::FloorTrap => { println!("FLOOR TRAP"); },
                        ObstacleType::RangeTrap => { println!("RANGE TRAP"); },
                        ObstacleType::MeleeEnemy => { println!("MELEE ENEMY"); },
                        ObstacleType::NoTile => { println!("NO TILE TRAP"); },
                        ObstacleType::FireTrap => { println!("FIRE TRAP"); },
                        ObstacleType::PoisonTrap => { println!("POISON TRAP"); },
                    }
                };
                obstacle_n += 1;
            };

            let (new_player_state, new_game_coins) = handle_coins(new_state, game_coins);

            world.write_model(@new_player_state);

            world.write_model(@new_game_coins);

            // Emit an event to the world to notify about the player's move.            
            world.emit_event(@Moved { player, direction });
        }
    }
}

fn gen_game_path() -> Array<Direction> {
    let mut path = ArrayTrait::<Direction>::new();
    path.append(Direction::Up);
    path.append(Direction::Up);
    path.append(Direction::Up);
    path.append(Direction::Up);
    path.append(Direction::Up);
    path.append(Direction::Up);
    path.append(Direction::Up);
    path
}

fn handle_move(
    mut player_state: PlayerState, direction: Direction, game_floor: GameFloor
) -> Option<PlayerState> {
    match direction {
        Direction::None => { return Option::None; },
        Direction::Left => {
            if player_state.position.x == 0 {
                return Option::None;
            };
            player_state.position.x -= 1;
        },
        Direction::Right => {
            if player_state.position.x == game_floor.size.x {
                return Option::None;
            };
            player_state.position.x += 1;
        },
        Direction::Up => {
            if player_state.position.y == game_floor.size.y {
                return Option::None;
            };
            player_state.position.y += 1;
        },
        Direction::Down => {
            if player_state.position.y == 0 {
                return Option::None;
            };
            player_state.position.y -= 1;
        },
    };
    Option::Some(player_state)
}

fn handle_coins(
    mut player_state: PlayerState, mut game_coins: GameCoins
) -> (PlayerState, GameCoins) {
    let mut coin_n = 0;
    let mut uncollected_coins = ArrayTrait::new();
    while coin_n < game_coins.coins.len() {
        if *game_coins.coins[coin_n].x == player_state.position.x
            && *game_coins.coins[coin_n].y == player_state.position.y {
            player_state.coins += 1;
        } else {
            uncollected_coins.append(*game_coins.coins[coin_n]);
        }
        coin_n += 1;
    };
    game_coins.coins = uncollected_coins;

    (player_state, game_coins)
}

