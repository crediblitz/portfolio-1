import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  ContactRound,
  GitBranch,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Radio,
  Sparkles,
  Terminal,
} from "lucide-react";
import Image from "next/image";

import { getPortfolioContent } from "@/lib/portfolio-content";
import type { Portfolio, PortfolioContent } from "@/lib/portfolio-types";

export const dynamic = "force-dynamic";

type SocialIconName = PortfolioContent["ui"]["social_links"][number]["icon"];
type IconComponent = typeof Globe2;

function formatDate(value: string, content: PortfolioContent) {
  if (!value) return "";

  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month ?? 1) - 1);

  return new Intl.DateTimeFormat(content.ui.date.locale, {
    month: content.ui.date.month as Intl.DateTimeFormatOptions["month"],
    year: content.ui.date.year as Intl.DateTimeFormatOptions["year"],
  }).format(date);
}

function getInitials(data: Portfolio) {
  return `${data.first_name.at(0) ?? ""}${data.last_name.at(0) ?? ""}`.toUpperCase();
}

function getBadges(data: Portfolio, content: PortfolioContent) {
  return content.ui.badges
    .filter((badge) => {
      const value = data[badge.field as keyof Portfolio];

      if ("match" in badge && badge.match && typeof value === "string") {
        return value.includes(badge.match);
      }

      return Boolean(value);
    })
    .map((badge) => badge.label);
}

function getPathValue(data: Portfolio, path?: string): string | number | undefined {
  if (!path) return undefined;

  const value = path.split(".").reduce<unknown>((current, part) => {
    if (Array.isArray(current) && part === "length") return current.length;
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, data);

  return typeof value === "string" || typeof value === "number" ? value : undefined;
}

function getSocialIcon(icon: SocialIconName) {
  const icons: Record<string, IconComponent> = {
    contact: ContactRound,
    git: GitBranch,
    globe: Globe2,
    message: MessageCircle,
  };

  return icons[icon] ?? Globe2;
}

function getSocialLinks(data: Portfolio, content: PortfolioContent) {
  return content.ui.social_links
    .map((link) => ({
      href: data[link.href_field as keyof Portfolio],
      icon: getSocialIcon(link.icon),
      label: link.label,
    }))
    .filter((link): link is { href: string; icon: ReturnType<typeof getSocialIcon>; label: string } =>
      typeof link.href === "string" && link.href.length > 0,
    );
}

function shouldShowPhoto(url: string, content: PortfolioContent) {
  return (
    Boolean(url) &&
    content.ui.profile.fallback_invalid_markers.every((marker) => !url.includes(marker))
  );
}

function ExternalLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-neutral-900/15 bg-white/75 px-4 text-sm font-black text-neutral-950 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:border-neutral-950 hover:bg-[#fff5cf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef3f35]"
    >
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </a>
  );
}

function PixelTerminal({ content }: { content: PortfolioContent }) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[260px]"
      aria-hidden="true"
    >
      <div className="absolute left-[18%] top-[18%] h-[48%] w-[62%] border-[10px] border-neutral-900 bg-[#e9e1d2] shadow-[14px_14px_0_rgba(18,18,18,0.2)]">
        <div className="m-4 h-[62%] border-4 border-neutral-900 bg-[#223a5f] p-3 text-[8px] font-black uppercase leading-3 text-[#81ffd5]">
          {content.ui.terminal.lines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-[16%] left-[9%] h-[22%] w-[74%] border-[8px] border-neutral-900 bg-[#d3c7b7]" />
      <div className="absolute bottom-[8%] left-[2%] h-[12%] w-[92%] border-[8px] border-neutral-900 bg-[#b7aa99]" />
      <div className="absolute right-[12%] top-[5%] size-10 rounded-full border-4 border-neutral-900 bg-[#75f0c6]" />
      <div className="absolute left-[4%] top-[42%] h-8 w-16 -rotate-12 border-4 border-neutral-900 bg-[#fff7d7]" />
    </div>
  );
}

