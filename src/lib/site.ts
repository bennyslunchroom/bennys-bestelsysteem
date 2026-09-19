// Op Vercel staat dit adres automatisch klaar (geen instelling nodig).
// Lokaal (op je eigen computer) gebruiken we NEXT_PUBLIC_SITE_URL uit .env.local, of anders localhost.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
