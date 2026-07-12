export const META_PIXEL_ID = '24050816504570818';

type MetaEventParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function trackMetaEvent(event: string, params?: MetaEventParams) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    return;
  }

  if (params) {
    window.fbq('track', event, params);
    return;
  }

  window.fbq('track', event);
}

/** Fires a standard PageView — used for client-side route changes in the SPA. */
export function trackMetaPageView() {
  trackMetaEvent('PageView');
}

/** Call only after a confirmed lead submission (form success, etc.). */
export function trackMetaLead(params?: MetaEventParams) {
  trackMetaEvent('Lead', params);
}

/** Call only after a confirmed booking/scheduling success. */
export function trackMetaSchedule(params?: MetaEventParams) {
  trackMetaEvent('Schedule', params);
}
