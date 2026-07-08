"use client";

import { hackathonSponsors } from "@/content/hackathon";
import RenderLogoMark from "@/components/RenderLogoMark";
import { Partner } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

function SponsorLogo({ sponsor }: { sponsor: Partner }) {
  const logoClassName = `${sponsor.logoHeight ?? "h-7"} ${sponsor.logoWidth ?? "w-auto"} object-contain transition-transform duration-200 group-hover:scale-105`;

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-4 flex shrink-0 items-center rounded-md px-5 py-3 transition-opacity hover:opacity-80 sm:mx-6 sm:px-6"
      style={{ backgroundColor: sponsor.logoBg ?? "#ffffff" }}
      aria-label={sponsor.name}
    >
      {sponsor.name === "Render" ? (
        <RenderLogoMark className={`${logoClassName} text-[#141414]`} />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={sponsor.logo} alt="" className={logoClassName} />
      )}
    </a>
  );
}

export default function SponsorMarquee() {
  const { t } = useI18n();

  if (hackathonSponsors.length === 0) {
    return null;
  }

  const loopedSponsors = [...hackathonSponsors, ...hackathonSponsors];

  return (
    <section className="space-y-5" aria-labelledby="sponsor-marquee-heading">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
          {t("hackathon.sponsorsEyebrow")}
        </p>
        <h2
          id="sponsor-marquee-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          {t("hackathon.sponsorsTitle")}
        </h2>
      </div>

      <div className="sponsor-marquee relative w-full overflow-hidden rounded-2xl border border-cursor-accent-orange/25 bg-cursor-bg-dark py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-cursor-bg-dark via-cursor-bg-dark/80 to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-cursor-bg-dark via-cursor-bg-dark/80 to-transparent sm:w-28" />

        <div className="sponsor-marquee-track flex w-max">
          {loopedSponsors.map((sponsor, index) => (
            <SponsorLogo key={`${sponsor.name}-${index}`} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
}