function ProfileMark({
  content,
  data,
}: {
  content: PortfolioContent;
  data: Portfolio;
}) {
  const fullName = [
    data.first_name,
    data.last_name,
  ].join(content.ui.profile.name_separator);

  if (shouldShowPhoto(data.profile_photo_url, content)) {
    return (
      <Image
        src={data.profile_photo_url}
        alt={fullName}
        fill
        unoptimized
        className="object-cover grayscale"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#fff5cf_0_18%,transparent_19%),linear-gradient(135deg,#ef3f35,#ffe35a_45%,#75f0c6)] text-5xl font-black text-neutral-950">
      {getInitials(data)}
    </div>
  );
}

function DateRange({
  content,
  start,
  end,
  current,
}: {
  content: PortfolioContent;
  start: string;
  end: string;
  current: boolean;
}) {
  return (
    <span>
      {formatDate(start, content)}
      {content.ui.date.separator}
      {current ? content.ui.date.present : formatDate(end, content)}
    </span>
  );
}

export default async function Home() {
  const content = await getPortfolioContent();
  const portfolio = content.portfolio;
  const location = [portfolio.city, portfolio.country].filter(Boolean).join(", ");
  const socialLinks = getSocialLinks(portfolio, content);
  const badges = getBadges(portfolio, content);
  const featuredProject = portfolio.projects[0];
  const otherProjects = portfolio.projects.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-[#171918] text-neutral-950">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-[#f8efd9] px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          <a
            href={`#${content.ui.anchors.top}`}
            className="flex items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-neutral-950 bg-[#ffe35a] text-sm font-black">
              {portfolio.first_name.at(0)}
            </span>
            <span className="text-sm font-black uppercase tracking-[0.18em]">
              {portfolio.primary_domain}
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-neutral-700">
            {content.ui.nav.map((item) => (
              <a
                key={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-neutral-950 hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section id={content.ui.anchors.top} className="grid gap-4 lg:grid-cols-[1.55fr_0.9fr]">
          <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[#f7eddd] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.34)] md:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="relative min-h-[340px] overflow-hidden rounded-[1.1rem] border-[3px] border-neutral-950 bg-[#ef7f1a]">
              <ProfileMark content={content} data={portfolio} />
              <div className="absolute inset-x-4 bottom-4 rounded-full border-2 border-neutral-950 bg-[#f8efd9] px-4 py-2 text-center text-xs font-black uppercase tracking-[0.2em]">
                {content.ui.profile.badge}
              </div>
            </div>

            <div className="flex min-h-[340px] flex-col justify-between rounded-[1.1rem] border-[3px] border-neutral-950 bg-[#f8efd9] p-5">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border-2 border-neutral-950 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ef3f35]">
                  {content.ui.hero.eyebrow}
                </p>
                <h1 className="mt-2 max-w-3xl text-[clamp(3.4rem,6.4vw,6rem)] font-black uppercase leading-[0.82] tracking-normal text-neutral-950">
                  {portfolio.first_name}
                  <br />
                  {portfolio.last_name}
                </h1>
                <p className="mt-5 max-w-2xl text-lg font-extrabold leading-7 text-neutral-800">
                  {portfolio.headline.replaceAll(
                    content.ui.profile.headline_source_separator,
                    content.ui.profile.headline_display_separator,
                  )}
                </p>
              </div>

              <div className="mt-8 grid gap-3 border-t-2 border-neutral-950 pt-4 text-sm font-bold text-neutral-800 sm:grid-cols-3">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-[#ef3f35]" aria-hidden="true" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Radio className="size-4 text-[#ef3f35]" aria-hidden="true" />
                  {portfolio.pronouns}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-[#ef3f35]" aria-hidden="true" />
                  {content.ui.hero.open_to_builds}
                </span>
              </div>
            </div>
          </div>

          <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative min-h-[230px] overflow-hidden rounded-[1.5rem] border-[3px] border-[#f8efd9] bg-[linear-gradient(90deg,#ef3f35,#ef7f1a,#ffe35a,#75f0c6,#2aa8ff,#cc4bff)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)]">
              <div className="absolute inset-4 border-2 border-neutral-950/55" />
              <p className="relative text-[clamp(3.2rem,8vw,5.5rem)] font-black leading-[0.85] text-neutral-950">
                {content.ui.hero.poster_lines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div className="rounded-[1.5rem] border-[3px] border-neutral-950 bg-[#75f0c6] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
              <p className="text-xs font-black uppercase tracking-[0.22em]">
                {content.ui.hero.signal_label}
              </p>
              <p className="mt-4 text-2xl font-black leading-tight">
                {content.ui.hero.signal_text}
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="relative overflow-hidden rounded-[1.5rem] border-[3px] border-neutral-950 bg-[#ffe35a] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
            <div className="relative z-10 max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em]">
                {content.ui.about.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(2.7rem,8vw,6.5rem)] font-black uppercase leading-[0.88]">
                {content.ui.about.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-neutral-800">
                {portfolio.summary}
              </p>
            </div>
            <div className="absolute -right-6 bottom-0 hidden w-[34%] min-w-[260px] opacity-95 md:block">
              <PixelTerminal content={content} />
            </div>
          </article>

          <article className="rounded-[1.5rem] border-[3px] border-[#f8efd9] bg-[#ef3f35] p-6 text-[#fff8df] shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffe35a]">
              {content.ui.stats.eyebrow}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {content.ui.stats.items.map((item) => (
                <div key={item.label}>
                  <p className="text-5xl font-black">
                    {item.value ?? getPathValue(portfolio, item.value_from)}
                  </p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {portfolio.education.length > 0 ? (
          <section className="rounded-[1.5rem] border-[3px] border-neutral-950 bg-[#f8efd9] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-end">
              <div>
                <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-neutral-950 bg-[#75f0c6]">
                  <GraduationCap className="size-6" aria-hidden="true" />
                </div>
                <h2 className="text-[clamp(3.5rem,10vw,8rem)] font-black uppercase leading-[0.82]">
                  {content.ui.education.title_lines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
              </div>
              <div className="grid gap-4">
                {portfolio.education.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-4 border-t-[3px] border-neutral-950 pt-5 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <h3 className="text-3xl font-black leading-none">
                        {item.institution_name}
                      </h3>
                      <p className="mt-2 text-lg font-extrabold text-neutral-700">
                        {item.degree}
                      </p>
                      {item.grade_or_gpa ? (
                        <p className="mt-2 text-sm font-bold">{item.grade_or_gpa}</p>
                      ) : null}
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-neutral-700">
                      <DateRange
                        content={content}
                        start={item.start_date}
                        end={item.end_date}
                        current={item.is_current}
                      />
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id={content.ui.anchors.work} className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          {featuredProject ? (
            <article className="rounded-[1.5rem] border-[3px] border-neutral-950 bg-[#ef7f1a] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.24em]">
                {content.ui.projects.featured_label}
              </p>
              <h2 className="mt-5 text-[clamp(2.8rem,7vw,5.9rem)] font-black uppercase leading-[0.84]">
                {featuredProject.title}
              </h2>
              <p className="mt-6 text-lg font-bold leading-8 text-neutral-900">
                {featuredProject.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featuredProject.tech_stack
                  .split(content.ui.projects.tech_separator)
                  .map((tech) => (
                    <span
                      key={tech.trim()}
                      className="rounded-full border-2 border-neutral-950 bg-[#f8efd9] px-3 py-1 text-xs font-black uppercase tracking-[0.1em]"
                    >
                      {tech.trim()}
                    </span>
                  ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ExternalLinkButton href={featuredProject.live_url}>
                  {content.ui.projects.live_label}
                </ExternalLinkButton>
                <ExternalLinkButton href={featuredProject.source_code_url}>
                  {content.ui.projects.source_label}
                </ExternalLinkButton>
              </div>
            </article>
          ) : null}

          <div className="grid gap-4">
            {portfolio.work_experience.length > 0 ? (
              <article className="rounded-[1.5rem] border-[3px] border-[#f8efd9] bg-[#222826] p-6 text-[#f8efd9] shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#75f0c6]">
                      {content.ui.experience.eyebrow}
                    </p>
                    <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                      {content.ui.experience.title}
                    </h2>
                  </div>
                  <BriefcaseBusiness className="size-10 text-[#ffe35a]" aria-hidden="true" />
                </div>
                <div className="mt-8 grid gap-5">
                  {portfolio.work_experience.map((item) => (
                    <div key={item.id} className="border-t border-[#f8efd9]/25 pt-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h3 className="text-2xl font-black">{item.job_title}</h3>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffe35a]">
                          <DateRange
                            content={content}
                            start={item.start_date}
                            end={item.end_date}
                            current={item.is_current}
                          />
                        </p>
                      </div>
                      <p className="mt-1 text-sm font-black uppercase tracking-[0.16em] text-[#75f0c6]">
                        {item.company_name}
                      </p>
                      <p className="mt-4 text-base font-semibold leading-7 text-[#f8efd9]/80">
                        {item.responsibilities}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {otherProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-[1.5rem] border-[3px] border-neutral-950 bg-[#75f0c6] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em]">
                      {content.ui.projects.selected_label}
                    </p>
                    <h3 className="mt-3 text-4xl font-black uppercase leading-none">
                      {project.title}
                    </h3>
                  </div>
                  <Code2 className="size-10" aria-hidden="true" />
                </div>
                <p className="mt-5 text-base font-bold leading-7 text-neutral-800">
                  {project.description}
                </p>
                <p className="mt-5 text-sm font-black uppercase tracking-[0.16em]">
                  {project.tech_stack}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ExternalLinkButton href={project.live_url}>
                    {content.ui.projects.live_label}
                  </ExternalLinkButton>
                  <ExternalLinkButton href={project.source_code_url}>
                    {content.ui.projects.source_label}
                  </ExternalLinkButton>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id={content.ui.anchors.stack} className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.5rem] border-[3px] border-neutral-950 bg-[#f8efd9] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em]">
                  {content.ui.stack.eyebrow}
                </p>
                <h2 className="mt-3 text-5xl font-black uppercase leading-none sm:text-6xl">
                  {content.ui.stack.title}
                </h2>
              </div>
              <Terminal className="size-10 text-[#ef3f35]" aria-hidden="true" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.ui.stack.clusters.map((cluster) => {
                const availableSkills = cluster.skills.filter((skill) =>
                  portfolio.technical_skills.includes(skill),
                );

                if (availableSkills.length === 0) return null;

                return (
                  <div
                    key={cluster.label}
                    className="border-t-[3px] border-neutral-950 pt-4"
                  >
                    <h3 className="text-2xl font-black uppercase">{cluster.label}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {availableSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#f8efd9]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {portfolio.soft_skills.length > 0 ? (
            <article className="rounded-[1.5rem] border-[3px] border-[#f8efd9] bg-[#2aa8ff] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.24em]">
                {content.ui.soft_skills.eyebrow}
              </p>
              <h2 className="mt-3 text-5xl font-black uppercase leading-none sm:text-6xl">
                {content.ui.soft_skills.title}
              </h2>
              <div className="mt-8 grid gap-3">
                {portfolio.soft_skills.map((skill, index) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between border-t-2 border-neutral-950 py-3 text-lg font-black"
                  >
                    <span>{skill}</span>
                    <span className="text-sm uppercase tracking-[0.2em]">
                      {content.ui.soft_skills.number_prefix}
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <footer
          id={content.ui.anchors.contact}
          className="mb-4 grid gap-4 rounded-[1.5rem] border-[3px] border-[#f8efd9] bg-[#111312] p-6 text-[#f8efd9] shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffe35a]">
              {content.ui.contact.eyebrow}
            </p>
            <h2 className="mt-3 max-w-3xl text-[clamp(2.8rem,8vw,6.3rem)] font-black uppercase leading-[0.84]">
              {content.ui.contact.title}
            </h2>
          </div>
          <div className="flex flex-col justify-between gap-8">
            <div className="grid gap-3 text-base font-bold">
              {portfolio.phone ? (
                <a
                  href={`tel:${portfolio.phone}`}
                  className="inline-flex items-center gap-3 transition hover:text-[#75f0c6]"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  {portfolio.phone}
                </a>
              ) : null}
              {portfolio.contact_email ? (
                <a
                  href={`mailto:${portfolio.contact_email}`}
                  className="inline-flex items-center gap-3 transition hover:text-[#75f0c6]"
                >
                  <Mail className="size-5" aria-hidden="true" />
                  {portfolio.contact_email}
                </a>
              ) : null}
            </div>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex size-12 items-center justify-center rounded-full border-2 border-[#f8efd9]/30 bg-[#f8efd9]/10 text-[#f8efd9] transition hover:-translate-y-0.5 hover:border-[#75f0c6] hover:bg-[#75f0c6] hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe35a]"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </footer>
      </div>
    </main>
  );
}
