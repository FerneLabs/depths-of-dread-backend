use depths_of_dread::models::{PlayerState, Direction};
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
        PlayerData, PlayerState, 
        GameData, GameFloor, GameCoins, GameObstacles, 
        Vec2, Direction
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
            
            set!(
                world,
                (
                    PlayerState {
                        player,
                        game_id,
                        current_floor: 1,
                        position: Vec2 { x: 2, y: 0 }, // starts in the middle of 5x8
                        coins: 0
                    },
                    GameData {
                        game_id,
                        player,
                        floor_reached: 1,
                        total_score: 0,
                        start_time: get_block_timestamp(),
                        end_time: 0
                    },
                    GameFloor {
                        game_id,
                        size: Vec2 { x: 4, y: 7 }, // 5x8
                        path: gen_game_path()
                    }
  
                )
            );
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref world: IWorldDispatcher, direction: Direction) {
            let player = get_caller_address();
            let player_state = get!(world, player, (PlayerState));

            // TODO: check that move is withing boundaries
            // TODO: check if destination move is obstacle
            // TODO: check if destination move causes game over
            
            // Update player position 
            let new_state = handle_move(player_state, direction);
            set!(world, (new_state));

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

fn handle_move(mut player_state: PlayerState, direction: Direction) -> PlayerState {
    match direction {
        Direction::None => { return player_state; },
        Direction::Left => { player_state.position.x -= 1; },
        Direction::Right => { player_state.position.x += 1; },
        Direction::Up => { player_state.position.y += 1; },
        Direction::Down => { player_state.position.y -= 1; },
    };
    player_state
}

