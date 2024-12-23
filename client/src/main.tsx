import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";
import { init } from "@dojoengine/sdk";
import { DepthsOfDreadSchemaType, schema } from "./bindings/models.gen.ts";
import { dojoConfig } from "../dojoConfig.ts";
import { DojoContextProvider } from "./DojoContext.tsx";
import { setupBurnerManager } from "@dojoengine/create-burner";

import { ControllerProvider } from "./ControllerProvider.tsx";

async function main() {
    const sdk = await init<DepthsOfDreadSchemaType>(
        {
            client: {
                rpcUrl: dojoConfig.rpcUrl,
                toriiUrl: dojoConfig.toriiUrl,
                relayUrl: dojoConfig.relayUrl,
                worldAddress: dojoConfig.manifest.world.address,
            },
            domain: {
                name: "WORLD_NAME",
                version: "1.0",
                chainId: "KATANA",
                revision: "1",
            },
        },
        schema
    );

    createRoot(document.getElementById("root")!).render(
        <ControllerProvider>
            <DojoContextProvider burnerManager={await setupBurnerManager(dojoConfig)}>
                <App sdk={sdk} />
            </DojoContextProvider>
        </ControllerProvider>
    );
}

main().catch((error) => {
    console.error("Failed to initialize the application:", error);
});
