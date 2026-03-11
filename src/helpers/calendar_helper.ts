import { Timestamp } from "firebase/firestore";

declare const gapi: any;
declare const google: any;

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_CALENDAR_API_KEY!;

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.owned";
const TOKEN_STORAGE_KEY = "google_calendar_token_v1";

let tokenClient: any;
let gapiInited = false;
let gisInited = false;
let accessToken: string | null = null;
let accessTokenExpiresAt: number | null = null;

export function isCalendarApiReady(): boolean {
  return gapiInited && gisInited;
}

export function hasCalendarAccess(): boolean {
  return !!accessToken;
}

function persistToken(access_token: string, expires_in?: number) {
  accessToken = access_token;
  accessTokenExpiresAt =
    typeof expires_in === "number"
      ? Date.now() + expires_in * 1000
      : null;
  gapi.client.setToken({ access_token: accessToken });
  if (typeof window === "undefined") return;
  try {
    if (accessTokenExpiresAt) {
      const payload = JSON.stringify({
        accessToken,
        expiresAt: accessTokenExpiresAt,
      });
      sessionStorage.setItem(TOKEN_STORAGE_KEY, payload);
    }
  } catch {
    // ignore storage failures (e.g. private mode)
  }
}

function restoreTokenFromStorage(): boolean {
  if (accessToken) return true;
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      accessToken?: string;
      expiresAt?: number;
    };
    if (!parsed?.accessToken || !parsed?.expiresAt) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      return false;
    }
    if (parsed.expiresAt <= Date.now()) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      return false;
    }
    accessToken = parsed.accessToken;
    accessTokenExpiresAt = parsed.expiresAt;
    gapi.client.setToken({ access_token: accessToken });
    return true;
  } catch {
    return false;
  }
}

/** Load an external script dynamically. */
async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(`Failed to load: ${src}`);
    document.body.appendChild(script);
  });
}

/** Initializes the Google API client library. */
async function initGapiClient(): Promise<void> {
  return new Promise((resolve, reject) => {
    gapi.load("client", async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableActions();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

/** Initializes the token client for user authorization. */
function initTokenClient(): void {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse: any) => {
      if (tokenResponse.error) {
        console.error("Token error:", tokenResponse.error);
        return;
      }
      accessToken = tokenResponse.access_token;
      gapi.client.setToken({ access_token: accessToken });
      console.log("Access token granted and stored.");
    },
  });
  gisInited = true;
  maybeEnableActions();
}

/** Helper: only enable actions once both gapi and gis are initialized. */
function maybeEnableActions(): void {
  if (gapiInited && gisInited) {
    console.log("Google API client and OAuth ready.");
  }
}

/** Ensures scripts are loaded, gapi initialized, and OAuth client set up. */
export async function setupGoogleApi(): Promise<void> {
  if (!gapiInited || !gisInited) {
    await loadScript("https://apis.google.com/js/api.js");
    await loadScript("https://accounts.google.com/gsi/client");
    await initGapiClient();
    initTokenClient();
  }
  if (gapiInited && !accessToken) {
    restoreTokenFromStorage();
  }
}

/**
 * Called after user logs into your app (once per session).
 * Tries to silently request access; if not possible, shows the OAuth popup.
 */
export async function requestCalendarAccess(): Promise<void> {
  await setupGoogleApi();

  if (!accessToken) {
    return new Promise((resolve) => {
      tokenClient.callback = (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error("Authorization error:", tokenResponse.error);
          return;
        }
        persistToken(tokenResponse.access_token, tokenResponse.expires_in);
        console.log("Calendar access granted.");
        resolve();
      };

      // Default behavior (may show consent if needed)
      tokenClient.requestAccessToken({ prompt: "" });
    });
  }
}

/**
 * Interactive OAuth request that must be triggered by a user gesture (click/tap).
 * Assumes scripts are already loaded to avoid popup blockers on mobile.
 */
export function requestCalendarAccessInteractive(): Promise<void> {
  if (!isCalendarApiReady()) {
    return Promise.reject(new Error("Google API not ready"));
  }
  if (accessToken) return Promise.resolve();

  return new Promise((resolve, reject) => {
    tokenClient.callback = (tokenResponse: any) => {
      if (tokenResponse.error) {
        console.error("Authorization error:", tokenResponse.error);
        reject(tokenResponse.error);
        return;
      }
      persistToken(tokenResponse.access_token, tokenResponse.expires_in);
      console.log("Calendar access granted.");
      resolve();
    };

    // Avoid forcing consent if already granted
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

/**
 * Silent OAuth request that will not show UI.
 * Returns false if interaction is required or authorization fails.
 */
async function requestCalendarAccessSilent(): Promise<boolean> {
  if (!isCalendarApiReady()) return false;
  if (accessToken) return true;

  return new Promise((resolve) => {
    tokenClient.callback = (tokenResponse: any) => {
      if (tokenResponse.error) {
        console.warn("Silent auth failed:", tokenResponse.error);
        resolve(false);
        return;
      }
      persistToken(tokenResponse.access_token, tokenResponse.expires_in);
      resolve(true);
    };

    // Attempt without UI
    tokenClient.requestAccessToken({ prompt: "none" });
  });
}

/**
 * Ensures the user is authorized before making a Calendar API call.
 * If token expired or missing, will try to refresh silently.
 */
async function ensureAuthorized(): Promise<boolean> {
  if (accessToken) return true;
  return requestCalendarAccessSilent();
}

/** Adds an event to the user's Google Calendar. */
export async function addToCal(
  title: string,
  course: string,
  purpose: string,
  date: Timestamp,
  location: string,
  details: string,
  email: string
) {
  const authorized = await ensureAuthorized();
  if (!authorized) return "None";

  const start = date.toDate().toISOString();
  const end = new Date(date.toMillis() + 3600000).toISOString();

  const event = {
    summary: `Study Group: ${title}`,
    location,
    description: `Course: ${course}\nPurpose: ${purpose}\nDetails: ${details}`,
    start: { dateTime: start, timeZone: "America/New_York" },
    end: { dateTime: end, timeZone: "America/New_York" },
    attendees: [{ email }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log("Event created:", response.result.htmlLink);
    return response.result.id;
  } catch (err) {
    console.error("Error creating event:", err);
    return "None";
  }
}

/**
 * Removes `attendeeEmail` from the event with `eventId`.  
 * - If the attendee is the organizer and there are other attendees, it picks another attendee as new owner (by moving the event).  
 * - If the attendee is not the organizer, it simply removes them.  
 * - If after removal there are no attendees left, it deletes the event.
 *
 * @param eventId ID of the event in the calendarId calendar.
 * @param calendarId ID of the calendar
 * @param attendeeEmail Email of the attendee to remove.
 */
export async function deleteFromCal(
  eventId: string,
): Promise<void> {
  const authorized = await ensureAuthorized();
  if (!authorized) {
    console.warn("Calendar authorization required to delete event.");
    return;
  }

  try {
    await gapi.client.calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    console.log(`Event ${eventId} deleted.`);
  } catch (err) {
    console.warn("Failed to delete calendar event:", err);
  }
}
