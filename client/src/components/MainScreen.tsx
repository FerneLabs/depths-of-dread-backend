import { FunctionComponent, useState } from 'react';
import bgMainscreen from '../assets/main_bg.png';
import { useSystemCalls } from "../useSystemCalls.ts";
import { PlayerData } from '../bindings/models.ts';

type MainScreenProps = {
    playerData: PlayerData | null
}

const MainScreen: FunctionComponent<MainScreenProps> = ({ playerData }) => {
    const [sound, setSound] = useState(localStorage.getItem("sound") || "true");
    const { createPlayer, createGame } = useSystemCalls();

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
        if (!playerData) {
            console.log('creating player');
            await createPlayer("pepe").catch(e => console.log(e));
        }
        console.log('creating game');
        await createGame().catch(e => console.log(e));
    }

    return (
        <div 
            className={`flex flex-col w-full h-full p-4 bg-cover`}
            style={{backgroundImage: `url(${bgMainscreen})`}}
        > 
            <div className="flex justify-end">
                <div
                    className="select-none cursor-pointer primary grenze" 
                    onClick={() => toggleSound()}
                >
                    sound {sound === "true" ? "on" : "off"}
                </div>
            </div>
            <div className="flex flex-col h-full items-center justify-evenly">
                <div className="flex flex-col items-center text-center">
                    <h1 className='primary grenze'>Depths</h1>
                    <h1 className='primary grenze'>Of</h1>
                    <h1 className='primary grenze'>DreaD</h1>
                </div>
                <div className="flex">
                    <button 
                        className="bg-black rounded-md primary py-4 px-8 text-3xl grenze"
                        onClick={() => handlePlay()}
                    >
                        play
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MainScreen;