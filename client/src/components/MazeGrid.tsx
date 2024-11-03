import React, { useEffect } from "react";

type Position = { x: number; y: number };

const initialPath: Position[] = [
    //TODO Get the path from dojo
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
];

const TILE_SIZE = 48; // Size of each tile in pixels

const MazeGrid: React.FC<{ position: Position | null }> = ({ position }) => {
    useEffect(() => {
        console.log("Current Player Position:", position);
    }, [position]);

    return (
        <div
            className="grid grid-cols-[repeat(5,7vh)] grid-rows-[repeat(8,7vh)] gap-0 justify-center content-center bg-black/90 h-full w-full"
        >
            {[...Array(8)].map((_, rowIndex) => (
                [...Array(5)].map((_, colIndex) => {
                    const actualRowIndex = 7 - rowIndex;

                    const isPath = initialPath.some(
                        (path) => path.x === colIndex && path.y === actualRowIndex
                    );
                    const isPlayerPosition =
                        position?.x === colIndex && position?.y === actualRowIndex;
                    
                    return (
                        <div
                            key={`${actualRowIndex}-${colIndex}`}
                            style={{
                                backgroundColor: isPlayerPosition
                                    ? "blue" 
                                    : isPath
                                    ? "lightgreen" 
                                    : "gray", 
                                border: "1px solid black",
                                boxSizing: "border-box",
                                backgroundSize: "cover",
                                backgroundImage: isPlayerPosition
                                    ? 'url("/assets/player.png")'
                                    : isPath
                                    ? 'url("/path/to/path-tile.png")'
                                    : 'url("/assets/tiles/ground.png")',
                            }}
                        />
                    );
                })
            ))}
        </div>
    );
};

export default MazeGrid;
