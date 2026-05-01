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
        <p className="font-serif text-[clamp(1.8rem,8.4vw,2.35rem)] font-medium leading-[1.08] tracking-[-0.035em] text-text">
          {siteContent.couple.groomName} &amp; {siteContent.couple.brideName}
        </p>
        <div className="balanced-copy editorial-body mt-8 space-y-5">
          {storyContent.messageParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
