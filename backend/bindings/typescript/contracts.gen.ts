import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {

	const actions_createPlayer = async (account: Account, username: number) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "actions",
					entryPoint: "create_player",
					calldata: [username],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_createGame = async (account: Account) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "actions",
					entryPoint: "create_game",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_move = async (account: Account, direction: models.Direction) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "actions",
					entryPoint: "move",
					calldata: [direction],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_endGame = async (account: Account) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "actions",
					entryPoint: "end_game",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		actions: {
			createPlayer: actions_createPlayer,
			createGame: actions_createGame,
			move: actions_move,
			endGame: actions_endGame,
		},
	};
}