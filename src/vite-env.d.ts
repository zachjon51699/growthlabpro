/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GHL_API_KEY?: string;
  readonly VITE_GHL_LOCATION_ID?: string;
  readonly VITE_GHL_API_BASE?: string;
  /** Booking calendar iframe URL for /contractor-optin (optional) */
  readonly VITE_BOOKING_WIDGET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
