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
      <SectionHeading
        eyebrow="Contact"
        title="If you need any help on the day."
        description="Direct phone and optional Zelle details for the day."
        align="center"
      />
      <div className="mx-auto mt-8 grid w-full max-w-2xl gap-4 lg:max-w-none lg:grid-cols-2">
        {contacts.map((contact) => (
          <div
            key={`${contact.role}-${contact.name}`}
            className="section-panel rounded-[24px] p-5"
          >
            <div className="flex items-center gap-3 text-accent">
              <Phone className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.24em]">{contact.role}</p>
            </div>
            <p className="mt-4 text-lg font-semibold text-text">{contact.name}</p>
            {contact.phone ? (
              <p className="mt-2 break-all text-sm font-medium text-[#b35f48]">{contact.phone}</p>
            ) : null}
            {contact.note ? <p className="mt-3 text-sm leading-7 text-muted">{contact.note}</p> : null}
            {contact.zelle ? (
              <div className="editorial-divider mt-4 pt-4">
                <p className="luxury-kicker text-muted">Zelle</p>
                <p className="mt-3 break-all text-sm font-medium text-[#b35f48]">{contact.zelle}</p>
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
