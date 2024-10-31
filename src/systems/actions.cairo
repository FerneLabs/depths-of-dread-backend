use depths_of_dread::models::{PlayerState, Direction, GameFloor};
use core::ArrayTrait;

// define the interface
#[dojo::interface]
trait IActions {
    fn create_player(ref world: IWorldDispatcher, username: felt252);
    fn create_game(ref world: IWorldDispatcher);
    fn move(ref world: IWorldDispatcher, direction: Direction);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions, gen_game_path, handle_move};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use depths_of_dread::models::{
        PlayerData, PlayerState, GameData, GameFloor, GameCoins, GameObstacles, Vec2, Direction,
        ObstacleType, Obstacle
    };

    #[derive(Drop, Serde)]
    #[dojo::model]
    #[dojo::event]
    struct Moved {
        #[key]
        player: ContractAddress,
        direction: Direction
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create_player(ref world: IWorldDispatcher, username: felt252) {
            // This will update the player username if a player already uses the same address
            let player = get_caller_address();
            set!(world, (PlayerData { player, username }));
        }

        fn create_game(ref world: IWorldDispatcher) {
            let player = get_caller_address();
            let game_id = world.uuid() + 1;

            let coins = array![Vec2 { x: 1, y: 1 }, Vec2 { x: 1, y: 2 }];
            let obstacle1 = Obstacle {
                position: Vec2 { x: 2, y: 2 }, obstacle_type: ObstacleType::FloorTrap
            };
            set!(
                world,
                (
                    PlayerState {
                        player, game_id, current_floor: 1, position: Vec2 { x: 0, y: 0 }, coins: 0
                    },
                    GameData {
                        game_id,
                        player,
                        floor_reached: 1,
                        total_score: 0,
                        start_time: get_block_timestamp(),
                        end_time: 0
                    },
                    GameFloor { game_id, size: Vec2 { x: 4, y: 7 }, // 5x8
                     path: gen_game_path() },
                    GameCoins { game_id, coins: coins },
                    GameObstacles { game_id, instances: array![obstacle1] }
                )
            );
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref world: IWorldDispatcher, direction: Direction) {
            let player = get_caller_address();
            let player_state = get!(world, player, (PlayerState));
            let game_floor = get!(world, player_state.game_id, (GameFloor));
            let mut game_coins = get!(world, player_state.game_id, (GameCoins));
            let mut game_obstacles = get!(world, player_state.game_id, (GameObstacles));

            // TODO: check if destination move causes game over

            // Update player position
            let new_state = handle_move(player_state, direction, game_floor);

            if new_state.is_none() {
                return;
            }

            let mut new_player_state = new_state.unwrap();

            // TODO: Execute obstacle behavior
            let mut obstacle_n = 0;
            while obstacle_n < game_obstacles.instances.len() {
                if *game_obstacles.instances[obstacle_n].position.x == new_player_state.position.x
                    && *game_obstacles
                        .instances[obstacle_n]
                        .position
                        .y == new_player_state
                        .position
                        .y {
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

            //TODO check coins already collected
            let mut coin_n = 0;
            let mut uncollected_coins = ArrayTrait::new();
            while coin_n < game_coins.coins.len() {
                if *game_coins.coins[coin_n].x == new_player_state.position.x
                    && *game_coins.coins[coin_n].y == new_player_state.position.y {
                    new_player_state.coins += 1;
                } else {
                    uncollected_coins.append(*game_coins.coins[coin_n]);
                }
                coin_n += 1;
            };
            game_coins.coins = uncollected_coins;

            set!(world, (new_player_state, game_coins));

            // Emit an event to the world to notify about the player's move.
            emit!(world, (Moved { player, direction }));
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

