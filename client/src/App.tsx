import { useEffect, useState, useMemo, FunctionComponent } from "react";
import { SDK, createDojoStore, SchemaType } from "@dojoengine/sdk";
import { DepthsOfDreadSchemaType, PlayerData, PlayerState, GameData, GameFloor, GameObstacles, GameCoins } from "./bindings/models.gen.ts";
import { useDojo } from "./useDojo.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";
import { queryEntities, subscribeEntity, subscribeEvent } from "./queries/queries.ts";
import MainScreen from "./components/MainScreen.tsx";
import LeaderboardScreen from "./components/LeaderboardScreen.tsx";
import GameScreen from "./components/GameScreen.tsx";
import Loader from "./components/Loader.tsx";


export const useDojoStore = createDojoStore<DepthsOfDreadSchemaType>();

type AppProps = {
    sdk: SDK<DepthsOfDreadSchemaType>
}

const App: FunctionComponent<AppProps> = ({ sdk }) => {
    const {
        account,
        setup: { client },
    } = useDojo();
    const state = useDojoStore((state) => state);

    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [gameFloor, setGameFloor] = useState<GameFloor | null>(null);
    const [gameObstacles, setGameObstacles] = useState<GameObstacles | null>(null);
    const [gameCoins, setGameCoins] = useState<GameCoins | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState("MainScreen");
    const [gameOver, setGameOver] = useState(false);

    const navigateTo = (view: string) => {
        setCurrentView(view);
    };

    const setLoading = (enabled: bool) => {
        setIsLoading(enabled);
    }

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
                    if (resp.data && resp.data.length > 0) {
                        // Update state
                        // TODO: Maybe store state for whole entity instead of individual models?
                        console.log("FETCH ENTITTIES", resp.data);

                        const playerData = resp.data.find(entity => entity.models.depths_of_dread?.PlayerData);
                        const playerState = resp.data.find(entity => entity.models.depths_of_dread?.PlayerState);

                        // TODO: after game over is created in backed, add a predicate in the find expression
                        // to get only the currently active game (gameData.isActive), games should be set as inactive when finished.
                        const gameData = resp.data.find(entity => 
                            entity.models.depths_of_dread?.GameData 
                            && entity.models.depths_of_dread?.GameData.end_time === "0x0"
                        );
                        console.log(gameData);
                        const gameFloor = resp.data.find(entity => 
                            entity.models.depths_of_dread?.GameFloor
                            && entity.models.depths_of_dread?.GameFloor.game_id === gameData.models.depths_of_dread.GameData.game_id
                        );
                        const gameObstacles = resp.data.find(entity => 
                            entity.models.depths_of_dread?.gameObstacles
                            && entity.models.depths_of_dread?.gameObstacles.game_id === gameData.models.depths_of_dread.GameData.game_id
                        );
                        const gameCoins = resp.data.find(entity => 
                            entity.models.depths_of_dread?.gameCoins
                            && entity.models.depths_of_dread?.gameCoins.game_id === gameData.models.depths_of_dread.GameData.game_id
                        );

                        setPlayerData(playerData?.models.depths_of_dread.PlayerData || null);
                        setPlayerState(playerState?.models.depths_of_dread.PlayerState || null);
                        setGameData(gameData?.models.depths_of_dread.GameData || null);
                        setGameFloor(gameFloor?.models.depths_of_dread.GameFloor || null);
                        setGameObstacles(gameObstacles?.models.depths_of_dread.GameObstacles || null);
                        setGameCoins(gameCoins?.models.depths_of_dread.GameCoins || null);
                    }
                }
            );
        } catch (error) {
            console.error("Error querying entities:", error);
        }
    };

    // Fetch and update player and game data
    useEffect(() => {
        console.log("FETCHING FROM USE EFFECT");
        fetchEntities();
    }, [sdk, account?.account.address]);

    // Subscribe to entity updates
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const subscription = await sdk.subscribeEntityQuery(
                subscribeEntity(account.account.address, playerState?.game_id),
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
                        console.log("SUBSCRIBE", response.data);
                        // Update state with incoming data
                        response.data.forEach((entity) => {
                            const model = entity.models.depths_of_dread;
                            if (model?.PlayerData) {
                                setPlayerData(model.PlayerData);
                            } else if (model?.PlayerState) {
                                setPlayerState(model.PlayerState);
                            } else if (model?.GameData && model?.GameData.end_time === "0x0") {
                                setGameData(model.GameData);
                            } else if (model?.GameFloor) {
                                setGameFloor(model.GameFloor);
                            } else if (model?.GameCoins) {
                                setGameCoins(model.GameCoins);
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

    // // Suscribe to events
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const subscription = await sdk.subscribeEventQuery(
                subscribeEvent(account.account.address),
                async (response) => {
                    if (response.error) {
                        console.error(
                            "Error setting up event sync:",
                            response.error
                        );
                    } else if (
                        response.data &&
                        response.data[0].entityId !== "0x0"
                    ) {
                        // Update state with incoming data
                        const event = response.data[0].models.depths_of_dread;
                        console.log("EVENT", response.data[0]);
                        console.log("game over? ", event.ObstacleFound, event.ObstacleFound?.defended === false)
                        if (event.GameCreated) {
                            setGameOver(false);
                        }
                        if (event.ObstacleFound && event.ObstacleFound.defended === false) {
                            console.log("GAME OVER");
                            setGameOver(true);
                        }
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
        console.log(gameFloor);
        console.log(gameCoins);
    }, [playerData, playerState, gameData, gameFloor, gameCoins]);

    useEffect(() => {
        console.log("USE EFFECT", playerData, playerState);
        if (playerData && playerData.username && playerState && playerState.game_id != 0) {
            setCurrentView("GameScreen");
        }
    }, [playerState]);

    useEffect(() => {
        setLoading(true);
  
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
  
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex justify-center align-center bg-black min-h-screen w-full p-0">
            <div className="flex flex-col w-full md:w-2/5">
                { currentView === "GameScreen" && (
                    <GameScreen 
                        playerData={playerData} 
                        playerState={playerState} 
                        gameData={gameData}
                        gameFloor={gameFloor}
                        gameCoins={gameCoins}
                        account={account}
                        client={client}
                        navigateTo={navigateTo}
                        setLoading={setLoading}
                        gameOver={gameOver}
                        sdk={sdk}
                    />
                )}
                {currentView === "MainScreen" && (
                    <MainScreen 
                        playerData={playerData} 
                        navigateTo={navigateTo} 
                        setLoading={setLoading} 
                    />
                )}
                {currentView === "LeaderboardScreen" && (
                    <LeaderboardScreen 
                        navigateTo={navigateTo} 
                        setLoading={setLoading}
                        sdk={sdk}
                    />
                )}
            </div>
            {isLoading && (
                <Loader loadingMessage="" />
            )}
        </div>
    );
}

export default App;
