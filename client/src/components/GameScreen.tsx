import React, { FunctionComponent, useState, useEffect, useMemo } from "react";
import { Direction, GameCoins, GameData, GameFloor, PlayerData, PlayerState } from "../bindings/models.gen.ts";
import Controls from "./Controls.tsx";
import MazeGrid from "./MazeGrid.tsx";
import { useSystemCalls } from "../useSystemCalls.ts";
import { client } from "../bindings/contracts.gen";
import { BurnerAccount } from "@dojoengine/create-burner";
import { feltToString } from "../utils/feltService.ts";
import bgGame from "../assets/game_bg2.png";
import { queryGameData } from "../queries/queries.ts";
import { secondsToTime } from "../utils/timeService.ts";
import { AccountInterface } from "starknet";
import { useDojoStore } from "../App.tsx";
import { useController } from "../ControllerProvider.tsx";
import { getEntityIdFromKeys } from "@dojoengine/utils";

type GameScreenProps = {
    gameOver: boolean;
    client: ReturnType<typeof client>;
    navigateTo: (view: string) => void;
    setLoading: (bool) => void;
    sdk: SDK<DepthsOfDreadSchemaType>;
}

type HintModalProps = {
    closeModal: () => void;
    gameFloor: GameFloor;
};

type ConfirmationModalProps = {
    closeModal: () => void;
    navigateTo: (view: string) => void;
    setLoading: (bool) => void;
};

type FloorClearedModalProps = {
    floorCleared: number;
    incrementFloor: () => void;
    closeModal: () => void;
    showHint: () => void;
    setLoading: (bool) => void;
    navigateTo: (view: string) => void;
};

type GameOverModalProps = {
    navigateTo: (view: string) => void;
    gameID: number;
    sdk: SDK<DepthsOfDreadSchemaType>;
};

const HintModal: FunctionComponent<HintModalProps> = ({ closeModal, gameFloor }) => {
    return (
        <div className="flex flex-col justify-center items-center fixed inset-x-0 w-full h-full text-3xl bg-black/75 grenze">
            <p className="text-center m-4">Here you have a hint to clear this floor...</p>
            <div className="flex justify-center items-center">
                {gameFloor.path.map(
                    (direction, index) => <div key={index}> {direction.toString().charAt(0).toLocaleLowerCase()} </div>
                )}
            </div>
            <div className="flex justify-center">
                <button
                    className="rounded-md bg-[#131519] primary py-4 px-8 text-3xl m-2"
                    onClick={() => closeModal() }
                >
                    start floor
                </button>
            </div>
        </div>
    );
}

const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = ({ closeModal, navigateTo, setLoading }) => {
    const { endGame } = useSystemCalls();
    return (
        <div className="flex flex-col justify-center items-center fixed inset-x-0 w-full h-full text-3xl bg-black/75 grenze">
            <p className="text-center m-4">Are you sure you want to end the game?</p>
            <div className="flex justify-evenly">
                <button
                    className="rounded-md bg-[#131519] primary py-4 px-8 text-3xl m-2"
                    onClick={closeModal}
                >
                    keep playing
                </button>
                <button
                    className="bg-red-800 text-white rounded-md py-4 px-8 text-3xl m-2"
                    onClick={async () => {
                        setLoading(true);
                        const transaction = await endGame();
                        setLoading(false);
                        navigateTo("MainScreen");
                    }}
                >
                    end game
                </button>
            </div>
        </div>
    );
}

const FloorClearedModal: FunctionComponent<FloorClearedModalProps> = ({ closeModal, incrementFloor, setLoading, showHint, floorCleared, navigateTo }) => {
    const { endGame } = useSystemCalls();
    const isGameOver = floorCleared === 6;
    return (
        <div className="flex flex-col justify-center items-center fixed inset-x-0 w-full h-full text-3xl bg-black/75 grenze">
            <p className="text-center m-4">Floor #{floorCleared} Cleared!</p>
            {isGameOver && (
                <p className="text-center m-4">There are no more floors ahead. Thanks for playing!</p>
            )}
            <div className="flex justify-center">
                <button
                    className="rounded-md bg-[#131519] primary py-4 px-8 text-3xl m-2"
                    onClick={async () => {
                        incrementFloor()
                        closeModal()
                        showHint()
                        if (isGameOver) {
                            setLoading(true);
                            const transaction = await endGame();
                            setLoading(false);
                            navigateTo("MainScreen");
                        }
                    }}
                >
                    {isGameOver ? "main menu" : "next floor"}
                </button>
            </div>
        </div>
    );
}

