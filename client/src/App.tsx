import { useEffect, useState, useMemo, FunctionComponent } from "react";
import { SDK, createDojoStore, SchemaType } from "@dojoengine/sdk";
import { DepthsOfDreadSchemaType, PlayerData, PlayerState, GameData, GameFloor, GameObstacles, GameCoins } from "./bindings/models.gen.ts";
import { useDojo } from "./useDojo.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";
import MainScreen from "./components/MainScreen.tsx";
import LeaderboardScreen from "./components/LeaderboardScreen.tsx";
import GameScreen from "./components/GameScreen.tsx";
import Loader from "./components/Loader.tsx";
import { useController } from "./ControllerProvider.tsx";
import fetchPlayerEntity from "./fetch/fetchPlayerEntity.tsx";
import fetchGameEntity from "./fetch/fetchGameEntity.tsx";
import subscribePlayerEntity from "./fetch/subscribePlayerEntity.tsx";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import useModel from "./useModel.tsx";
import subscribeGameEntity from "./fetch/subscribeGameEntity.tsx";
import { subscribeGame, subscribePlayer } from "./queries/queries.ts";


export const useDojoStore = createDojoStore<DepthsOfDreadSchemaType>();

type AppProps = {
    sdk: SDK<DepthsOfDreadSchemaType>
}

const App: FunctionComponent<AppProps> = ({ sdk }) => {
    const { controller, account, username } = useController();
    const {
        setup: { client },
    } = useDojo();
    const state = useDojoStore(state => state);
    const entities = useDojoStore(state => state.entities);

    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState("MainScreen");

    const navigateTo = (view: string) => {
        setCurrentView(view);
    };

    const setLoading = (enabled: bool) => {
        setIsLoading(enabled);
    }

    const playerEntityId = useMemo(
        () => getEntityIdFromKeys([BigInt(controller?.account?.address || 0)]),
        [controller?.account?.address]
    );

    useEffect(() => {
        console.log('address changed', controller?.account?.address);
        if (controller?.account?.address) {
            console.log('fetching player', controller.account.address);
            fetchPlayerEntity(sdk, controller.account.address).then(playerEntity => {
                console.log('got player', playerEntity);
                if (playerEntity) {
                    state.setEntities(playerEntity);
                }
            });
        }
    }, [sdk, controller?.account?.address]);

    useEffect(() => {
        if (!controller?.account?.address) return

        let unsubscribePlayerEntity: (() => void) | undefined;
        const subscribePlayerEntity = async () => {
            console.log("Setting up player subscription");
            const subscription = await sdk.subscribeEntityQuery(
                subscribePlayer(controller.account.address),
                (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error);
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log("SUBSCRIBE PLAYER", response.data);
                        state.updateEntity(response.data[0]);
                    }
                },
                { logging: false }
            );
            unsubscribePlayerEntity = () => subscription.cancel();
        };

        subscribePlayerEntity();
        return () => {
            if (unsubscribePlayerEntity) {
                unsubscribePlayerEntity();
            }
        };
    }, [sdk, controller?.account?.address]);
    
    useEffect(() => {
        if (playerState && playerState.game_id) {
            fetchGameEntity(sdk, playerState.game_id).then(gameEntity => {
                if (gameEntity) {
                    state.setEntities(gameEntity);
                }
            });
        }
    }, [sdk, playerState]);

    useEffect(() => {
        if (!playerState?.game_id) return

        let unsubscribeGameEntity: (() => void) | undefined;
        const subscribeGameEntity = async () => {
            console.log("Setting up game subscription");
            const subscription = await sdk.subscribeEntityQuery(
                subscribeGame(playerState.game_id),
                (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error);
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log("SUBSCRIBE GAME", response.data);
                        state.updateEntity(response.data[0]);
                    }
                },
                { logging: false }
            );
            unsubscribeGameEntity = () => subscription.cancel();
        };

        subscribeGameEntity();
        return () => {
            if (unsubscribeGameEntity) {
                unsubscribeGameEntity();
            }
        };
    }, [sdk, playerState]);

    useEffect(() => {
        if (playerState && playerState.game_id) {
            subscribeGameEntity(sdk, playerState.game_id).then(gameEntity => {
                if (gameEntity) {
                    state.updateEntity(gameEntity);
                }
            });
        }
    }, [sdk, playerState]);

    useEffect(() => {
        if (playerState && playerState.game_id != 0) {
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

    useEffect(() => {
        console.log("dojo state change", state.getEntity(playerEntityId));
        setPlayerData(state.getEntity(playerEntityId)?.models.depths_of_dread.PlayerData);
        setPlayerState(state.getEntity(playerEntityId)?.models.depths_of_dread.PlayerState);
    }, [state]);

    useEffect(() => {
        console.log("App Screen State:");
        console.log("  playerData:", playerData);
        console.log("  playerState:", playerState);
    }, [playerData, playerState]);

    return (
        <div className="flex justify-center align-center bg-black min-h-screen w-full p-0">
            <div className="flex flex-col w-full md:w-2/5">
                {currentView === "GameScreen" && (
                    <GameScreen
                        client={client}
                        navigateTo={navigateTo}
                        setLoading={setLoading}
                        sdk={sdk}
                    />
                )}
                {currentView === "MainScreen" && (
                    <MainScreen
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
