import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Controller from "@cartridge/controller";
import { AccountInterface } from 'starknet';
import { dojoConfig } from '../dojoConfig';
import { Policy, ControllerOptions } from '@cartridge/controller';
import { getContractByName } from '@dojoengine/core';

const actions_contract_address = getContractByName(
  dojoConfig.manifest,
  "depths_of_dread",
  "actions",
)?.address;

const policies: Policy[] = [
  {
    target: actions_contract_address,
    method: "create_player",
    description: "Create a new player",
  },
  {
    target: actions_contract_address,
    method: "create_game",
    description: "Create a game",
  },
  {
    target: actions_contract_address,
    method: "move",
    description: "Move character inside level",
  },
  {
    target: actions_contract_address,
    method: "end_game",
    description: "End a game",
  }
];

const options: ControllerOptions = {
  rpc: dojoConfig.rpcUrl,
  slot: import.meta.env.VITE_SLOT_PROJECT,
  namespace: "depths_of_dread",
  policies: policies,
}

interface ControllerContextType {
  account: AccountInterface | null;
  username: string | null;
  controller: Controller | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const ControllerContext = createContext<ControllerContextType | undefined>(undefined);

interface ControllerProviderProps {
  children: ReactNode;
}

export const ControllerProvider: React.FC<ControllerProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [controller, setController] = useState<Controller | null>(null);

  useEffect(() => {
    const ctrl = new Controller(options);
    setController(ctrl);
  }, []);

  useEffect(() => {
    if (!controller) return;
    console.log(controller);
    probe();
  }, [controller]);

  const probe = async () => {
    try {
      await controller.probe();
      await connect();
    } catch (err) {
      console.error("Error auto-connecting controller", err);
    }
  };

  const connect = async () => {
    if (!controller) return;
    const accountInstance = await controller.connect();
    setAccount(accountInstance);
    const usernameInstance = await controller.username();
    setUsername(usernameInstance);
  };

  const disconnect = async () => {
    if (!controller) return;
    controller.disconnect().then(_ => {
      setAccount(null);
      setUsername(null);
    });
  };

  return (
    <ControllerContext.Provider value={{ account, username, controller, connect, disconnect }}>
      {children}
    </ControllerContext.Provider>
  );
};

export const useController = (): ControllerContextType => {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error("useController must be used within a ControllerProvider");
  }
  return context;
};
