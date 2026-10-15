interface ImportMetaEnv {
  readonly PUBLIC_cSPACE?: string;
  readonly PUBLIC_cACCESS_TOKEN?: string;
  readonly CONTENTFUL_ENVIRONMENT?: string;
  readonly CONTENTFUL_REVIEW_TYPE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
