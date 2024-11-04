import React, { useEffect } from "react";
import { PlayerState, GameCoins, GameFloor, Vec2 } from "../bindings/models.gen";

const groundTiles = [
    'url("/assets/tiles/ground/tile.png")',
    'url("/assets/tiles/ground/tile2.png")',
    'url("/assets/tiles/ground/tile3.png")',
    'url("/assets/tiles/ground/tile4.png")',
    'url("/assets/tiles/ground/tile5.png")',
    'url("/assets/tiles/ground/tile6.png")',
    'url("/assets/tiles/ground/tile7.png")'
];

type MazeGridProps = {
    playerState: PlayerState,
    gameFloor: GameFloor,
    gameCoins: GameCoins
}

const MazeGrid: FunctionComponent<MazeGridProps> = ({ playerState, gameFloor, gameCoins }) => {
    const gridCols = "7vh ".repeat(gameFloor?.size.x + 1);
    const gridRows = "7vh ".repeat(gameFloor?.size.y + 1);
    const randomNumber = Math.floor(Math.random() * 7);

    useEffect(() => {
        console.log("GRID EFFECT", playerState, gameFloor, gameCoins);
    }, [playerState, gameFloor, gameCoins]);
    return (
        <div
            className={`grid gap-0 justify-center content-center bg-black/90 h-full w-full`}
            style={{ gridTemplateRows: gridRows, gridTemplateColumns: gridCols }}
        >
            {[...Array(gameFloor?.size.y + 1)].map((_, rowIndex) => (
                [...Array(gameFloor?.size.x + 1)].map((_, colIndex) => {
                    const actualRowIndex = gameFloor?.size.y - rowIndex;

                    let isCoin = false;
                    gameCoins?.coins.forEach(coin => {
                        if (coin.x === colIndex && coin.y === actualRowIndex) {
                            console.log("COIN", coin.x, coin.y, colIndex, actualRowIndex);
                            isCoin = true;
                        }
                    });

                    // const isCoin = gameCoins.coins.map(coin => coin.x === colIndex && coin.y === rowIndex);
                    let isPlayerPosition = false;
                    if (playerState?.position.x === colIndex 
                        && playerState?.position.y === actualRowIndex
                    ) {
                        console.log("PLAYER", playerState.position, colIndex, actualRowIndex);
                        isPlayerPosition = true;
                    }
                    

                    let bg = "";
                    if (isPlayerPosition) {
                        bg = 'url("/assets/player3.png")';
                    } else if (isCoin) {
                        bg = 'url("/assets/tiles/coin.png")';
                    } else {
                        bg = groundTiles[randomNumber];
                    }

                    return (
                        <div
                            key={`${actualRowIndex}-${colIndex}`}
                            style={{
                                backgroundColor: isPlayerPosition
                                    ? "blue"
                                    : isCoin
                                        ? "lightgreen"
                                        : "gray",
                                border: "1px solid black",
                                boxSizing: "border-box",
                                backgroundSize: "cover",
                                backgroundImage: bg
                            }}
                        ></div>
                    );
                })
            ))}
        </div>
    );
};

export default MazeGrid;
