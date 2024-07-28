/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_CHAIN_ID: string;
  readonly VITE_INFURA_API_KEY: string;
  readonly VITE_PRIVATE_KEY: string;
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}