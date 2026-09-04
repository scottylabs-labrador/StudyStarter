# CMU Study: new UI refactor plan

## Scope and guardrails

This is a full user-interface refactor based on the supplied design board. The product remains a CMU student study-group service: users maintain an academic profile and courses, discover and filter upcoming groups, create/edit/join/leave groups, view participant profiles, manage blocks, use the existing calendar connection, set an appearance preference, open feedback, and read the privacy policy.

The work changes information architecture, page layout, interaction presentation, responsive navigation, visual hierarchy, and component styling. It does **not** introduce product capabilities absent from the current app.

In particular, the mock contains a few visual concepts that must not become new functionality:

- Sign-in and account-creation screens remain entry points to the existing CMU single-sign-on flow. Do not add password authentication, email/password registration, password reset, or self-managed names.
- The search, notification, and overflow icons in the compact app chrome must not promise group text search, notifications, or general group-management actions that do not exist. They may be omitted, or only expose an existing supported action.
- Appearance supports the existing Light and Dark choices. Do not add a System setting.
- “Calendar Settings” must only surface the already-supported calendar connection and the existing external account-permissions/revocation destination. Do not invent a calendar-management system.
- The feedback page remains a friendly in-app handoff to the existing feedback form; it does not collect or store feedback itself.

## Design direction extracted from the board

### Shared visual language

- Use a bright, calm, campus-oriented interface with a near-white page background, white cards, thin neutral borders, soft shadows, and generous rounding.
- Make CMU red the primary action and emphasis color. Pair it with charcoal/near-black primary text, muted gray supporting text, a pale neutral surface, a soft green editable/success state, and restrained amber warning feedback.
- Use the supplied serif-style **CMU Study** wordmark treatment, red `CMU` and dark `Study`, as the product identity. Use the brand in headers, navigation, and entry pages.
- Use compact, readable type: clear display headlines for entry pages; compact screen titles; small metadata; and consistently aligned labels, values, and controls.
- Standardize control states shown in the board: filled red primary button, bordered secondary button, red text link, outlined `Joined`/`Join` badges, pale green `Editable` tag, muted `Full` tag, compact input/dropdown/date controls, icon buttons, and circular floating primary action.
- Use meaningful icons beside key metadata: course/subject, date, time, location, capacity, profile, calendar, appearance, block, feedback, privacy, and sign out. Icons must be accompanied by labels or accessible names.
- Preserve keyboard access, visible focus, Escape/outside-click dismissal where applicable, focus containment in dialogs, and readable light/dark contrast.

### Responsive shell

- **Desktop:** a persistent left rail, matching board A. Include the brand, Group Finder, My Groups, Profile, Blocked Students, Calendar Settings, Appearance, Feedback, Privacy Policy, and Sign out. Clearly mark the active destination.
- **Mobile:** a fixed bottom bar, matching board B. The primary destinations are Finder, My Groups, Create (central red +), Profile, and More. More opens the remaining existing destinations: Blocked Students, Calendar Settings, Appearance, Feedback, Privacy Policy, and Sign out.
- The app header on list pages may show existing profile access and navigation affordances, but it must not add notifications or other unimplemented behavior.
- Desktop content should be centered and constrained; mobile pages should use a single-column, touch-friendly card layout with a fixed bottom safe area.

## Target page map and behavior mapping

### 1. Landing page (`/`)

Replace the current landing screen with the illustrated split hero in the board:

- Header: wordmark; anchor links for Features, For Students, Privacy, and Support; Sign in; Get Started.
- Hero: “Find. Create. Study. Succeed together.” with the red final line, concise benefit text, four short feature bullets, Get Started and Sign in actions, and a “CMU students only” reassurance.
- Right-side campus/student illustration: use a licensed or newly created visual asset with the same warm campus-study mood; do not reuse an image without permission.
- Features and For Students anchors scroll to explanatory sections on the page. Privacy opens the privacy page; Support opens the existing support/feedback destination.
- Both entry calls-to-action invoke the existing CMU sign-in flow. Authenticated users continue through the existing routing rules.

### 2. Sign in and account entry (`/login` and entry state)

Use the two-card visual system from the board, while preserving existing authentication behavior:

- **Sign-in card:** welcome copy, CMU email visual context, sign-in action, and a prominent “Sign in with SSO (CMU)” action. The actual credential action remains the existing single sign-on; no password is processed.
- **Create-account card:** explain that an account profile will be set up after CMU sign-in. Its primary action also starts the existing sign-in flow, then routes an unprofiled user to onboarding.
- Provide cross-links between sign-in and account-entry views. The page should communicate the student-only limitation clearly.

