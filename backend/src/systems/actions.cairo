use depths_of_dread::models::{
    PlayerState, Direction, GameData, GameFloor, GameCoins, Vec2, PlayerPowerUps, PowerUp,
    PowerUpType
};
use starknet::get_block_timestamp;
use core::ArrayTrait;

// define the interface
#[starknet::interface]
trait IActions<T> {
    fn create_player(ref self: T, username: felt252);
    fn create_game(ref self: T);
    fn move(ref self: T, direction: Direction);
    fn end_game(ref self: T);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{
        IActions, gen_game_path, handle_move, handle_coins, handle_game_over, check_powerups,
        handle_next_level
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use depths_of_dread::models::{
        PlayerData, PlayerState, GameData, GameFloor, GameCoins, GameObstacles, Vec2, Direction,
        ObstacleType, Obstacle, PlayerPowerUps, PowerUp, PowerUpType
    };

    use dojo::world::IWorldDispatcherTrait;
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

            let new_player = PlayerData { player, username };

            world.write_model(@new_player)
        }

        fn create_game(ref self: ContractState) {
            let mut world = self.world(@"depths_of_dread");
            let player = get_caller_address();
            let game_id = world.dispatcher.uuid() + 1;

            let coins = array![Vec2 { x: 1, y: 1 }, Vec2 { x: 1, y: 2 }];
            let obstacle1 = Obstacle {
                position: Vec2 { x: 0, y: 1 }, obstacle_type: ObstacleType::RangeTrap
            };

            let player_state = PlayerState {
                player, game_id, current_floor: 1, position: Vec2 { x: 0, y: 0 }, coins: 0,
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
                end_tile: Vec2 { x: 4, y: 7 }
            };

            let game_coins = GameCoins { game_id, coins: coins, };

            let game_obstacles = GameObstacles { game_id, instances: array![obstacle1], };

            let powerup1 = PowerUp {
                power_type: PowerUpType::PoisonDefense, powerup_felt: PowerUpType::PoisonDefense.into()
            };

            let player_powerups = PlayerPowerUps { player, powers: array![powerup1] };

            world.write_model(@player_state);
            world.write_model(@game_data);
            world.write_model(@game_floor);
            world.write_model(@game_coins);
            world.write_model(@game_obstacles);
            world.write_model(@player_powerups);
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref self: ContractState, direction: Direction) {
            let mut world = self.world(@"depths_of_dread");

            let player = get_caller_address();
            let player_state: PlayerState = world.read_model(player);
            let game_floor: GameFloor = world.read_model(player_state.game_id);
            let mut game_coins: GameCoins = world.read_model(player_state.game_id);
            let mut game_obstacles: GameObstacles = world.read_model(player_state.game_id);
            let mut player_powerups: PlayerPowerUps = world.read_model(player);

            // Update player position
            let new_state = handle_move(player_state, direction, @game_floor);

            if new_state.is_none() {
                return;
            }

            let mut new_state = new_state.unwrap();

            //Check win level
            if game_floor.end_tile.x == new_state.position.x
                && game_floor.end_tile.y == new_state.position.y {
                println!("GANAMOS");
                let final_player_state = handle_next_level(new_state);
                world.write_model(@final_player_state);
                return;
            }

            // TODO: Execute obstacle behavior
            let mut obstacle_n = 0;
            let mut useful_powerup: felt252 = PowerUpType::None.into();
            while obstacle_n < game_obstacles.instances.len() {
                if *game_obstacles.instances[obstacle_n].position.x == new_state.position.x
                    && *game_obstacles.instances[obstacle_n].position.y == new_state.position.y {
                    match *game_obstacles.instances[obstacle_n].obstacle_type {
                        // ObstacleType::FloorTrap => { println!("FLOOR TRAP"); },
                        ObstacleType::RangeTrap => { useful_powerup = PowerUpType::Shield.into(); },
                        ObstacleType::MeleeEnemy => { useful_powerup = PowerUpType::Sword.into(); },
                        ObstacleType::NoTile => { useful_powerup = PowerUpType::Wings.into(); },
                        ObstacleType::FireTrap => { useful_powerup = PowerUpType::FireDefense.into(); },
                        ObstacleType::PoisonTrap => { useful_powerup = PowerUpType::PoisonDefense.into(); },
                    }
                };
                obstacle_n += 1;
            };

            //Check powerups to block obstacle
            if useful_powerup != PowerUpType::None.into() {
                let obstacle_blocked = check_powerups(player_powerups.powers, useful_powerup);

                //End game if obstacle wasnt blocked
                if !obstacle_blocked {
                    let game_data: GameData = world.read_model(player_state.game_id);
                    let (new_player_state, new_game_data) = handle_game_over(new_state, game_data);
                    world.write_model(@new_player_state);
                    world.write_model(@new_game_data);
                    return;
                }
            }

            //Check if coin found
            let (new_player_state, new_game_coins) = handle_coins(new_state, game_coins);

            world.write_model(@new_player_state);
            world.write_model(@new_game_coins);

            // Emit an event to the world to notify about the player's move.
            world.emit_event(@Moved { player, direction });
        }

        fn end_game(ref self: ContractState) {
            let mut world = self.world(@"depths_of_dread");
            let player = get_caller_address();

            let player_state: PlayerState = world.read_model(player);
            let game_data: GameData = world.read_model(player_state.game_id);

            let (new_player_state, new_game_data) = handle_game_over(player_state, game_data);

            world.write_model(@new_player_state);
            world.write_model(@new_game_data);
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
    mut player_state: PlayerState, direction: Direction, game_floor: @GameFloor
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
            if player_state.position.x == *game_floor.size.x {
                return Option::None;
            };
            player_state.position.x += 1;
        },
        Direction::Up => {
            if player_state.position.y == *game_floor.size.y {
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

fn check_powerups(mut powerups: Array<PowerUp>, useful_powerup: felt252) -> bool {
    let mut obstacle_blocked = false;
    let mut power_n = 0;
    while power_n < powerups.len() {
        if useful_powerup == *powerups[power_n].powerup_felt && !obstacle_blocked {
            obstacle_blocked = true;
            break;
        }
        power_n += 1;
    };

    obstacle_blocked
}

fn handle_game_over(
    mut player_state: PlayerState, mut game_data: GameData
) -> (PlayerState, GameData) {
    game_data.total_score = player_state.current_floor + player_state.coins;
    game_data.floor_reached = player_state.current_floor;
    game_data.end_time = get_block_timestamp();

    player_state.game_id = 0;
    player_state.current_floor = 0;
    player_state.position = Vec2 { x: 0, y: 0 };
    player_state.coins = 0;

    (player_state, game_data)
}

fn handle_next_level(mut player_state: PlayerState) -> PlayerState {
    player_state.current_floor += 1;
    player_state.position = Vec2 { x: 0, y: 0 };

    player_state
}
