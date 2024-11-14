import { FunctionComponent, useState, useEffect } from "react";
import bgMainscreen from '../assets/main_bg.png';
import { queryGames, queryPlayerData } from "../queries/queries";
import { DepthsOfDreadSchemaType, GameData } from "../bindings/models.gen";
import { feltToString } from "../utils/feltService.ts";
import { secondsToTime } from "../utils/timeService.ts";

type LeaderboardScreenProps = {
    navigateTo: (view: string) => void;
    setLoading: (enable: bool) => void;
    sdk: SDK<DepthsOfDreadSchemaType>;
};

type LeaderboardItemProps = {
    position: number;
    playerAddress: string;
    score: number;
    runTime: string;
    sdk: SDK<DepthsOfDreadSchemaType>;
    setLoading: (enable: bool) => void;
};

const LeaderboardItem: FunctionComponent<LeaderboardItemProps> = ({ position, playerAddress, score, runTime, sdk, setLoading }) => {
    const [username, setUsername] = useState("loading...");

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                await sdk.getEntities(
                    queryPlayerData(playerAddress),
                    (resp) => {
                        if (resp.error) {
                            console.error("resp.error.message:", resp.error.message);
                            return;
                        }
                        if (resp?.data[0]?.models?.depths_of_dread?.PlayerData) {
                            const formattedUsername = feltToString(resp.data[0].models.depths_of_dread.PlayerData.username);
                            setUsername(formattedUsername);
                        }
                    }
                );
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchPlayer();
    }, []);

    return(
        <div className="flex justify-between w-full bg-black/50 my-1 p-3 primary text-xl">
            <div className="flex">
                <p className="mr-2">#{position}</p>
                <p>{username}</p>
            </div>
            <div className="flex self-end justify-between w-[30%] primary">
                <p>{score}</p>
                <p>{runTime}</p>
            </div>
        </div>
    );
};

const LeaderboardScreen: FunctionComponent<LeaderboardScreenProps> = ({ navigateTo, setLoading, sdk }) => {
    const [sound, setSound] = useState(localStorage.getItem("sound") || "true");
    const [games, setGames] = useState<GameData[]>([]);

    const toggleSound = () => {
        if (sound === 'true') {
            localStorage.setItem("sound", "false");
            setSound("false");
        } else {
            localStorage.setItem("sound", "true");
            setSound("true");
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchGames = async () => {
            try {
                await sdk.getEntities(
                    queryGames(),
                    (resp) => {
                        if (resp.error) {
                            console.error("resp.error.message:", resp.error.message);
                            return;
                        }
                        if (resp.data && resp.data.length > 0) {
                            console.log("FETCH", resp.data);
                            let gameDatas: GameData[] = [];
                            resp.data.forEach(entity => {
                                const gameData = entity?.models?.depths_of_dread?.GameData;
                                if (gameData) {
                                    gameDatas.push(gameData);
                                }
                            });
                            setGames(gameDatas.sort((a, b) => b.total_score - a.total_score));
                        }
                    }
                );
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        try {
            fetchGames().then(() => setLoading(false));
        } catch (err) {
            console.log(err);
        }
    }, [])

    return (
        <div 
            className={`flex flex-col w-full h-full p-4 bg-cover grenze`}
            style={{backgroundImage: `url(${bgMainscreen})`}}
            id="leaderboard"
        > 
            <div className="flex justify-between items-center">
                <div
                    className="select-none cursor-pointer primary grenze text-xl" 
                    onClick={() => navigateTo('MainScreen')}
                >
                    go back
                </div>
                <div
                    className="select-none cursor-pointer primary grenze ml-3 text-3xl" 
                >
                    Leaderboard
                </div>
                <div
                    className="select-none cursor-pointer primary grenze text-xl" 
                    onClick={() => toggleSound()}
                >
                    sound {sound === "true" ? "on" : "off"}
                </div>
            </div>
            <div className="flex flex-col h-full items-center mt-8">
                <div className="flex self-end justify-between w-1/3 primary">
                    <div>Score</div>
                    <div className="mr-2">Run time</div>
                </div>
                <div className="w-full max-h-[80vh] pr-1 overflow-y-scroll">
                    {games?.map((game, index) => (
                        <LeaderboardItem 
                            key={game.game_id}
                            position={index + 1}
                            playerAddress={game.player} 
                            score={game.total_score} 
                            runTime={secondsToTime(game.end_time - game.start_time)}
                            sdk={sdk}
                            setLoading={setLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LeaderboardScreen;