import { React, useEffect, useState } from "react";
import { useController } from "../ControllerProvider";
import { AccountInterface } from "starknet";

export function ConnectWallet() {
    const { account, username, controller, connect, disconnect } = useController();

    const handleConnection = async () => {
        await connect();
        console.log("User connected:", account, username);
    };

    const handleDisconnection = async () => {
        await disconnect();
    }

    useEffect(() => {
        console.log("Account", account);
        console.log("Username", username);
    }, [account, username]);

    return (
        <div className="flex justify-evenly grenze">
            <button
                className="rounded-md bg-[#131519] primary py-2 px-4 text-xl"
                onClick={async () => {
                    username ? await handleDisconnection() : await handleConnection();
                }}
            >
                {username ? username : "Connect"}
            </button>
        </div>
    );
}