import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models";

export type IClient = Awaited<ReturnType<typeof client>>;

export function client(provider: DojoProvider) {
    // System definitions for `dojo_starter-actions` contract
    function actions() {
        // Call the `spawn` system with the specified Account and calldata
        const createPlayer = async (props: { account: Account; username: number }) => {
			console.log(props.account, props.username);
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: "actions",
                        entrypoint: "create_player",
                        calldata: [props.username],
                    },
                    "depths_of_dread"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };

        // Call the `move` system with the specified Account and calldata
        const createGame = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: "actions",
                        entrypoint: "create_game",
                        calldata: [],
                    },
                    "depths_of_dread"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };

		const move = async (props: { account: Account; direction: any }) => {
			console.log(props.direction);
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: "actions",
                        entrypoint: "move",
                        calldata: [
							["None", "Left", "Right", "Up", "Down"].indexOf(
                                props.direction.type
                            ),
						],
                    },
                    "depths_of_dread"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };

        return {
			createPlayer,
            createGame,
            move,
        };
    }

    return {
        actions: actions(),
    };
}