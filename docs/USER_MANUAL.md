# User Manual

This is a map-based visual directory for keeping track of members and where they live.
Leaders can add and edit members, organize them into groups, and see how far apart
people are. Everyone who's logged in can see the full directory — you don't need to
be a leader to look people up, only to make changes.

## Signing in

There are no passwords. Instead:

1. Open the app and type your email address on the sign-in screen.
2. Click **Send login link**.
3. Check your email (or, if you're a leader testing the app before real email
   sending is set up, ask whoever runs the server to check its console log — see the
   note at the bottom of this manual) for a message with a login link.
4. Click that link. It opens the app and logs you in — no password to remember.

The link expires after 15 minutes and can only be used once. If it's expired, just
go back to the sign-in screen and request a new one.

You only need to do this once every 7 days or so — after that, you'll just need to
sign in again the same way.

**You can't sign yourself up.** Only an existing leader can give you access (see
"Inviting someone" below). If you try to sign in with an email nobody has invited
yet, the app won't tell you that outright — it just won't send you a link, so
nothing will show up in your inbox.

## Roles

- **Leader**: can see everyone, and can add, edit, and remove members and
  organizations.
- **Member**: can see everyone (same full directory — addresses, contact info,
  everything), but can't add, edit, or remove anything. Think of it as "read-only."

If you're logged in as a member, you'll notice a few things are simply missing
compared to what's described below — no "Actions" menu, no Edit/Remove buttons on
people's pins, and clicking the map doesn't do anything. That's expected; that's what
read-only means here.

## The map

Everyone in the directory who has an address shows up as a pin on the map. Click a
pin to see that person's name, address, and whether they're marked active or lost
contact.

### Adding a member (leaders only)

Click anywhere on the map where that person lives. A form pops up already knowing
the location you clicked — fill in their name, address, phone, email, and (if you've
created any) which organization they belong to, then **Save**. Their pin appears
right where you clicked.

There's no separate "Add Member" button — clicking the map *is* how you add someone,
at the location you click.

### Editing a member, or marking them lost contact

Click their pin, then **Edit** in the popup. You can change any of their details
here. There's also a **Lost contact** checkbox — check it and enter the date they
were last known to be active, and their pin will show that status from then on.
Unchecking it marks them active again.

### Removing a member

Click their pin, then **Remove**. This deletes them — there's no undo, so double
check before confirming.

## Organizations

Leaders can group members into organizations (Region, Headquarter, Area, or
District). To create one: open the menu bar in the top-left corner, click
**Actions**, then **Add Organization**. Give it a name and pick its type. Once
created, it shows up as an option when adding or editing a member.

## Finding the distance between members

Click the ruler icon in the top-right corner of the map. A small panel opens where
you can pick a starting point — either a specific member, or "My Location" (this
asks your browser for permission to use your current location) — and it lists
everyone else, sorted by how far away they are.

## Importing and exporting the roster

The **File** menu in the top-left menu bar handles the whole directory as a file:

- **Export as CSV** downloads everyone currently in the directory as a CSV file —
  useful as a backup, or for opening in a spreadsheet.
- **Export as GeoJSON** downloads the same roster as a GeoJSON `FeatureCollection`
  (`members.geojson`) — useful for loading into mapping tools like QGIS, Leaflet, or
  Mapbox. Each member is a point feature; members you haven't placed on the map yet
  are still included, just without a location.
- **Import** lets you pick a CSV file (in the same format the CSV export produces).
  It replaces the current directory with the file's contents. If a row's ID already
  matches someone in the directory (for example, re-importing a file you just
  exported), that row is skipped rather than creating a duplicate — you'll see a
  message telling you how many rows were skipped.

## Inviting someone (leaders only)

Open the menu bar's **Actions** menu, then **Invite Account**. Enter their email and
pick whether they should be a **Member** (read-only) or **Leader** (read + write),
then **Send invite**. They can now sign in with that email using the steps at the
top of this manual — there's nothing else they need to do to accept the invite.

## Other things in the interface

- **Top-left**: the menu bar (File, Actions, About). "File" has import/export and
  the language picker. "About" has some external links (not part of the directory
  itself). "Actions" has the Organizations and Map windows, plus — for leaders —
  Add Organization and Invite Account.
- **Top-right, layers icon**: switch which map style/base layer is shown. Cosmetic
  only — doesn't affect your data.
- **Bottom-left**: a "Filter Range" slider and zoom controls. The slider limits how
  many members are shown on the map at once — mainly useful right after importing a
  very large CSV, so the map doesn't try to render everyone at once. Drag it to the
  right (or hit "Enable"/"Disable") to show more.

## If something goes wrong

- **"Can't connect"** screen after signing in: the app can't reach the server right
  now — could be the server is restarting, or your internet dropped. Your login
  isn't lost; click **Retry** once the connection is back and you'll land right back
  where you were, no need to sign in again.
- **A banner at the top saying "Couldn't load data"**: the map loaded, but fetching
  the member/organization list failed. Click **Retry** on the banner. If it keeps
  happening, the server may be down — check with whoever manages it.
- **A pop-up alert after saving/editing/removing something**: this means that
  specific action failed (not the whole app) — usually either a connection hiccup
  (try again) or, less commonly, that your account doesn't have permission for that
  action.
- **Login link says "Invalid or expired"**: links only work once and expire after 15
  minutes. Just request a fresh one from the sign-in screen.
- **The distance panel doesn't show "My Location"**: your browser may have blocked
  location access, or your device couldn't get a location fix. You can still pick
  any member as the starting point instead.

### Note for whoever runs the server

Login links are currently only logged to the server's own console, not actually
emailed — see `docs/PHASE_3_REPORT.md` for why (no email provider is wired up yet).
Until that's set up, you'll need to check the server console to get someone's login
link on their behalf, or set up real email sending.
