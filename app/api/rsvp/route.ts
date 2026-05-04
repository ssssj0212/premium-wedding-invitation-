import { NextResponse } from "next/server";

type Attendance = "Attending" | "Undecided";
type GuestCount = "1" | "2" | "3";

type RsvpPayload = {
  attendance?: Attendance;
  guestCount?: GuestCount | "";
  guestNames?: string[];
  guestEntrees?: string[];
  note?: string;
};

type AppsScriptPayload = {
  attending: Attendance;
  numberOfGuests: "" | "1 person" | "2 people" | "3 people";
  guest1Name: string;
  guest2Name: string;
  guest3Name: string;
  reason: string;
  message: string;
  entrees: string;
  source: "us-wedding-site";
};

type AppsScriptResponse = {
  ok?: boolean;
  error?: string;
};

const appsScriptEndpoint =
  "https://script.google.com/macros/s/AKfycbyE5n5XuZ4c3UakjxFxm1GQ2KFT1uKGTM5tEmaIsvBkpLCVlu7e8cwZqnjP0-hbK76W/exec";

const guestCountLabels: Record<GuestCount, AppsScriptPayload["numberOfGuests"]> = {
  "1": "1 person",
  "2": "2 people",
  "3": "3 people"
};

function jsonError(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function isAttendance(value: unknown): value is Attendance {
  return value === "Attending" || value === "Undecided";
}

function isGuestCount(value: unknown): value is GuestCount {
  return value === "1" || value === "2" || value === "3";
}

function buildAppsScriptPayload(payload: Required<Pick<RsvpPayload, "attendance">> & RsvpPayload): AppsScriptPayload {
  const normalizedNames = Array.isArray(payload.guestNames)
    ? payload.guestNames.map((name) => name.trim())
    : [];

  if (payload.attendance === "Undecided") {
    return {
      attending: "Undecided",
      numberOfGuests: "",
      guest1Name: "",
      guest2Name: "",
      guest3Name: "",
      reason: payload.note?.trim() ?? "",
      message: "",
      entrees: "",
      source: "us-wedding-site"
    };
  }

  const normalizedEntrees = Array.isArray(payload.guestEntrees)
    ? payload.guestEntrees.map((entree) => entree.trim())
    : [];

  return {
    attending: "Attending",
    numberOfGuests: guestCountLabels[payload.guestCount as GuestCount],
    guest1Name: normalizedNames[0] ?? "",
    guest2Name: normalizedNames[1] ?? "",
    guest3Name: normalizedNames[2] ?? "",
    reason: "",
    message: "",
    entrees: normalizedNames
      .map((name, index) => (name ? `${name}: ${normalizedEntrees[index] ?? ""}` : ""))
      .filter(Boolean)
      .join("\n"),
    source: "us-wedding-site"
  };
}

async function submitToAppsScript(payload: AppsScriptPayload) {
  console.log("Submitting RSVP payload to Apps Script:", {
    endpoint: appsScriptEndpoint,
    payload
  });

  const response = await fetch(appsScriptEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  let result: AppsScriptResponse;

  try {
    result = (await response.json()) as AppsScriptResponse;
  } catch (error) {
    console.error("RSVP Apps Script returned invalid JSON:", error);
    throw new Error("Sorry, your RSVP could not be submitted. Please try again or contact us.");
  }

  if (!response.ok || result.ok !== true) {
    console.error("RSVP Apps Script rejected the request:", {
      status: response.status,
      result
    });
    throw new Error(result.error || "Sorry, your RSVP could not be submitted. Please try again or contact us.");
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RsvpPayload;

    if (!isAttendance(payload.attendance)) {
      return jsonError("Please choose an RSVP status.");
    }

    if (payload.attendance === "Attending") {
      if (!isGuestCount(payload.guestCount)) {
        return jsonError("Please choose the number of guests.");
      }

      const requiredCount = Number(payload.guestCount);
      const guestNames = Array.isArray(payload.guestNames)
        ? payload.guestNames.slice(0, requiredCount).map((name) => name.trim())
        : [];
      const guestEntrees = Array.isArray(payload.guestEntrees)
        ? payload.guestEntrees.slice(0, requiredCount).map((entree) => entree.trim())
        : [];

      if (guestNames.length !== requiredCount || guestNames.some((name) => !name)) {
        return jsonError("Please enter each guest name.");
      }

      if (guestEntrees.length !== requiredCount || guestEntrees.some((entree) => !entree)) {
        return jsonError("Please choose an entree for each guest.");
      }
    } else if (!payload.note?.trim()) {
      return jsonError("Please leave a short note.");
    }

    const appsScriptPayload = buildAppsScriptPayload(payload as Required<Pick<RsvpPayload, "attendance">> & RsvpPayload);
    await submitToAppsScript(appsScriptPayload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RSVP submission failed:", error);
    return jsonError("Sorry, your RSVP could not be submitted. Please try again or contact us.", 500);
  }
}
