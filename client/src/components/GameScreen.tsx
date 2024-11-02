import { PlayerData, PlayerState } from "../bindings/models";
import Controls from "./Controls.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";
import { client } from "../bindings/contracts.gen";
import { BurnerAccount } from "@dojoengine/create-burner";
import { feltToString } from "../utils/feltService.ts";
import bgGame from "../assets/game_bg2.png";

type GameScreenProps = {
    playerData: PlayerData,
    playerState: PlayerState,
    gameData: GameData,
    account: BurnerAccount,
    client: ReturnType<typeof client>
}

const GameScreen: FunctionComponent<GameScreenProps> = ({ playerData, playerState, gameData, account, client }) => {
    console.log(playerData.username);
    return (
        <div 
            className="flex flex-col justify-between w-full h-full bg-contain bg-repeat-round primary nova"
            style={{backgroundImage: `url(${bgGame})`}}
        >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between align-center bg-black/50 p-4">
                    <p className="content-center">{feltToString(playerData.username)}</p>
                    <button className="bg-red-800/75 text-white rounded-md p-2">exit game</button>
                </div>
                <div className="flex flex-row justify-between align-center bg-black/75 py-2 px-4">
                    <p>Floor: {playerState.current_floor}</p>
                    <p>Coins: {playerState.coins}</p>
                </div>
            </div>
            <div className="h-full bg-black">

            </div>
            <Controls account={account} client={client} />
        </div>
    );
};

export default GameScreen;