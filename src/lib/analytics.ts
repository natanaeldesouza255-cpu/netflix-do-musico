import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const enabled = Boolean(key) && import.meta.env.PROD;

export function initAnalytics() {
  if (!enabled || !key) return;
  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    persistence: 'memory',
    capture_exceptions: true,
    loaded: (ph) => ph.capture('app_loaded'),
  });
}
export function trackPage(screen: string) {
  if (enabled) posthog.capture('screen_viewed', { screen });
}