const GameOverModal: FunctionComponent<GameOverModalProps> = ({ navigateTo, gameID, sdk }) => {
    const { endGame } = useSystemCalls();
    const [gameData, setGameData] = useState();

    const fetchGameData = async () => {
        try {
            await sdk.getEntities(
                queryGameData(gameID),
                (resp) => {
                    if (resp.error) {
                        console.error("resp.error.message:", resp.error.message);
                        return;
                    }
                    if (resp.data && resp.data.length > 0) {
                        console.log("FETCH", resp.data[0].models.depths_of_dread.GameData);
                        setGameData(resp.data[0].models.depths_of_dread.GameData);
                    }
                }
            );
        } catch (error) {
            console.error("Error querying entities:", error);
        }
    };

    useEffect(() => {
        fetchGameData();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center fixed inset-x-0 w-full h-full text-3xl bg-black/75 grenze">
            <p className="text-center m-4">A trap has taken your life...</p>
            <p className="text-center m-1">Floor reached: {gameData?.floor_reached}</p>
            <p className="text-center m-1">Score: {gameData?.total_score}</p>
            {gameData && (
                <p className="text-center m-1">Time played: {secondsToTime(gameData.end_time - gameData.start_time)}</p>
            )}
            
            <div className="flex justify-center">
                <button
                    className="rounded-md bg-[#131519] primary py-4 px-8 text-3xl m-2"
                    onClick={async () => {
                        navigateTo("MainScreen");
                    }}
                >
                    main menu
                </button>
            </div>
        </div>
    );
}

const GameScreen: FunctionComponent<GameScreenProps> = ({ 
    account, 
    client, 
    navigateTo, 
    setLoading, 
    sdk 
}) => {
    const state = useDojoStore((state) => state);
    const entities = useDojoStore((state) => state.entities);
    const { controller, username } = useController();

    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [gameFloor, setGameFloor] = useState<GameFloor | null>(null);
    const [gameCoins, setGameCoins] = useState<GameCoins | null>(null);
    const [gameOver, setGameOver] = useState<bool>(false);

    const [modal, setModal] = useState(false);
    const [hint, setHint] = useState(true);
    const [tiles, setTiles] = useState(true);
    const [currentFloor, setCurrentFloor] = useState(1);

    const playerEntityId = useMemo(
        () => getEntityIdFromKeys([BigInt(controller?.account?.address || 0)]),
        [controller?.account?.address]
    );
    const gameEntityId = useMemo(() => getEntityIdFromKeys([BigInt(playerState?.game_id || 0)]), [playerState]);

    const setStates = () => {
        setPlayerData(state.getEntity(playerEntityId)?.models.depths_of_dread.PlayerData);
        setPlayerState(state.getEntity(playerEntityId)?.models.depths_of_dread.PlayerState);
        setGameData(state.getEntity(gameEntityId)?.models.depths_of_dread.GameData);
        setGameFloor(state.getEntity(gameEntityId)?.models.depths_of_dread.GameFloor);
        setGameCoins(state.getEntity(gameEntityId)?.models.depths_of_dread.GameCoins);
    };

    useEffect(() => {
        setStates();
    }, [entities]);

    useEffect(() => {
        console.log("Game Screen State:");
        console.log("  playerState:", playerState);
        console.log("  gameData:", gameData);
        console.log("  gameFloor:", gameFloor);
        console.log("  gameCoins:", gameCoins);
    }, [playerData, playerState, gameData, gameFloor, gameCoins]);

    useEffect(() => {
        if (gameData && gameData.end_time != "0x0") {
            setGameOver(true);
        }
    }, [gameData]);

    const incrementFloor = () => {
        setCurrentFloor(currentFloor + 1);
    };

    const showHint = () => {
        setTiles(true);
        setHint(true);
    };

    useEffect(() => {
        setStates();
        setLoading(false);
    }, []);

    return (
        <div
            className="flex flex-col justify-between w-full h-full bg-contain bg-repeat-round primary nova"
            style={{ backgroundImage: `url(${bgGame})` }}
        >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between align-center bg-black/50 p-4">
                    <p className="content-center">{username || ""}</p>
                    <button
                        className="bg-red-800/75 text-white rounded-md p-2"
                        onClick={() => setModal(true)}
                    >
                        exit game
                    </button>
                </div>
                <div className="flex flex-row justify-between align-center bg-black/75 py-2 px-4">
                    <p>Floor: {currentFloor}</p>
                    <p>Coins: {playerState?.coins}</p>
                </div>
            </div>
            {playerState && gameFloor && gameCoins && (
                <MazeGrid playerState={playerState} gameFloor={gameFloor} gameCoins={gameCoins} newTiles={tiles} />
            )}
            {controller?.account && playerState && gameFloor && (
                <Controls account={controller.account} client={client} playerState={playerState} gameFloor={gameFloor} />
            )}
            {hint && gameFloor && (
                <HintModal 
                    closeModal={() => {setHint(false); setTiles(false); }}
                    gameFloor={gameFloor}
                />
            )}
            {modal && (
                <ConfirmationModal 
                    closeModal={() => setModal(false)} 
                    navigateTo={navigateTo} 
                    setLoading={setLoading}
                />
            )}
            {currentFloor < playerState?.current_floor && (
                <FloorClearedModal 
                    closeModal={() => setModal(false)} 
                    incrementFloor={incrementFloor}
                    showHint={showHint}
                    floorCleared={currentFloor}
                    setLoading={setLoading}
                    navigateTo={navigateTo}
                />
            )}
            {gameOver && (
                <GameOverModal 
                    navigateTo={navigateTo}
                    gameID={gameData?.game_id}
                    sdk={sdk}
                />
            )}
        </div>
    );
};

export default GameScreen;