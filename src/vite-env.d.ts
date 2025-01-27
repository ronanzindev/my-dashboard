/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_SECRET: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_SUPABASE_URL: string
}


interface ImportMeta {
    readonly env: ImportMetaEnv
}