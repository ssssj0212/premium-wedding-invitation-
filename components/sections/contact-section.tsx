import { Phone } from "lucide-react";
import { ContactEntry } from "@/content/contact";
import { CopyButton } from "@/components/copy-button";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

type ContactSectionProps = {
  contacts: ContactEntry[];
};

export function ContactSection({ contacts }: ContactSectionProps) {
  return (
    <SectionShell id="contacts">
      <div className="[&_h2]:max-w-[18rem] [&_h2]:text-[clamp(1.34rem,5.9vw,1.68rem)] [&_h2]:leading-[1.12] [&_p.editorial-body]:max-w-[18rem] [&_p.editorial-body]:font-sans [&_p.editorial-body]:text-[clamp(14px,3.6vw,15px)] [&_p.editorial-body]:leading-[1.55]">
        <SectionHeading
          eyebrow="Registry & Gifts"
          title="Your presence at our celebration is the greatest gift."
          description="If you would still like to send a gift, our Zelle information is listed below."
          align="center"
        />
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
