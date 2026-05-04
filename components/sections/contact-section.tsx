import { Phone } from "lucide-react";
import { ContactEntry } from "@/content/contact";
import { CopyButton } from "@/components/copy-button";
import { SectionShell } from "@/components/section-shell";

type ContactSectionProps = {
  contacts: ContactEntry[];
};

export function ContactSection({ contacts }: ContactSectionProps) {
  return (
    <SectionShell id="contacts">
      <div className="mx-auto w-full text-center">
        <p className="ornament mb-4 inline-flex font-sans luxury-kicker text-accent">
          Registry & Gifts
        </p>
        <h2 className="mx-auto max-w-[19.6rem] font-serif text-[clamp(1.31rem,5.65vw,1.62rem)] font-medium leading-[1.14] tracking-[-0.025em] text-text">
          <span className="block">Your presence at our</span>
          <span className="block">celebration is the greatest gift.</span>
        </h2>
        <p className="balanced-copy mx-auto mt-4 max-w-[20.4rem] font-sans text-[clamp(13.8px,3.55vw,14.8px)] leading-[1.55] tracking-[-0.01em] text-muted">
          <span className="block">If you would still like to send a gift, our</span>
          <span className="block">Zelle information is listed below.</span>
        </p>
      </div>
      <div className="mx-auto mt-8 grid w-full max-w-full gap-4">
        {contacts.map((contact) => (
          <div
            key={`${contact.role}-${contact.name}`}
            className="section-panel rounded-[24px] p-5"
          >
            <div className="flex items-center gap-3 text-accent">
              <Phone className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.24em]">{contact.role}</p>
            </div>
            <p className="mt-4 text-lg font-medium text-text">{contact.name}</p>
            {contact.phone ? (
              <p className="mt-2 break-all text-sm font-medium text-[#b35f48]">{contact.phone}</p>
            ) : null}
            {contact.note ? <p className="mt-3 text-sm leading-7 text-muted">{contact.note}</p> : null}
            {contact.zelle ? (
              <div className="editorial-divider mt-4 pt-4">
                <p className="luxury-kicker text-muted">Zelle</p>
                <p className="mt-3 break-all text-sm font-medium text-accent">{contact.zelle}</p>
              </div>
            ) : null}
            <div className="mt-4 grid gap-3">
              {contact.phone ? <CopyButton value={contact.phone} label="Copy Number" /> : null}
              {contact.zelle ? <CopyButton value={contact.zelle} label="Copy Zelle" /> : null}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
