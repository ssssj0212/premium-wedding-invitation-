import { siteContent } from "@/content/site";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

export function AdditionalInfoSection() {
  const items = siteContent.additionalInfo.items.filter(
    (item) => item.label.trim() && item.value.trim()
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <SectionShell id="additional-info">
      <SectionHeading
        eyebrow="Info"
        title={siteContent.additionalInfo.title}
        description=""
        align="center"
      />
      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="section-panel rounded-[24px] px-5 py-4"
          >
            <p className="luxury-kicker text-accent">{item.label}</p>
            <p className="balanced-copy editorial-body mt-3 whitespace-pre-line">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
