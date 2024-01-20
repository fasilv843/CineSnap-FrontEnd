export const environments = {
  production: false,
  baseUrl: import.meta.env.NG_APP_BASE_URL, // ${backendUrl} + /api
  backendUrl: import.meta.env.NG_APP_BACKEND_URL,
  supportMail: import.meta.env.NG_APP_EMAIL,
  geoapifyApi: import.meta.env.NG_APP_GEOPIFY_API,
  geoapifyKey: import.meta.env.NG_APP_GEOPIFY_KEY,
  tmdbApi: import.meta.env.NG_APP_TMDB_API,
  tmdbKey: import.meta.env.NG_APP_TMDB_KEY,
  google_client_id: import.meta.env.NG_APP_GOOGLE_CLIENT_ID,
  google_client_secret: import.meta.env.NG_APP_GOOGLE_CLIENT_SECRET,
  razorpayPublicKey: import.meta.env.NG_APP_RAZORPAY_PUBLIC_KEY
}
