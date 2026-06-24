import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'environments/environment';

/**
 * Demo mode for the public marketing-site iframe preview.
 *
 * The app is embedded as `https://testmaintenance.skyline-inov.com/?demo=1#/auth/login`.
 * When `demo=1` is present we auto sign-in as a dedicated, read-only demo account and land
 * the visitor on the dashboard, skipping the login screen. Normal usage (no `demo=1`) is
 * completely untouched.
 */
@Injectable({ providedIn: 'root' })
export class DemoService {
  private static readonly DEMO_QUERY_PARAM = 'demo';
  private static readonly DEMO_SESSION_KEY = 'demoMode';

  constructor(private auth: AuthService) {}

  /**
   * Whether the app was opened in demo mode (`?demo=1`).
   *
   * IMPORTANT: this app uses HashLocationStrategy, so the flag lives in the REAL query
   * string (`window.location.search`), BEFORE the `#`. Angular's `ActivatedRoute.queryParams`
   * only sees params AFTER the `#`, so it never sees this one — we MUST read
   * `window.location.search` directly. The query string survives in-app hash navigation and
   * page refresh, and we also mirror it into sessionStorage so demo state stays sticky for
   * the tab even if the query were ever stripped.
   */
  isDemo(): boolean {
    try {
      const inUrl =
        new URLSearchParams(window.location.search).get(DemoService.DEMO_QUERY_PARAM) === '1';
      if (inUrl) {
        sessionStorage.setItem(DemoService.DEMO_SESSION_KEY, '1');
      }
      return inUrl || sessionStorage.getItem(DemoService.DEMO_SESSION_KEY) === '1';
    } catch {
      // SSR / privacy-mode storage failures must never break the app.
      return false;
    }
  }

  /**
   * Runs from an APP_INITIALIZER, BEFORE the router and auth guards activate. When demo mode
   * is requested and there is no valid session yet, it fetches a short-lived demo JWT from the
   * backend demo-login endpoint and stores it under the normal `token` key, so the guards
   * treat it as a real session and the visitor lands straight on the dashboard.
   *
   * Fails open (to the normal login screen) on any error so a demo/back-end problem can never
   * block normal usage.
   */
  async initDemoSession(): Promise<void> {
    if (!this.isDemo()) {
      return; // Normal mode: do nothing — the existing login flow is untouched.
    }
    if (this.auth.loggedIn()) {
      return; // Already a valid session — never override it.
    }
    if (!environment.demoLoginEndpoint) {
      return; // Demo auto-login disabled by config.
    }
    try {
      // 8s cap so an unreachable endpoint can't hang app startup.
      await firstValueFrom(this.auth.demoLogin().pipe(timeout(8000)));
    } catch (err) {
      console.error('[demo] auto-login failed; falling back to the login screen', err);
    }
  }
}
