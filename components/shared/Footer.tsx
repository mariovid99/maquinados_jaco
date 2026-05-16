import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { FooterContent } from "@/types/content";

interface Props {
  data: FooterContent;
  contactPhone: string;
  contactEmail: string;
  contactAddr1: string;
  contactAddr2: string;
}

export default function Footer({ data, contactPhone, contactEmail, contactAddr1, contactAddr2 }: Props) {
  return (
    <footer className="relative overflow-hidden" style={{ background: "#0A1342" }}>
      {/* Red diagonal top accent */}
      <div className="h-2 w-full" style={{ background: "#B90001" }} />

      {/* Dot pattern background */}
      <div className="absolute inset-0 dot-grid opacity-10" aria-hidden="true" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">

          {/* Col 1 — Logo + tagline */}
          <div className="lg:col-span-1">
            <div className="relative h-[56px] w-[198px] mb-5">
              <Image
                src="/logos/jaco-full.png"
                alt="Maquinados JACO"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="283px"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">{data.tagline}</p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {data.social_facebook && data.social_facebook !== "#" && (
                <Link href={data.social_facebook} target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-jaco-red transition-colors">
                  <Facebook className="w-4 h-4" />
                </Link>
              )}
              {data.social_instagram && data.social_instagram !== "#" && (
                <Link href={data.social_instagram} target="_blank" rel="noopener noreferrer"
                  aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-jaco-red transition-colors">
                  <Instagram className="w-4 h-4" />
                </Link>
              )}
              {data.social_linkedin && data.social_linkedin !== "#" && (
                <Link href={data.social_linkedin} target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-jaco-red transition-colors">
                  <Linkedin className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3 className="text-white font-display text-lg tracking-widest mb-5">{data.nav_links.title}</h3>
            <ul className="space-y-2">
              {data.nav_links.items.map((item, i) => (
                <li key={`${item.href}-${i}`}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 inline-flex items-center gap-1 group">
                    <span className="w-3 h-px bg-jaco-red opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h3 className="text-white font-display text-lg tracking-widest mb-5">{data.services_links.title}</h3>
            <ul className="space-y-2">
              {data.services_links.items.map((item, i) => (
                <li key={`${item.href}-${i}`}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 inline-flex items-center gap-1 group">
                    <span className="w-3 h-px bg-jaco-red opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-white font-display text-lg tracking-widest mb-5">CONTACTO</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-jaco-red shrink-0" />
                <span>{contactAddr1}<br />{contactAddr2}</span>
              </li>
              <li>
                <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-jaco-red shrink-0" />
                  {contactPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-jaco-red shrink-0" />
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">{data.copyright}</p>
          <p className="text-white/40 text-xs">{data.designer_text}</p>
        </div>
      </div>
    </footer>
  );
}
