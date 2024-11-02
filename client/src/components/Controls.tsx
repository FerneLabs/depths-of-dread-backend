import { BurnerAccount } from "@dojoengine/create-burner";
import { client } from "./bindings/contracts.gen";
import { FunctionComponent } from "react";

type ControlProps = {
    account: BurnerAccount,
    client: ReturnType<typeof client>;
}

const Controls: FunctionComponent<ControlProps> = ({ account, client }) => {
    return (
        <div className="bg-black p-4 rounded-lg shadow-inner" >
            <div className="grid grid-cols-3 gap-2 w-full h-48" >
                {
                    [
                        {
                            direction: "Up" as const,
                            label: "↑",
                            col: "col-start-2",
                        },
                        {
                            direction: "Left" as const,
                            label: "←",
                            col: "col-start-1",
                        },
                        {
                            direction: "Right" as const,
                            label: "→",
                            col: "col-start-3",
                        },
                        {
                            direction: "Down" as const,
                            label: "↓",
                            col: "col-start-2",
                        },
                    ].map(({ direction, label, col }) => (
                        <button
                            className={`${col} justify-self-center  h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                            key={direction}
                            onClick={async () => {
                                await client.actions.move({
                                    account: account.account,
                                    direction: { type: direction },
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