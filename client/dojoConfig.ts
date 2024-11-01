import { createDojoConfig } from "@dojoengine/core";

import manifest from "../backend/manifests/dev/deployment/manifest.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
