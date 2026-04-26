import { siteContent } from "@/content/site";
import { accountsContent } from "@/content/accounts";
import { contactContent } from "@/content/contact";
import { faqContent } from "@/content/faq";
import { galleryPhotos } from "@/content/photos";
import { FaqSection } from "@/components/sections/faq-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { GiftSection } from "@/components/sections/gift-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InfoSection } from "@/components/sections/info-section";
import { InvitationSection } from "@/components/sections/invitation-section";
import { ContactSection } from "@/components/sections/contact-section";
import { RsvpSection } from "@/components/sections/rsvp-section";
import { StickyNav } from "@/components/sticky-nav";

export function PageShell() {
  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-[clamp(0.75rem,3.2vw,2rem)] pb-[clamp(3rem,8vw,4rem)] pt-[clamp(0.75rem,3vw,1rem)] text-text"
      style={
        {
          ["--color-accent" as string]: siteContent.theme.accentColor
        }
      }
    >
      <StickyNav />
      <HeroSection />
      <div className="mt-[clamp(1.1rem,3vw,1.75rem)] flex flex-col gap-[clamp(1.1rem,3vw,1.75rem)]">
        {siteContent.features.showRsvpSection && siteContent.links.rsvpUrl ? <RsvpSection /> : null}
        <InfoSection />
        <InvitationSection />
        <GallerySection photos={galleryPhotos} />
        <ContactSection contacts={contactContent.contacts} />
        {siteContent.features.showGiftSection &&
        accountsContent.groups.some((group) => group.entries.length > 0) ? (
          <GiftSection />
        ) : null}
        {faqContent.items.length > 0 ? <FaqSection items={faqContent.items} /> : null}
      </div>
    </main>
  );
}