### 3. Access restricted (`/access-restricted`)

Rebuild as the centered lock-state page:

- Large soft-red circular lock icon, “CMU Students Only” heading, explanation of eligibility, Contact Support, and Sign out.
- Contact Support uses the existing support email route. Sign out returns to the public landing page.

### 4. Onboarding: academic profile (`/onboarding/profile`)

Split the current onboarding into the first step shown in the board:

- Step indicator showing the user is early in setup, back navigation where applicable, and “Tell us about yourself” copy.
- Existing profile fields only: academic year, majors, and optional minors/concentrations.
- Preserve selectable year, master’s student, and PhD student values. Retain the user’s imported identity separately; do not add editable name/account fields.
- Continue advances to course selection and retains changes made to profile fields.

### 5. Onboarding: courses (`/onboarding/courses`)

Create the second dedicated onboarding step:

- Progress indicator, back link, “Add at least one course” heading, course search input, search-result rows with add controls, selected-course list with remove controls, and a fixed Continue action.
- Keep existing course-catalog search behavior, course-number/title matching, duplicate prevention, and keyboard Enter-to-add behavior.
- Block completion until at least one course is selected; show the existing requirement in inline validation rather than advancing.
- Route successful completion to Group Finder.

### 6. Group Finder (`/feed`)

Replace the grid with the board’s compact chronological list:

- Screen title, existing course multi-filter, existing date filter, optional compact filter presentation, and account/profile access.
- A scrollable list of upcoming eligible groups. Each row has a date tile, title, course, purpose, time range, location, capacity, and a participation state (`Join`, `Joined`, or non-interactive full state when relevant).
- Preserve current eligibility exactly: do not show past groups; hide blocked relationships; hide full groups unless the user already belongs; and apply date/course filters.
- Selecting a row opens the Group Details page or mobile sheet, rather than displaying the current large overlay.
- A circular floating create button opens the Create Group flow.
- Retain clear empty-state treatment when filters have no matches and successful/error feedback after actions.

### 7. Group Details (`/groups/:id` or an equivalent route-backed detail state)

Replace the current modal-style details with the board’s dedicated detail view:

- Back navigation, title/course, short purpose, date, time, location, and participant/capacity count.
- Details card, expandable participant preview, and “View Participant List.”
- Participants are tappable and open the compact participant profile.
- Bottom primary action is Join or Leave Group. It uses all existing capacity, duplicate-membership, block, update, and calendar behaviors.
- Surface Edit only when the existing UI permits it: while the group has exactly one participant. Do not create new organizer/moderator controls.
- If a group disappears while open, return to Finder with an unavailable message.

### 8. Participant Profile (detail sheet/page)

Restyle the existing participant profile popup as the compact profile page/sheet shown in the board:

- Back/dismiss action, profile photo or initial, first name, email, academic year, majors, and minors/concentrations.
- Do not expose private information beyond the existing profile summary.

### 9. Create Group (`/groups/new` or route-backed sheet)

Use the creation form in the board:

- Back/dismiss control; Title, Course, Purpose, Date, Time, Location, Max Capacity, and optional Details fields.
- Course choices remain limited to the user’s saved courses.
- Preserve all visible constraints: title 27 characters, purpose 50, location 40, details 200, and capacity 2–100.
- Keep the existing calendar-permission prompt and optional calendar-event creation as part of successful creation.
- On success, continue to the dedicated success confirmation rather than only showing a toast.

### 10. Create Group success (transient route/screen)

Add the board’s confirmation screen without adding new functionality:

- Celebrate successful creation with a clear success state.
- State that the user is the first participant and the group is in My Groups.
- Report whether the existing optional calendar event was added. If unavailable, communicate the current non-blocking calendar result accurately.
- Provide View Group and Back to Group Finder actions.

### 11. Edit Group (route/sheet)

Use the edit screen in the board:

- Same fields and constraints as Create Group, prefilled with the group’s current information.
- Explain the current eligibility condition: it is editable only while it has one participant.
- Save changes, then preserve the existing best-effort calendar-event update and its warning when that update fails.
- The detail view must refresh immediately after a successful save.

### 12. My Groups (`/my-groups`)

Use the same compact list system as Group Finder, restricted to the user’s upcoming joined groups:

