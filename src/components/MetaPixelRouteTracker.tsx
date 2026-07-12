import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackMetaPageView } from '../services/metaPixel';

/**
 * Fires PageView on client-side route changes. Initial PageView is handled by the base pixel in index.html.
 */
export default function MetaPixelRouteTracker() {
  const { pathname } = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    trackMetaPageView();
  }, [pathname]);

  return null;
}
