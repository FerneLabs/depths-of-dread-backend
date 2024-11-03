import React, { useEffect, useState } from "react";
import "/assets/styles/Player.css"; // Import CSS for animation styling
import { Vec2 } from "../bindings/models.gen";

type PlayerProps = {
    position: Vec2;
    spriteSheet: string; // Path to the PNG sprite sheet
    frameCount: number;   // Number of frames in the animation
    frameWidth: number;   // Width of each frame in pixels
    frameHeight: number;  // Height of each frame in pixels
};

const Player: React.FC<PlayerProps> = ({ position, spriteSheet, frameCount, frameWidth, frameHeight }) => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prevFrame) => (prevFrame + 1) % frameCount);
        }, 100);

        return () => clearInterval(interval);
    }, [frameCount]);

    return (
        <div
            className="player"
            style={{
                backgroundImage: `url(${spriteSheet})`,
                backgroundPosition: `-${frame * frameWidth}px 0px`,
                width: `${frameWidth}px`,
                height: `${frameHeight}px`,
                transform: `translate(${position.x * frameWidth}px, ${position.y * frameHeight}px)`,
            }}
        />
    );
};

export default Player;
