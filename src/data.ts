import { projects } from "./projects"

export type { Project } from "./projects"

export type Media = {
  src: string
  alt: string
  label: string
}


export type Experience = {
  slug: string
  /** Timeline position — lower numbers appear first. */
  order: number
  dates: string
  role: string
  organization: string
  /** Optional link to the organization's site. */
  organizationUrl?: string
  type?: string
  location?: string
  tools?: string
  /** One-line result shown on the home timeline. */
  impact: string
  whatIDid: string[]
  result: string[]
  learned: string[]
  /** Slug of a related project in projects.ts. */
  relatedProject?: string
  images: Media[]
}

// Files in /public are served under the Vite base path ("/").
const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`

export const siteData = {
  person: {
    name: "Hazel Oh",
    nameNote: "현서 · Hyeonseo",
    roleLine: {
      prefix: "I am",
      toggleLabel: "Show all roles",
      listLabel: "Roles",
      roles: [
        { label: "interaction designer", color: "#F6D5E8" },
        { label: "UX/UI designer", color: "#DDD6FB" },
        { label: "prototyper", color: "#CFE3FC" },
        { label: "maker", color: "#F6D5E8" },
        { label: "creative technologist", color: "#DDD6FB" },
      ],
    },
    photo: {
      src: asset("images/profile-cutout.png"),
      alt: "Hazel Oh",
      label: "Profile photo",
    },
    eyebrow: "Interaction designer · San Francisco, CA",
    statement:
      "Interaction designer who loves turning unconventional ideas into things people can use.",
    supporting:
      "HCI and Art & Technology student at Sogang University, now at San Francisco State University as a KORUS Scholar. Seeking UX/Product Design internships in the Bay Area for Winter/Spring 2027.",
    email: {
      label: "hsoh0408@gmail.com",
      href: "mailto:hsoh0408@gmail.com",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hazelhyeonseooh",
    },
  },
  about: {
    eyebrow: "About",
    title: "Hi, I’m Hazel.",
    bio: [
      "My Korean name is Hyeonseo, but Hazel stuck, and it’s become part of who I am.",
      "I’m an interaction designer who learns by making. Whether it’s a screen, a physical controller, or a workshop for kids, I like to build something, put it in front of people, and see what happens.",
      "I study Art & Technology and Convergence Software at Sogang University in Seoul, and I’m spending this year at San Francisco State University as a KORUS Scholar. My projects move between screens and the physical world: AR glasses that give children real-time social cues, a two-player car that only moves when both players work together, and an investigator tool that checks witness statements against a 3D scene.",
      "What connects them is a focus on people who need support in the moment, and a habit of turning unusual ideas into interfaces that feel simple. I care about clear information hierarchy, honest design that never makes a guess look like a fact, and small moments of delight.",
      "I’m looking for a UX/Product Design internship in the Bay Area for Winter/Spring 2027.",
    ],
    education: {
      title: "Education",
      items: [
        {
          school: "San Francisco State University",
          program: "Visual Communication Design",
          detail: "Exchange Student, KORUS Scholar",
          dates: "Aug 2026 – Present",
          note: "",
        },
        {
          school: "Sogang University",
          program:
            "B.A. candidate, Art & Technology and Convergence Software",
          detail: "Double Major",
          dates: "Mar 2023 – Aug 2027",
          note: "GPA 3.94/4.3",
        },
      ],
    },
    skills: {
      title: "Skills",
      groups: [
        {
          label: "Design",
          value:
            "Interaction Design, UI/UX Design, Prototyping, User Flow Design",
        },
        { label: "Making", value: "Arduino, laser cutting, 3D printing" },
        { label: "Code", value: "React, TypeScript (with Claude Code)" },
        {
          label: "Tools",
          value:
            "Figma, Figma Make, Claude Code, Adobe Photoshop, After Effects, Unity",
        },
        { label: "Languages", value: "Korean (native), English (fluent)" },
      ],
    },
    contactTitle: "Contact",
  },
  awards: {
    title: "Awards",
    items: [
      {
        name: "Top Excellence Award",
        detail: "2nd of 4 tiers, 17 teams",
        context:
          "Inquiry Community Program, Sogang University Center for Teaching and Learning",
        date: "Jan 2026",
      },
      {
        name: "Excellence Award",
        detail: "",
        context: "Eco Sogang Contest, Sogang University",
        date: "",
      },
    ],
  },
  landing: {
    prompt: "Where would you like to go?",
    portfolio: {
      label: "Portfolio",
      note: "Selected work, experience, and more about me",
    },
    linkedin: { note: "Career history and updates" },
    resume: { note: "One-page PDF" },
    newTab: "opens in a new tab",
  },
  resume: {
    label: "Resume",
    href: asset("Hazel-Oh-Resume.pdf"),
    ariaLabel: "Open Hazel Oh’s resume in a new tab",
  },
  navigation: {
    homeLabel: "Home",
    menuLabel: "Open navigation",
    closeLabel: "Close navigation",
    items: [
      { label: "Work", href: "/work" },
      { label: "Experience", href: "/home#experience" },
      { label: "About", href: "/home#about" },
    ],
  },
  home: {
    introLabel: "Introduction",
    selectedWork: {
      eyebrow: "Selected work",
      title: "Projects grounded in real people and real constraints.",
      description:
        "Four selected projects across UX/UI design, XR accessibility, web services, and tangible interaction.",
      seeAllLabel: "See all work",
    },
    experience: {
      eyebrow: "Experience",
      title: "Learning by making, testing, and collaborating.",
    },
  },
  workPage: {
    eyebrow: "Portfolio",
    title: "Work",
    introduction:
      "A collection of product, research, and interaction design projects shaped by real people and practical constraints.",
    selectedEyebrow: "Selected projects",
    selectedTitle: "Three in-depth case studies.",
    selectedDescription:
      "End-to-end work across public services, learning, and personal wellbeing.",
    otherEyebrow: "Other projects",
    otherTitle: "More explorations and collaborations.",
    otherDescription:
      "Additional work in accessibility, community tools, and cultural experiences.",
  },
  labels: {
    skipToContent: "Skip to content",
    primaryNavigation: "Primary navigation",
    projectNavigation: "Project navigation",
    seeMore: "See more",
    backToWork: "Back to selected work",
    backToExperience: "Back to experience",
    role: "Role",
    team: "Team",
    timeline: "Timeline",
    tools: "Tools",
    problem: "The problem",
    research: "Research & insights",
    decisions: "Key design decisions",
    finalDesign: "Final design",
    outcome: "Outcome & what I learned",
    rejected: "What I rejected",
    prototype: "Prototype",
    contents: "On this page",
    summary: "Summary",
    summaryProblem: "Problem",
    summaryWhatIDid: "What I did",
    summaryResult: "Result",
    projectLinks: "Project links",
    videoPlaceholder: "Video",
    imageComingSoon: "Image coming soon",
    previous: "Previous project",
    next: "Next project",
    whatIDid: "What I did",
    result: "What changed as a result",
    learned: "What I learned",
    experienceType: "Type",
    location: "Location",
    organization: "Organization",
    relatedProject: "Related project",
    impact: "Impact",
    closeExperience: "Close",
    openFullScreen: "View full screen",
    closeFullScreen: "Close full-screen view",
    previousExperience: "Previous",
    nextExperience: "Next",
    experienceNavigation: "Experience navigation",
    optionalImages: "Selected work",
    notFoundTitle: "Page not found",
    notFoundCode: "404",
    notFoundBody:
      "The page you’re looking for may have moved or no longer exists.",
    returnHome: "Return home",
    sectionNumbers: ["01", "02", "03", "04", "05"],
    symbols: {
      previous: "←",
      next: "→",
    },
  },
  footer: {
    prompt: "Let’s make something useful.",
    note: "Seeking UX/Product Design internships in the Bay Area for Winter/Spring 2027.",
    copyright: "Portfolio of Hazel Oh · Designed and built with care.",
  },
  projects,
  experiences: [
    {
      slug: "beyond-camp-content-creator",
      order: 1,
      dates: "Feb 2025 – Present",
      role: "Social Media Content Creator",
      organization: "Beyond Camp",
      type: "Freelance",
      location: "Seoul, South Korea (remote)",
      tools: "After Effects, video production, Instagram",
      impact:
        "Produced 30+ videos and Reels for parents, including one that reached 130,000 views.",
      whatIDid: [
        "Planned and produced 30+ videos and Reels for parents to promote camp programs and drive sign-ups.",
        "Scripted, filmed, and edited an interview video with returning campers.",
        "Created promotional Reels to raise awareness of camp activities and encourage participation.",
      ],
      result: [
        "The returning-camper interview video reached 130,000 views and brought more families to info sessions.",
        "Enrollment grew 76%, from 37 students (Winter 2024) to 65 (Summer 2026). My content was one part of the promotion behind that growth.",
      ],
      learned: [
        "Design for a specific audience. Content for parents has to answer their questions and build trust, not just look appealing.",
      ],
      images: [],
    },
    {
      slug: "smilegate-future-lab-facilitator",
      order: 2,
      dates: "Apr 2025 – Jul 2025",
      role: "Facilitator for Creation Workshops",
      organization: "Smilegate Future Lab",
      type: "Contract",
      location: "Seongnam, South Korea (on-site)",
      tools: "Photoshop, Google Maps",
      impact:
        "Designed and ran a hands-on workshop where kids tied to a partner built towers together.",
      whatIDid: [
        "Facilitated weekly creative workshops for about 10 lower-grade elementary students, using guiding questions to help them develop their own ideas.",
        "Designed and ran an original one-hour team-building workshop: with one hand tied to a partner, students worked together to build the tallest structure.",
        "Edited students’ artwork in Photoshop for visual consistency and combined the pieces into one collaborative Google Maps project.",
        "Supported creative learning that encouraged children to explore ideas through hands-on making.",
      ],
      result: [
        "Students gained confidence leading their own creative projects.",
        "The tied-hands workshop turned a physical constraint into a reason to communicate and solve problems together.",
      ],
      learned: [
        "A physical constraint can create collaboration. I later explored the same idea in DuoDrive, where neither player can drive the car alone.",
      ],
      relatedProject: "duodrive",
      images: [],
    },
    {
      slug: "beyond-camp-education-mentor",
      order: 3,
      dates: "Jan 2025 – Feb 2025",
      role: "Education Mentor",
      organization: "Beyond Camp",
      type: "Contract",
      location: "Johor Bahru, Malaysia (on-site)",
      impact:
        "Mentored elementary students through a 26-day international camp in Malaysia.",
      whatIDid: [
        "Mentored elementary school students throughout a 25-night, 26-day international camp, supporting their daily activities and learning.",
        "Helped students with limited English develop a project-based learning (PBL) theater production inspired by The Wizard of Oz.",
      ],
      result: [
        "Students with limited English took part in a full theater production.",
      ],
      learned: [],
      images: [],
    },
  ] satisfies Experience[] as Experience[],
}
