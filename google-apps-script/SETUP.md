1. Open the Google Sheet:
   https://docs.google.com/spreadsheets/d/1yLuOjg_yEke48JMrlQ89EQvifk4V7ObFiuUrZ10nKeA/edit
2. Open Extensions > Apps Script.
3. Replace the script content with the full code from `code.ts` (project root) or `google-apps-script/code.gs` (same code).
4. Click Save. Optionally run the `setup` function once to create the RSVP and Wishes sheets now
   (otherwise they are created automatically, with headers, on the first submission).
5. Click Deploy > New deployment.
6. Select type: Web app.
7. Execute as: Me.
8. Who has access: Anyone.
9. Deploy, approve the permissions, and copy the Web App URL (ends with `/exec`).
10. Paste the URL into `GOOGLE_SCRIPT_URL` in `src/config.ts`, then commit and push.

Notes:
- If you change the Apps Script code later, use Deploy > Manage deployments > Edit > New version.
- RSVP sheet columns: Timestamp, Full Name, Invited As, Guests, Attendance, Dietary Notes.
- Wishes sheet columns: Timestamp, Guest Name, Message.