- Existing course/date filters.
- Participation label on every row; include the existing editable signal where the group meets the edit condition.
- Card selection opens Group Details.
- Floating create action is retained.
- Display a clear empty state when the user has no matching upcoming groups.

### 13. Blocked Students (`/blocked-students`)

Move block management out of Profile and into its own screen:

- Screen title, concise explanation of how blocking changes shared groups and visibility, and an add/block action.
- The add action accepts the current CMU student-email format, preserves self-block prevention, and uses a confirmation step when shared groups would be affected.
- List blocked students with an avatar/initial, name if available, email, shared-group impact, and Unblock action.
- Preserve all current consequences: future mutual visibility/join protection, removal of the blocker from shared groups after confirmation, deletion of now-empty groups, and best-effort removal of affected personal calendar events.

### 14. Calendar Settings (`/calendar-settings`)

Create a simple page that makes the existing calendar integration discoverable without expanding it:

- Explain that study groups can be added to the user’s personal calendar during create/join flows, and removed during leave/block flows.
- Link to the existing external account-permissions page for revocation. Do not claim to read a user’s calendar or add calendar browsing/settings controls.
- Present any connection/retry messaging only where it reflects existing permission behavior.

### 15. Appearance (`/appearance`)

Create the board’s appearance selection screen:

- Light and Dark are selectable visual cards with a clear current selection.
- Changes take effect immediately and persist as they do today.
- Do not add the mock’s System option because it is not an existing feature.

### 16. Feedback (`/feedback`)

Replace the plain navigation link with an in-app handoff page:

- Back navigation, “We’d love your feedback!” copy, and a single Send Feedback action.
- The action opens the existing feedback form in its current destination. No feedback content is captured within CMU Study.

### 17. Privacy Policy (`/privacy`)

Restyle the existing policy into the board’s mobile-friendly accordions:

- Introductory privacy statement plus collapsible sections for Calendar Permissions, Calendar Event Handling, Data We Collect, Data Retention, Revoking Calendar Access, and Contact & Support.
- Preserve the policy’s current commitments and the external permissions/revocation link. The content may be edited only for clarity and structure, never to change the stated data practices.

## Refactor sequence

1. **Inventory and protect behavior.** Capture the current user flows and acceptance cases for onboarding, profile updates, course add/remove, filtering, group creation, joining/leaving, editing, blocking, calendar outcomes, restricted access, and sign-out. Treat the current behavior as the compatibility baseline.
2. **Establish the design system.** Replace global visual tokens and shared control styles; build reusable wordmark, page frame, buttons, tags, form fields, date/time fields, list rows, metadata lines, avatar treatment, empty states, confirmation states, and responsive layouts.
3. **Replace navigation and app shell.** Implement the desktop rail and mobile bottom navigation, move theme and block destinations out of the old profile page, and preserve all active-state, auth, and responsive behaviors.
4. **Split onboarding.** Build the two step routes and maintain the profile/course completion gate. Verify a first-time student cannot reach the app until a course is present.
5. **Build finder and detail flow.** Convert Finder and My Groups to compact list views, create a route-backed detail experience, and reattach all existing filters, membership status, live refresh, participant profile, and group-unavailable handling.
6. **Build group mutation flows.** Rework create, success, and edit into the new layouts while retaining validation, eligibility, success/error feedback, and calendar outcomes.
7. **Build secondary screens.** Implement Blocked Students, Appearance, Calendar Settings, Feedback handoff, Access Restricted, and accordion Privacy screens using existing actions/content only.
8. **Quality pass.** Test all light/dark pages at desktop and mobile widths; validate keyboard and screen-reader behavior; check layouts with long titles, long course names, missing avatars, empty lists, full groups, failed calendar actions, and denied group access.

## Acceptance checklist

- A student can enter through CMU SSO, complete academic details, add at least one course, and reach Group Finder.
- Each existing study-group rule produces the same result in the new UI: filtering, future-only visibility, full-group handling, join/leave, auto-delete when empty, one-participant edit availability, and calendar outcomes.
- Blocking maintains its current confirmation, membership-removal, visibility, future-join, and unblock behavior.
- Participant summaries expose the same profile information and no additional personal data.
- Light and Dark mode persist and work across public, onboarding, and authenticated screens.
- All navigation destinations in the new design are reachable on desktop and mobile; no navigation item leads to an unsupported feature.
- The public landing, restricted-access, feedback, and privacy experiences align with the board while preserving current actions and stated policy.
- The result is visually distinct from the current product and responsive, yet introduces no new account, search, notification, calendar-management, or theme-mode features.
