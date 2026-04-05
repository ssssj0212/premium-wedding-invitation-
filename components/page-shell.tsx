import { siteContent } from "@/content/site";
import { accountsContent } from "@/content/accounts";
import { contactContent } from "@/content/contact";
import { faqContent } from "@/content/faq";
import { galleryPhotos } from "@/content/photos";
import { storyContent } from "@/content/story";
import { CountdownSection } from "@/components/sections/countdown-section";
import { FaqSection } from "@/components/sections/faq-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { GiftSection } from "@/components/sections/gift-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InfoSection } from "@/components/sections/info-section";
import { InvitationSection } from "@/components/sections/invitation-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ShareSection } from "@/components/sections/share-section";
import { RsvpSection } from "@/components/sections/rsvp-section";
import { StickyNav } from "@/components/sticky-nav";

export function PageShell() {
  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-4 text-text sm:px-6 lg:px-8"
      style={
        {
          ["--color-accent" as string]: siteContent.theme.accentColor
        }
      }
    >
      <StickyNav />
      <HeroSection />
      <div className="mt-5 flex flex-col gap-5 sm:mt-7 sm:gap-7">
        <InvitationSection />
        <InfoSection />
        <CountdownSection />
        <GallerySection photos={galleryPhotos} />
        <ContactSection contacts={contactContent.contacts} />
        {siteContent.features.showGiftSection &&
        accountsContent.groups.some((group) => group.entries.length > 0) ? (
          <GiftSection />
        ) : null}
        {faqContent.items.length > 0 ? <FaqSection items={faqContent.items} /> : null}
        {siteContent.features.showRsvpSection && siteContent.links.rsvpUrl ? <RsvpSection /> : null}
        <ShareSection />
      </div>
    </main>
  );
}
