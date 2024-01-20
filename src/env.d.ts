interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  /**
   * Built-in environment variable.
   * @see Docs https://github.com/chihab/ngx-env#ng_app_env.
   */
  readonly NG_APP_ENV: string
  readonly NG_APP_BASE_URL: string
  readonly NG_APP_BACKEND_URL: string
  readonly NG_APP_EMAIL: string
  readonly NG_APP_GEOPIFY_API: string
  readonly NG_APP_GEOPIFY_KEY: string
  readonly NG_APP_TMDB_API: string
  readonly NG_APP_TMDB_KEY: string
  readonly NG_APP_GOOGLE_CLIENT_ID: string
  readonly NG_APP_GOOGLE_CLIENT_SECRET: string
  readonly NG_APP_RAZORPAY_PUBLIC_KEY: string
  // Add your environment variables below
  // readonly NG_APP_API_URL: string;
  [key: string]: any
}
