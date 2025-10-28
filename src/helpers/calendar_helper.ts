import { Timestamp } from "firebase/firestore";

declare const gapi: any;
declare const google: any;

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_CALENDAR_API_KEY!;

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient: any;
let gapiInited = false;
let gisInited = false;
let accessToken: string | null = null;

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
        accessToken = tokenResponse.access_token;
        gapi.client.setToken({ access_token: accessToken });
        console.log("Calendar access granted.");
        resolve();
      };

      // Try silent first (no popup if the user already granted access)
      tokenClient.requestAccessToken({ prompt: "" });
    });
  }
}

/**
 * Ensures the user is authorized before making a Calendar API call.
 * If token expired or missing, will try to refresh silently.
 */
async function ensureAuthorized(): Promise<void> {
  if (!accessToken) {
    await requestCalendarAccess();
  }
}

/** Adds an event to the user's Google Calendar. */
export async function addToCal(
  id: string,
  title: string,
  course: string,
  purpose: string,
  date: Timestamp,
  location: string,
  details: string,
  email: string
) {
  await ensureAuthorized();

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
    return undefined;
  }
}

/**
 * Adds an attendee to an existing event on the user’s primary Google Calendar.
 * @param eventId The ID of the event (as stored or returned when created).
 * @param newAttendeeEmail The email address to add as an attendee.
 */
export async function addAttendeeToEvent(
    eventId: string,
    calId: string,
    newAttendeeEmail: string
  ): Promise<void> {
    await ensureAuthorized();
  
    try {
      // Step 1: Fetch current event
      const getResponse = await gapi.client.calendar.events.get({
        calendarId: calId,
        eventId,
      });
      const event = getResponse.result;
  
      // Step 2: Prepare updated attendees list
      const existingAttendees = (event.attendees as any[]) ?? [];
      // Avoid duplicates
      const alreadyExists = existingAttendees.some(
        (a) => a.email === newAttendeeEmail
      );
      if (!alreadyExists) {
        existingAttendees.push({ email: newAttendeeEmail });
      }
  
      // Step 3: Patch the event with updated attendees
      const patchResponse = await gapi.client.calendar.events.patch({
        calendarId: "primary",
        eventId,
        resource: {
          attendees: existingAttendees,
        },
        sendUpdates: "all", // optionally notify attendees of change
      });
  
      console.log("Attendee added:", newAttendeeEmail, patchResponse.result.htmlLink);
    } catch (err) {
      console.error("Error adding attendee to event:", err);
      throw err;
    }
  }
  
/**
 * Removes `attendeeEmail` from the event with `eventId`.  
 * - If the attendee is the organizer and there are other attendees, it picks another attendee as new owner (by moving the event).  
 * - If the attendee is not the organizer, it simply removes them.  
 * - If after removal there are no attendees left, it deletes the event.
 *
 * @param eventId ID of the event in the primary calendar.
 * @param attendeeEmail Email of the attendee to remove.
 */
export async function removeAttendeeFromGroup(
  eventId: string,
  calId: string,
  attendeeEmail: string
): Promise<void> {
  await ensureAuthorized();

  const calendarId = "primary";

  try {
    // Step 1: get current event
    const getResp = await gapi.client.calendar.events.get({
      calendarId,
      eventId,
    });
    const event = getResp.result;

    const organizerEmail: string | undefined = event.organizer?.email;
    const attendees: any[] = (event.attendees as any[]) ?? [];

    // Remove the attendee from list
    const newAttendees = attendees.filter(a => a.email !== attendeeEmail);

    // Check if removed person was organizer
    const removedWasOrganizer = (attendeeEmail === organizerEmail);

    if (removedWasOrganizer) {
      // If organizer removed
      if (newAttendees.length === 0) {
        // No one left → delete event
        await gapi.client.calendar.events.delete({
          calendarId,
          eventId,
          sendUpdates: "all",
        });
        console.log(`Event ${eventId} deleted because organizer removed and no other attendees.`);
        return;
      } else {
        // Choose new owner (first attendee)
        const newOwner = newAttendees[0].email;
        // Move event to new owner's calendar (this changes organizer)  
        // NOTE: move requires you have permission on destination calendar  
        const moveResp = await gapi.client.calendar.events.move({
          calendarId,
          eventId,
          destination: newOwner,
          sendUpdates: "all",
        });
        console.log(`Event ${eventId} moved to new owner ${newOwner}.`);

        // After move, patch attendees list (removing the old organizer)
        await gapi.client.calendar.events.patch({
          calendarId: newOwner,
          eventId,
          resource: {
            attendees: newAttendees,
          },
          sendUpdates: "all",
        });
        console.log(`Removed old organizer ${attendeeEmail} from attendees of event ${eventId}.`);
        return;
      }
    } else {
      // If removed person was *not* organizer
      if (newAttendees.length === 0) {
        // After removal, no attendees left → optionally delete event
        await gapi.client.calendar.events.delete({
          calendarId,
          eventId,
          sendUpdates: "all",
        });
        console.log(`Event ${eventId} deleted because no attendees remain after removing ${attendeeEmail}.`);
        return;
      } else {
        // Simply patch event with updated attendees
        await gapi.client.calendar.events.patch({
          calendarId,
          eventId,
          resource: {
            attendees: newAttendees,
          },
          sendUpdates: "all",
        });
        console.log(`Removed attendee ${attendeeEmail} from event ${eventId}.`);
        return;
      }
    }
  } catch (err) {
    console.error("Error in removeAttendeeFromGroup:", err);
    throw err;
  }
}
