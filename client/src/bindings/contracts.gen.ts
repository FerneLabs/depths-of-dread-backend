import { DojoProvider } from "@dojoengine/core";
import { AccountInterface } from "starknet";
import { Direction } from "../bindings/models.gen";

export type IClient = Awaited<ReturnType<typeof client>>;

export function client(provider: DojoProvider) {
    function actions() {
        const createPlayer = async (props: { account: Account; username: number }) => {
			
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

		const move = async (props: { account: AccountInterface; direction: Direction }) => {
			console.log(props.account, props.direction);
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: "actions",
                        entrypoint: "move",
                        calldata: [props.direction],
                    },
                    "depths_of_dread"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };

        const endGame = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: "actions",
                        entrypoint: "end_game",
                        calldata: [],
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
            endGame
        };
    }

    return {
        actions: actions(),
    };
}