import { client } from "../bindings/contracts.gen";
import { FunctionComponent, useEffect, useState } from "react";
import { Direction, GameFloor, PlayerState, Vec2 } from "../bindings/models.gen";
import { AccountInterface } from "starknet";
import { useSystemCalls } from "../useSystemCalls";
import loaderIcon from '../assets/loader-icon.png';

const directionElements = [
    {
        direction: Direction.Up,
        label: "↑",
        col: "col-start-2",
    },
    {
        direction: Direction.Left,
        label: "←",
        col: "col-start-1",
    },
    {
        direction: Direction.Right,
        label: "→",
        col: "col-start-3",
    },
    {
        direction: Direction.Down,
        label: "↓",
        col: "col-start-2",
    },
];

type ControlProps = {
    account: AccountInterface;
    client: ReturnType<typeof client>;
    playerState: PlayerState;
    gameFloor: GameFloor;
}

const Controls: FunctionComponent<ControlProps> = ({ account, client, playerState, gameFloor }) => {
    const { move } = useSystemCalls();
    const [updated, setUpdated] = useState(true);

    useEffect(() => {
        setUpdated(true);
    }, [playerState.position]);

    const validateMovement = (direction: Direction): boolean => {
        let position: Vec2 = playerState.position;

        if (direction === Direction.Up    && position.y < gameFloor.size.y) return true
        if (direction === Direction.Right && position.x < gameFloor.size.x) return true 
        if (direction === Direction.Down  && position.y > 0) return true
        if (direction === Direction.Left  && position.x > 0) return true
            
        return false;
    };

    const handleMovement = async (direction: Direction) => {
        setUpdated(false);
        try {
            const isValid = validateMovement(direction);
            if (isValid) {
                await move(playerState, gameFloor, direction);
            } else {
                setUpdated(true);
            }
        } catch (err) {
            console.log("err while moving", err);
            setUpdated(true);
        }
    }

    return (
        <div className="bg-black/75 shadow-inner relative" >
            <div className="grid grid-cols-3 gap-2 w-full h-48 m-4" >
                {directionElements.map(({ direction, label, col }) => (
                    <button
                        className={`${col} justify-self-center h-12 w-12 bg-black primary rounded-md shadow-md active:shadow-inner text-2xl`}
                        key={direction}
                        onClick={() => handleMovement(direction)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {!updated && (
                <div className="absolute flex flex-col justify-center items-center mx-4 w-full h-full top-0 bg-black/75">
                    <p>Processing move</p>
                    <img
                        src={loaderIcon}
                        className="animate-spin"
                    />
                </div>  
            )}
        </div>
    );
};

export default Controls;