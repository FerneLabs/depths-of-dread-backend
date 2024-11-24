import { createDojoConfig } from "@dojoengine/core";

import manifest_dev from "../backend/manifest_dev.json";
import manifest_staging from "../backend/manifest_staging.json";
import manifest_prod from "../backend/manifest_release.json";

let manifest = manifest_dev;

if (import.meta.env.VITE_SLOT_RPC === "https://api.cartridge.gg/x/dod-dev/katana") {
    manifest = manifest_staging;
}

if (import.meta.env.VITE_SLOT_RPC === "https://api.cartridge.gg/x/dod-prod/katana") {
    manifest = manifest_prod;
}

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: import.meta.env.VITE_SLOT_RPC,
    toriiUrl: import.meta.env.VITE_TORII_URL,
    relayUrl: import.meta.env.VITE_TORII_RELAY,
});
