import { createDojoConfig } from "@dojoengine/core";

import manifest_dev from "../backend/manifest_dev.json";
import manifest_prod from "../backend/manifest_release.json";

const manifest = import.meta.env.VITE_PUBLIC_SLOT_RPC ? manifest_prod : manifest_dev;

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: import.meta.env.VITE_PUBLIC_SLOT_RPC,
    toriiUrl: import.meta.env.VITE_PUBLIC_TORII_URL,
    relayUrl: import.meta.env.VITE_PUBLIC_TORII_RELAY,
});
