import { React, useEffect, useState } from "react";
import { useController } from "../ControllerProvider";
import { AccountInterface } from "starknet";
import logoutIcon from "../assets/logout.png";

export function ConnectWallet() {
    const { account, username, controller, connect, disconnect } = useController();

    const handleConnection = async () => {
        await connect();
        console.log("User connected:", account, username);
    };

    const handleDisconnection = async () => {
        await disconnect();
    }

    const handleProfileModal = () => {
        controller?.openProfile();
    }

    useEffect(() => {
        console.log("Account", account);
        console.log("Username", username);
    }, [account, username]);

    return (
        <div className="flex justify-evenly grenze">
            <div className="flex rounded-md bg-[#131519] primary py-2 px-4 text-xl">
                <button onClick={() => username ? handleProfileModal() : handleConnection()}>
                    {username ? username : "Connect"}
                </button>
            </div>
            {username && (
                    <button 
                        className="rounded-md bg-[#131519] primary flex justify-center p-3 ml-1" 
                        onClick={() => handleDisconnection()}
                    >
                        <img
                            className="h-4"
                            src={logoutIcon} 
                            alt="logout icon" 
                        />
                    </button>
                )}
        </div>
    );
}