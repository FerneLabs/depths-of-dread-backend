import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { useEffect, useState } from "react";
 
export function ConnectWallet() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
 
    const connector = connectors[0] as ControllerConnector;
 
    const [username, setUsername] = useState<string>();
    useEffect(() => {
        console.log("CONTROLLER", address, connector, connector.username());
        if (!address) return;
        connector.username()?.then((n) => setUsername(n));
    }, [address, connector]);
 
    return (
        <div className="flex justify-evenly grenze">
            {address && (
                <>
                    <p>Account: {address} </p>
                    {username && <p>Username: {username}</p>}
                </>
            )}
 
            <button 
                className="rounded-md bg-[#131519] primary py-2 px-4 text-xl"
                onClick={() => {
                    console.log("Controller Address:", address);
                    console.log("Connector:", connector);
                    address ? disconnect() : connect({ connector });
                }}
            >
                {address ? "Disconnect" : "Connect"}
            </button>
        </div>
    );
}