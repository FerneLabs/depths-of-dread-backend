/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MANIFEST: string
    readonly VITE_PUBLIC_SLOT_RPC: string
    readonly VITE_PUBLIC_TORII_URL: string
    readonly VITE_PUBLIC_TORII_RELAY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}