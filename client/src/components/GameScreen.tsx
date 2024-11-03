import { FunctionComponent, useState, useEffect } from "react";
import { PlayerData, PlayerState } from "../bindings/models.gen.ts";
import Controls from "./Controls.tsx";
import MazeGrid from "./MazeGrid.tsx";
import { useSystemCalls } from "../useSystemCalls.ts";
import { client } from "../bindings/contracts.gen";
import { BurnerAccount } from "@dojoengine/create-burner";
import { feltToString } from "../utils/feltService.ts";
import bgGame from "../assets/game_bg2.png";
import Loader from "./Loader.tsx";

type GameScreenProps = {
    playerData: PlayerData,
    playerState: PlayerState,
    gameData: GameData,
    account: BurnerAccount,
    client: ReturnType<typeof client>
}

type ConfirmationModalProps = {
    closeModal: () => void;
};

const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = ({ closeModal }) => {
    const { endGame } = useSystemCalls();
    return (
        <div className="flex flex-col justify-center items-center fixed inset-x-0 w-full h-full text-3xl bg-black/75 grenze">
            <p className="text-center m-4">Are you sure you want to end the game?</p>
            <div className="flex justify-evenly">
                <button
                    className="rounded-md bg-[#131519] primary py-4 px-8 text-3xl m-2"
                    onClick={closeModal}
                >
                    keep playing</button>
                <button
                    className="bg-red-800 text-white rounded-md py-4 px-8 text-3xl m-2"
                    onClick={async () => await endGame()}
                >
                    end game</button>
            </div>
        </div>
    );
}

const GameScreen: FunctionComponent<GameScreenProps> = ({ playerData, playerState, gameData, account, client }) => {
    const [modal, setModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    
        const timer = setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
    
        return () => clearTimeout(timer);
      }, []);
    
      if (!isLoaded) {
        const message = "";
        return <Loader loadingMessage={message} />;
      }

    return (
        <div
            className="flex flex-col justify-between w-full h-full bg-contain bg-repeat-round primary nova"
            style={{ backgroundImage: `url(${bgGame})` }}
        >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between align-center bg-black/50 p-4">
                    <p className="content-center">{feltToString(playerData.username)}</p>
                    <button
                        className="bg-red-800/75 text-white rounded-md p-2"
                        onClick={() => setModal(true)}
                    >
                        exit game
                    </button>
                </div>
                <div className="flex flex-row justify-between align-center bg-black/75 py-2 px-4">
                    <p>Floor: {playerState.current_floor}</p>
                    <p>Coins: {playerState.coins}</p>
                </div>
            </div>
            <MazeGrid position={playerState.position} />
            <Controls account={account} client={client} />
            {modal && (
                <ConfirmationModal closeModal={() => setModal(false)} />
            )}
        </div>
    );
};

export default GameScreen;