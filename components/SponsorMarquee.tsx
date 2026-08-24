"use client";

import { hackathonCommunityPartners, hackathonSponsors } from "@/content/hackathon";
import RenderLogoMark from "@/components/RenderLogoMark";
import { Partner } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

function PartnerLogo({ partner }: { partner: Partner }) {
  const logoClassName = `${partner.logoHeight ?? "h-7"} ${partner.logoWidth ?? "w-auto"} object-contain transition-transform duration-200 group-hover:scale-105`;

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-4 flex shrink-0 items-center rounded-md px-5 py-3 transition-opacity hover:opacity-80 sm:mx-6 sm:px-6"
      style={{ backgroundColor: partner.logoBg ?? "#ffffff" }}
      aria-label={partner.name}
    >
      {partner.name === "Render" ? (
        <RenderLogoMark className={`${logoClassName} text-[#141414]`} />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={partner.logo} alt="" className={logoClassName} />
      )}
    </a>
  );
}

function loopedForMarquee(partners: Partner[]): Partner[] {
  const copiesPerHalf = partners.length >= 5 ? 1 : Math.ceil(6 / Math.max(partners.length, 1));
  const half = Array.from({ length: copiesPerHalf }, () => partners).flat();
  return [...half, ...half];
}

function PartnerBand({
  sectionId,
  headingId,
  eyebrow,
  title,
  partners,
}: {
  sectionId?: string
  headingId: string
  eyebrow: string
  title: string
  partners: Partner[]
}) {
  if (partners.length === 0) {
    return null;
  }

  return (
    <section id={sectionId} className="space-y-5" aria-labelledby={headingId}>
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          {title}
        </h2>
      </div>

      <div className="sponsor-marquee relative w-full overflow-hidden rounded-2xl border border-cursor-accent-orange/25 bg-cursor-bg-dark py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-cursor-bg-dark via-cursor-bg-dark/80 to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-cursor-bg-dark via-cursor-bg-dark/80 to-transparent sm:w-28" />

        <div className="sponsor-marquee-track flex w-max">
          {loopedForMarquee(partners).map((partner, index) => (
            <PartnerLogo key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SponsorMarquee() {
  const { t } = useI18n();

  return (
    <div className="space-y-16">
      <PartnerBand
        headingId="sponsor-marquee-heading"
        eyebrow={t("hackathon.sponsorsEyebrow")}
        title={t("hackathon.sponsorsTitle")}
        partners={hackathonSponsors}
      />
      <PartnerBand
        sectionId="community-partners"
        headingId="community-partners-heading"
        eyebrow={t("hackathon.communityPartnersEyebrow")}
        title={t("hackathon.communityPartnersTitle")}
        partners={hackathonCommunityPartners}
      />
    </div>
  );
}
