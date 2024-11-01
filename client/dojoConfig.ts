import { createDojoConfig } from "@dojoengine/core";

import manifest from "../backend/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
