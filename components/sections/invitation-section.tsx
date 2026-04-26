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
      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="font-serif text-[1.65rem] leading-[1.06] tracking-[-0.04em] text-text sm:text-[2.35rem] lg:text-[2.75rem] lg:whitespace-nowrap">
          {siteContent.couple.groomName} &amp; {siteContent.couple.brideName}
        </p>
        <div className="mx-auto mt-6 h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(184,143,115,0.55),transparent)]" />
        <div className="balanced-copy editorial-body mt-8 space-y-5">
          {storyContent.messageParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
