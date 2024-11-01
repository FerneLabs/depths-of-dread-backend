import { useEffect, useState, useMemo, FunctionComponent } from "react";
import { SDK, createDojoStore, SchemaType } from "@dojoengine/sdk";
import { Models } from "./bindings/models.ts";
import { useDojo } from "./useDojo.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";
import { queryEntities, subscribeEntity } from "./queries/queries.ts";
import Controls from "./components/Controls.tsx";

export const useDojoStore = createDojoStore<SchemaType>();

type AppProps = { 
    sdk: SDK<SchemaType>
}

const App: FunctionComponent<AppProps> = ({ sdk }) => {
    const {
        account,
        setup: { client },
    } = useDojo();
    const state = useDojoStore((state) => state);
    const { createPlayer } = useSystemCalls();

    const [playerData, setPlayerData] = useState<Models.PlayerData | null>(null);
    const [playerState, setPlayerState] = useState<Models.PlayerState | null>(null);
    const [gameData, setGameData] = useState<Models.GameData | null>(null);

    // Fetch and update player and game data
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                await sdk.getEntities(
                    queryEntities(account.account.address),
                    (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            // Update state
                            // TODO: Maybe store state for whole entity instead of individual models?

                            const playerDataEntity = resp.data.find(entity => entity.models.depths_of_dread?.PlayerData);
                            const playerStateEntity = resp.data.find(entity => entity.models.depths_of_dread?.PlayerState);
                            
                            // TODO: after game over is created in backed, add a predicate in the find expression
                            // to get only the currently active game (gameData.isActive), games should be set as inactive when finished.
                            const gameDataEntity = resp.data.find(entity => entity.models.depths_of_dread?.GameData); 

                            setPlayerData(playerDataEntity?.models.depths_of_dread.PlayerData || null);
                            setPlayerState(playerStateEntity?.models.depths_of_dread.PlayerState || null);
                            setGameData(gameDataEntity?.models.depths_of_dread.GameData || null);
                        }
                    }
                );
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchEntities();
    }, [sdk, account?.account.address]);

    // Subscribe to entity updates
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const subscription = await sdk.subscribeEntityQuery(
                subscribeEntity(account.account.address),
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
                        // Update state with incoming data
                        response.data.forEach((entity) => {
                            if (entity.models.depths_of_dread?.PlayerData) {
                                setPlayerData(entity.models.depths_of_dread.PlayerData);
                            } else if (entity.models.depths_of_dread?.PlayerState) {
                                setPlayerState(entity.models.depths_of_dread.PlayerState);
                            } else if (entity.models.depths_of_dread?.GameData) {
                                setGameData(entity.models.depths_of_dread.GameData);
                            }
                        });
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
        console.log("Updated state");
        console.log(playerData);
        console.log(playerState);
        console.log(gameData);
    }, [playerData, playerState, gameData]);

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
                <Controls account={account} client={client} />
            </div>
        </div>
    );
}

export default App;
