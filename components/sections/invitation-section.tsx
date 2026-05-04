import { storyContent } from "@/content/story";
import { siteContent } from "@/content/site";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

export function InvitationSection() {
  return (
    <SectionShell
      id="invitation"
      className="bg-[linear-gradient(180deg,rgba(255,250,246,0.96),rgba(251,245,239,0.92))]"
    >
      <SectionHeading
        eyebrow="Our Invitation"
        title={storyContent.invitationTitle}
        description={storyContent.invitationSubtitle}
        align="center"
      />
      <div className="mx-auto mt-10 max-w-full text-center">
        <p className="whitespace-nowrap font-serif text-[clamp(1.38rem,6.1vw,1.72rem)] font-medium leading-[1.08] tracking-[-0.025em] text-text">
          {siteContent.couple.groomName} &amp; {siteContent.couple.brideName}
        </p>
        <div className="balanced-copy mt-7 space-y-4 font-sans text-[clamp(15px,3.8vw,16px)] leading-[1.68] tracking-[-0.01em] text-muted">
          {storyContent.messageParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
