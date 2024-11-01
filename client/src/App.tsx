import { useEffect, useMemo } from "react";
import { SDK, createDojoStore, SchemaType } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { addAddressPadding } from "starknet";

import { Models } from "./bindings.ts";
import { useDojo } from "./useDojo.tsx";
import useModel from "./useModel.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";

export const useDojoStore = createDojoStore<SchemaType>();

function App({ sdk }: { sdk: SDK<SchemaType> }) {
    const {
        account,
        setup: { client },
    } = useDojo();
    const state = useDojoStore((state) => state);
    const entities = useDojoStore((state) => state.entities);

    const { createPlayer } = useSystemCalls();

    const entityId = useMemo(
        () => getEntityIdFromKeys([BigInt(account?.account.address)]),
        [account?.account.address]
    );

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const subscription = await sdk.subscribeEntityQuery(
                {
                    depths_of_dread: {
                        PlayerData: {
                            $: {
                                where: {
                                    player: {
                                        $is: addAddressPadding(
                                            account.account.address
                                        ),
                                    },
                                },
                            },
                        },
                        PlayerState: {
                            $: {
                                where: {
                                    player: {
                                        $is: addAddressPadding(
                                            account.account.address
                                        ),
                                    },
                                },
                            },
                        },
                        GameData: {
                            $: {
                                where: {
                                    player: {
                                        $is: addAddressPadding(
                                            account.account.address
                                        ),
                                    },
                                },
                            },
                        },
                        GameFloor: {
                            $: {
                                where: {
                                    game_id: {
                                        $is: gameData?.game_id
                                    },
                                },
                            },
                        },
                    },
                },
                (response) => {
                    if (response.error) {
                        console.error(
                            "Error setting up entity sync:",
                            response.error
                        );
                    } else if (
                        response.data &&
                        response.data[0].entityId !== "0x0"
                    ) {
                        console.log("subscribed", response.data[0]);
                        state.updateEntity(response.data[0]);
                    }
                },
                { logging: false }
            );

            unsubscribe = () => subscription.cancel();
        };

        subscribe();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [sdk, account?.account.address]);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                await sdk.getEntities(
                    {
                        depths_of_dread: {
                            PlayerData: {
                                $: {
                                    where: {
                                        player: {
                                            $eq: addAddressPadding(
                                                account.account.address
                                            ),
                                        },
                                    },
                                },
                            },
                            PlayerState: {
                                $: {
                                    where: {
                                        player: {
                                            $eq: addAddressPadding(
                                                account.account.address
                                            ),
                                        },
                                    },
                                },
                            },
                            GameData: {
                                $: {
                                    where: {
                                        player: {
                                            $eq: addAddressPadding(
                                                account.account.address
                                            ),
                                        },
                                    },
                                },
                            },
                        },
                    },
                    (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            console.log("SETTING:", resp.data);
                            state.setEntities(resp.data);
                        }
                    }
                );
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchEntities();
    }, [sdk, account?.account.address]);

    const playerData = useModel(entityId, Models.PlayerData);
    const playerState = useModel(entityId, Models.PlayerState);
    const gameData = useModel(
        state.getEntitiesByModel("depths_of_dread", "GameData").find(entity => entity.models.depths_of_dread.GameData.game_id === playerState?.game_id)?.entityId, 
        Models.GameData
    );

    // useEffect(() => {
    //     console.log("BRRRRRR", );
    // }, [state]);
    return (
        <div className="flex justify-center align-center bg-black min-h-screen w-full p-4 sm:p-8">
            <div className="flex flex-col justify-between w-2/4 bg-slate-500">
                <div className="flex flex-row justify-between align-center">
                    <h1 className="">Current player: {playerData?.username}</h1>
                </div>
                <div className="flex flex-row justify-evenly align-center">
                    <button
                        className="bg-white"
                        onClick={async () => await createPlayer("papa noel")}
                    >
                        Create player
                    </button>
                    {playerData && (
                        <button className="bg-white" onClick={
                            async () => await client.actions.createGame({ account: account.account })
                        }>
                            Create game
                        </button>
                    )}
                </div>
                <div className="h-3/4">
                    <h1>Current Game ID: {gameData?.game_id}</h1>
                    <br />
                    <br />
                    <br />
                    <h1>Position: X: {playerState?.position.x} Y: {playerState?.position.y}</h1>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                    <div className="grid grid-cols-3 gap-2 w-full h-48">
                        {[
                            {
                                direction: "Up" as const,
                                label: "↑",
                                col: "col-start-2",
                            },
                            {
                                direction: "Left" as const,
                                label: "←",
                                col: "col-start-1",
                            },
                            {
                                direction: "Right" as const,
                                label: "→",
                                col: "col-start-3",
                            },
                            {
                                direction: "Down" as const,
                                label: "↓",
                                col: "col-start-2",
                            },
                        ].map(({ direction, label, col }) => (
                            <button
                                className={`${col} justify-self-center  h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                                key={direction}
                                onClick={async () => {
                                    await client.actions.move({
                                        account: account.account,
                                        direction: { type: direction },
                                    });
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                

            </div>

        </div>
    );
}

export default App;
