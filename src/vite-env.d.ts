/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_IMMERSAL_TOKEN: string;
  readonly VITE_MAP_ID: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
