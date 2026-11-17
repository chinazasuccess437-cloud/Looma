declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-SHB89BFPNP';

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  try {
    window.gtag('event', eventName, params ?? {});
  } catch {
    // Ignore analytics errors if blocked by browser privacy extensions
  }
}

export function trackWorkspaceView(
  workspace: 'logo' | 'states' | 'kit' | 'custom' | 'feedback'
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  const titles: Record<typeof workspace, string> = {
    logo: 'Looma — Logo Loader',
    states: 'Looma — States & Motion',
    kit: 'Looma — Layouts & UI Kit',
    custom: 'Looma — Custom AI Studio',
    feedback: 'Looma — Feedback & Ratings',
  };
  try {
    window.gtag('event', 'page_view', {
      page_title: titles[workspace],
      page_path: `/${workspace === 'logo' ? '' : workspace}`,
      workspace_tab: workspace,
    });
  } catch {
    // Ignore analytics errors
  }
}
