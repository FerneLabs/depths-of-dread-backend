import { FunctionComponent, useState } from 'react';
import bgMainscreen from '../assets/main_bg.png';
import { useSystemCalls } from "../useSystemCalls.ts";
import { ConnectWallet } from "./ConnectWallet.tsx";
import { PlayerData } from '../bindings/models.gen.ts';
import { useController } from '../ControllerProvider.tsx';

type MainScreenProps = {
    playerData: PlayerData | null;
    navigateTo: (view: string) => void;
    setLoading: (bool) => void;
}

const MainScreen: FunctionComponent<MainScreenProps> = ({ playerData, navigateTo, setLoading }) => {
    const [sound, setSound] = useState(localStorage.getItem("sound") || "true");
    const { createPlayer, createGame } = useSystemCalls();
    const { controller } = useController();

    const toggleSound = () => {
        if (sound === 'true') {
            localStorage.setItem("sound", "false");
            setSound("false");
        } else {
            localStorage.setItem("sound", "true");
            setSound("true");
        }
    };

    const handlePlay =  async () => {
        setLoading(true);
        if (!playerData) {
            const username = await controller.username(); 
            console.log('creating player', username);
            await createPlayer(username).catch(e => console.log(e));
        }
        console.log('creating game');
        await createGame().catch(e => console.log(e));
    }

    return (
        <div 
            className={`flex flex-col w-full h-full p-4 bg-cover`}
            style={{backgroundImage: `url(${bgMainscreen})`}}
            id="mainscreen"
        > 
            <div className="flex justify-between">
                <div
                    className="select-none cursor-pointer primary grenze text-xl" 
                    onClick={() => toggleSound()}
                >
                    sound {sound === "true" ? "on" : "off"}
                </div>
                <ConnectWallet />
            </div>
            <div className="flex flex-col h-full items-center justify-evenly">
                <div className="flex flex-col items-center text-center">
                    <h1 className='primary grenze'>Depths</h1>
                    <h1 className='primary grenze'>Of</h1>
                    <h1 className='primary grenze'>DreaD</h1>
                </div>
                <div className="flex flex-col">
                    <button 
                        className="bg-black rounded-md primary mb-2 py-4 px-8 text-3xl grenze"
                        onClick={() => handlePlay()}
                    >
                        play
                    </button>
                    <button 
                        className="bg-black rounded-md primary py-4 px-8 text-3xl grenze"
                        onClick={() => navigateTo('LeaderboardScreen')}
                    >
                        leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MainScreen;