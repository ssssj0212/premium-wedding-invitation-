import { ImageResponse } from "next/og";
import { metaContent } from "@/content/meta";
import { siteContent } from "@/content/site";
import { formatEventTime, formatWeddingDate } from "@/lib/date";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background:
            "linear-gradient(180deg, #fcf8f3 0%, #f5ede4 52%, #f2e7db 100%)",
          color: "#342d28",
          fontFamily: '"Times New Roman", Georgia, serif'
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#b88f73"
          }}
        >
          <span>Wedding Invitation</span>
          <span>New York</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 86,
              lineHeight: 0.95,
              letterSpacing: "-0.05em"
            }}
          >
            {`${siteContent.couple.groomName} & ${siteContent.couple.brideName}`}
          </div>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              fontSize: 30,
              color: "#6f635c"
            }}
          >
            <span>{formatWeddingDate(siteContent.event.date)}</span>
            <span style={{ color: "#b88f73" }}>•</span>
            <span>{formatEventTime(siteContent.event.date, siteContent.event.time)}</span>
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#342d28"
            }}
          >
            {siteContent.event.venue}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#766b63"
          }}
        >
          <div style={{ maxWidth: 780, lineHeight: 1.45 }}>
            {metaContent.ogDescription}
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(88,74,64,0.12)",
              borderRadius: 999,
              padding: "12px 22px",
              color: "#342d28"
            }}
          >
            {siteContent.event.address}
          </div>
        </div>
      </div>
    ),
    size
  );
}
