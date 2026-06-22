/* GDPR consent storage + cross-component events.
   Necessary cookies are always on; analytics/marketing require explicit opt-in. */
export const CONSENT_KEY = "a01-consent";

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

export function saveConsent({ analytics = false, marketing = false }) {
  const record = { necessary: true, analytics, marketing, ts: new Date().toISOString() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent("a01-consent-changed", { detail: record }));
  return record;
}

/* Re-open the consent bar (e.g. from the footer "Manage cookies" link) */
export function openConsent() {
  window.dispatchEvent(new CustomEvent("a01-consent-open"));
}

/* Open a legal document modal: doc = "privacy" | "cookie" */
export function openLegal(doc) {
  window.dispatchEvent(new CustomEvent("a01-legal", { detail: doc }));
}
