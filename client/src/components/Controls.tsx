import { BurnerAccount } from "@dojoengine/create-burner";
import { client } from "./bindings/contracts.gen";
import { FunctionComponent } from "react";
import { Direction } from "../bindings/models.gen";

type ControlProps = {
    account: BurnerAccount,
    client: ReturnType<typeof client>
}

const Controls: FunctionComponent<ControlProps> = ({ account, client }) => {
    return (
        <div className="bg-black/75 p-4 shadow-inner" >
            <div className="grid grid-cols-3 gap-2 w-full h-48" >
                {
                    [
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
                    ].map(({ direction, label, col }) => (
                        <button
                            className={`${col} justify-self-center h-12 w-12 bg-black primary rounded-md shadow-md active:shadow-inner text-2xl`}
                            key={direction}
                            onClick={async () => {
                                await client.actions.move({
                                    account: account.account,
                                    direction: direction,
                                });
                            }}
                        >
                            {label}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default Controls;