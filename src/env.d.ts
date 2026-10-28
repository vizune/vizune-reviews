interface ImportMetaEnv {
  readonly PUBLIC_cSPACE?: string;
  readonly PUBLIC_cACCESS_TOKEN?: string;
  readonly CONTENTFUL_ENVIRONMENT?: string;
  readonly CONTENTFUL_REVIEW_TYPE?: string;
  readonly PUBLIC_REMARK42_HOST?: string;
  readonly PUBLIC_REMARK42_SITE_ID?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
