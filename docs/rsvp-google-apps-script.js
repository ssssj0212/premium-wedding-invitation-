/**
 * RSVP Google Apps Script Web App
 *
 * Setup:
 * 1. Open https://script.google.com and create a new project.
 * 2. Paste this file into Code.gs.
 * 3. Deploy > New deployment > Web app.
 * 4. Execute as: Me.
 * 5. Who has access: Anyone.
 * 6. Copy the Web app URL and add it to Vercel as RSVP_ENDPOINT.
 */

const SPREADSHEET_ID = "1Rdh6h24wTRjaJ6PBFIlM8okVFuVC2q6eGm-7qasgxu4";
const SHEET_NAME = "Form_Responses";

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
  const headers = [
    "Timestamp",
    "Attending the Wedding",
    "Number of Guests",
    "Guest 1 Full Name",
    "Guest 2-1 Full Name",
    "Guest 2-2 Full Name",
    "Guest 3-1 Full Name",
    "Guest 3-2 Full Name",
    "Guest 3-3 Full Name",
    "Reason"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(body);

    const attendanceStatus = data.attendanceStatus || "";
    const numberOfGuests = data.numberOfGuests || "";
    const guest1Name = data.guest1FullName || "";
    const guest21Name = data.guest21FullName || "";
    const guest22Name = data.guest22FullName || "";
    const guest31Name = data.guest31FullName || "";
    const guest32Name = data.guest32FullName || "";
    const guest33Name = data.guest33FullName || "";
    const reason = data.reason || "";
    const timestamp = data.submittedAt ? new Date(data.submittedAt) : new Date();

    if (attendanceStatus !== "Attending" && attendanceStatus !== "Undecided") {
      return jsonResponse({ ok: false, error: "Invalid attendance status." });
    }

    if (attendanceStatus === "Attending" && !numberOfGuests) {
      return jsonResponse({ ok: false, error: "Missing guest count." });
    }

    if (attendanceStatus === "Attending" && numberOfGuests === "1 person" && !guest1Name) {
      return jsonResponse({ ok: false, error: "Missing guest name." });
    }

    if (attendanceStatus === "Attending" && numberOfGuests === "2 people" && (!guest21Name || !guest22Name)) {
      return jsonResponse({ ok: false, error: "Missing guest name." });
    }

    if (
      attendanceStatus === "Attending" &&
      numberOfGuests === "3 people" &&
      (!guest31Name || !guest32Name || !guest33Name)
    ) {
      return jsonResponse({ ok: false, error: "Missing guest name." });
    }

    if (attendanceStatus === "Undecided" && !reason) {
      return jsonResponse({ ok: false, error: "Missing note." });
    }

    getSheet_().appendRow([
      timestamp,
      attendanceStatus,
      numberOfGuests,
      guest1Name,
      guest21Name,
      guest22Name,
      guest31Name,
      guest32Name,
      guest33Name,
      reason
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : "Unable to save RSVP."
    });
  }
}
