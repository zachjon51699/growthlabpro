/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Booking calendar iframe URL for /contractor-optin (optional) */
  readonly VITE_BOOKING_WIDGET_URL?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
