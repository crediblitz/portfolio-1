export type WorkExperience = {
  id: string;
  job_title: string;
  company_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string;
};

export type Education = {
  id: string;
  degree: string;
  institution_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  grade_or_gpa: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  live_url: string;
  source_code_url: string;
};

export type Portfolio = {
  first_name: string;
  last_name: string;
  headline: string;
  city: string;
  country: string;
  phone: string;
  primary_domain: string;
  is_student: boolean;
  is_freelancer: boolean;
  is_career_switcher: boolean;
  summary: string;
  profile_photo_url: string;
  pronouns: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  personal_website_url: string;
  dribbble_url: string;
  contact_email: string;
  technical_skills: string[];
  soft_skills: string[];
  work_experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  template_preference: string;
};

export type PortfolioContent = {
  metadata: {
    lang: string;
    title: string;
    description: string;
  };
  portfolio: Portfolio;
  ui: {
    anchors: Record<string, string>;
    date: {
      locale: string;
      month: Intl.DateTimeFormatOptions["month"];
      year: Intl.DateTimeFormatOptions["year"];
      separator: string;
      present: string;
    };
    profile: {
      fallback_invalid_markers: string[];
      badge: string;
      name_separator: string;
      headline_source_separator: string;
      headline_display_separator: string;
    };
    nav: Array<{ label: string; href: string }>;
    badges: Array<{ field: keyof Portfolio; match?: string; label: string }>;
    social_links: Array<{
      label: string;
      href_field: keyof Portfolio;
      icon: "contact" | "git" | "globe" | "message";
    }>;
    hero: {
      eyebrow: string;
      open_to_builds: string;
      poster_lines: string[];
      signal_label: string;
      signal_text: string;
    };
    terminal: { lines: string[] };
    about: { eyebrow: string; title: string };
    stats: {
      eyebrow: string;
      items: Array<{ value?: string; value_from?: string; label: string }>;
    };
    education: { title_lines: string[] };
    projects: {
      featured_label: string;
      selected_label: string;
      live_label: string;
      source_label: string;
      tech_separator: string;
    };
    experience: { eyebrow: string; title: string };
    stack: {
      eyebrow: string;
      title: string;
      clusters: Array<{ label: string; skills: string[] }>;
    };
    soft_skills: {
      eyebrow: string;
      title: string;
      number_prefix: string;
    };
    contact: { eyebrow: string; title: string };
  };
};
