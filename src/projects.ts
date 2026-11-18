/**
 * Project content, from Content/p/projects.md.
 *
 * - Empty fields, "없음", and anything still marked "확인 필요" are left out.
 * - Nothing from the "비공개 / 주의사항" notes is published.
 * - Images are referenced by the file name listed in the content notes. Files
 *   that don't exist yet in src/assets/projects/ render as labeled
 *   placeholders until a file with that name is added (see projectImages.ts).
 */

export type ImageRef = {
  /** File name from the content notes. The extension doesn't matter. */
  file: string
  alt: string
  /** Shown on the placeholder while the file is missing. */
  label: string
  /** Card crop focus (CSS object-position), e.g. "50% 30%". */
  focus?: string
  /** Show the whole image at its own aspect ratio instead of cropping it. */
  uncropped?: boolean
}

export type ListItem =
  | string
  | {
      /** Bold lead-in, e.g. "Time limit". */
      label?: string
      text?: string
      items?: ListItem[]
    }

export type Decision = {
  title: string
  text: string
  items?: ListItem[]
  image?: ImageRef
  /** Extra images shown after `image`. */
  images?: ImageRef[]
  /** "What I rejected". Only set when the content has a confirmed value. */
  rejected?: string
}

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: ListItem[] }
  | { type: "steps"; items: ListItem[] }
  | { type: "decisions"; items: Decision[] }
  | { type: "table"; caption: string; columns: string[]; rows: string[][] }
  | { type: "image"; image: ImageRef }
  | { type: "video"; youtubeId: string; title: string }
  /** A small-headed image that opens full-screen when clicked. */
  | { type: "lightbox"; heading: string; image: ImageRef }

export type Section = {
  id: string
  title: string
  blocks: Block[]
}

export type Project = {
  slug: string
  selected: boolean
  order: number
  title: string
  subtitle: string
  /** 한 줄 요약, shown under the title on the detail page. */
  summaryLine: string
  /** 홈 화면 한 줄 설명. */
  homeDescription: string
  /** Work 탭 설명. */
  workDescription: string
  tags: string[]
  thumbnail: ImageRef
  hero?: ImageRef
  /** Role, team, timeline, tools, type, award — only the fields that exist. */
  meta: { label: string; value: string }[]
  /** Non-video links, shown as buttons. */
  links: { label: string; href: string }[]
  summary: { problem: string; whatIDid: string; result: string }
  /** Small print under the header (e.g. an affiliation disclaimer). */
  disclaimer?: string
  sections: Section[]
}

const image = (file: string, alt: string, label: string): ImageRef => ({
  file,
  alt,
  label,
})

const rashomonWorkspace = image(
  "rashomon-workspace.png",
  "Rashomon workspace: a 3D model of the corner store with witness and suspect figures, a timeline with rows for each person and props, the Witnesses filter and Events tab, and the Transcript drawer showing the full statement",
  "Full workspace",
)
const cueyHero = image(
  "cuey-hero.png",
  "A girl in round yellow glasses in a classroom, surrounded by CUEY's AR cue panels: Social Cue, Topic Suggestion, Action, Reward, and Speech Guide",
  "CUEY key visual",
)
const duodriveControllers = image(
  "duodrive-controllers.png",
  "Close-up of the left and right tilt controllers",
  "Left and right controllers",
)
const buggedTitleScreen = image(
  "bugged-title-screen.png",
  "Bugged to Death title screen with the pixel-art logo and START and ALBUM buttons",
  "Title screen",
)
const ideaRoOnboarding = image(
  "idea-ro-onboarding.png",
  "IDEA-RO onboarding page: the headline “아이디어를 창업의 길로” with live program stats, and two track cards, a light Track 01 card for idea validation and a dark Track 02 card for documents and program management",
  "Two-track onboarding screen",
)
const kyoboAsIsToBe = image(
  "kyobo-as-is-to-be.png",
  "Original and redesigned Kyobo Library screens side by side",
  "Before and after",
)
const nogosanHikeGroup = image(
  "nogosan-hike-group.png",
  "Participants and the team on the Nogosan trail in winter coats, making heart gestures around the expedition sign",
  "Group photo on the hike",
)
const nogosanPoster = {
  ...image(
    "nogosan-poster.png",
    "Minimal Nogosan expedition poster in bold black type over a faint mountain silhouette: “같이 노고산 오르실 분 구합니다…” (Looking for people to climb Nogosan together…), with a joking plea and the hike’s date and meeting point",
    "Promotional poster",
  ),
  focus: "50% 58%",
}

const unsortedProjects: Project[] = [
  {
    slug: "rashomon",
    selected: true,
    order: 1,
    title: "Rashomon",
    subtitle: "Investigator Workspace for Witness Testimony",
    summaryLine:
      "An interface that checks each part of a testimony against the scene, without judging the witness.",
    homeDescription:
      "Checks witness statements against a 3D model of the scene, and asks questions instead of judging.",
    workDescription:
      "An investigator tool that turns a witness statement into events in a measured 3D model of the scene, then flags claims the room rules out: what someone could see, where they could walk, and how long it would take. It never scores credibility. As the designer and frontend developer on a 3-person team at Cal Hacks 13.0, I designed the information hierarchy, timeline, and flag system, and built the UI on top of the real backend in 36 hours.",
    tags: ["UX/UI Design", "Frontend", "Hackathon"],
    thumbnail: rashomonWorkspace,
    hero: rashomonWorkspace,
    meta: [
      {
        label: "Role",
        value:
          "Designer & frontend developer: information architecture, state design, right panel, drawers, timeline UI, prop data, and presentation. User interview.",
      },
      {
        label: "Team",
        value:
          "3 people (3D engine and backend · statement extraction and voice agent · UX and frontend UI)",
      },
      { label: "Timeline", value: "Oct 23–25, 2026 (36 hours)" },
      {
        label: "Tools",
        value:
          "Figma Community, Figma Make, GitHub, Claude Code, ChatGPT, React, TypeScript (team stack: Three.js / react-three-fiber, SpacetimeDB, Claude API, Cartesia)",
      },
      { label: "Type", value: "Hackathon · Cal Hacks 13.0" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/iamab0b/rashomon" },
      // The Figma Make prototype link is held back until it's confirmed to
      // be publicly viewable (see the private content notes).
    ],
    summary: {
      problem:
        "Investigators have to compare what witnesses say with what was physically possible in the room, across several accounts that may disagree.",
      whatIDid:
        "Interviewed someone who had given a police statement, designed the workspace’s information hierarchy and timeline, and built the frontend UI connected to the real backend.",
      result:
        "A working demo built in 36 hours, where every event links back to the words it came from and impossible claims are flagged with a neutral question.",
    },
    sections: [
      {
        id: "problem",
        title: "The problem",
        blocks: [
          {
            type: "paragraph",
            text: "Witness statements are full of claims about space and time: where someone stood, what they saw, how fast someone moved. Checking each claim against the scene is slow, and when several witnesses disagree, it’s hard to see where and how their accounts differ.",
          },
          {
            type: "paragraph",
            text: "Rashomon turns a statement into a 3D reconstruction. A deterministic check, not the AI, tests each event against the measured room: could she see him from there, and could he cover that distance in that time? When the room rules a claim out, Rashomon doesn’t mark the witness wrong. It names the obstacle, asks one neutral question, and keeps both versions on record.",
          },
          {
            type: "image",
            image: image(
              "rashomon-sightline.png",
              "Rashomon showing a sightline flag: in the 3D scene the chips shelf stands between the customer and the suspect, and the open flag card explains that the shelf blocks the line of sight and suggests a neutral question to ask",
              "Sightline blocked by a shelf",
            ),
          },
        ],
      },
      {
        id: "interview",
        title: "Interview & guiding principle",
        blocks: [
          {
            type: "paragraph",
            text: "I interviewed someone who had given a police statement. The most important rule from that interview: a guess must never look like a fact. This shaped how the interface shows uncertainty, and why it asks questions instead of passing judgment.",
          },
        ],
      },
      {
        id: "decisions",
        title: "Key design decisions",
        blocks: [
          {
            type: "decisions",
            items: [
              {
                title: "A timeline that shows uncertainty",
                text: "Events sit as boxes on a timeline, in a separate row for each person, so it’s always clear who is doing what and when. When the start or end of an event is only estimated, that edge is drawn as a wave instead of a straight line, so an uncertain time never looks exact.",
                image: image(
                  "rashomon-timeline-wave.png",
                  "Close-up of the timeline with rows for Customer, Suspect, Clerk, and props, where event boxes with estimated start or end times have wavy edges instead of straight ones",
                  "Wavy timeline edge",
                ),
              },
              {
                title: "One color per person, everywhere",
                text: "Each person in the scene keeps the same color across the timeline, event cards, and flags, so investigators can follow someone through the whole interface at a glance.",
              },
              {
                title: "A separate Flags tab for what needs attention",
                text: "Instead of mixing problems into the event list, I created a Flags tab that collects every point worth questioning: a claimed sightline blocked by a shelf, or two witnesses whose accounts don’t match. Investigators can step through them with Previous flag and Next flag.",
                image: image(
                  "rashomon-flags-tab.png",
                  "Two flag cards side by side: a hard sightline flag saying the chips shelf blocks the view, with a suggested question, and a soft contradiction flag comparing two witnesses who place the suspect in different spots, with a question for each",
                  "Flags tab",
                ),
              },
              {
                title: "Witnesses as a filter",
                text: "With several witnesses, investigators can view one account, hide one, or choose a few to compare, so they can see how different people describe the same moment.",
              },
              {
                title: "Tabs arranged by hierarchy, not as a flat list",
                text: "The first Figma Make version placed every tab side by side as equals. It showed everything, but not how things related. I restructured the panel around the investigator’s workflow:",
                items: [
                  {
                    label: "Main",
                    text: "Flags and Events, the primary review tabs",
                  },
                  {
                    label: "Above the main panel",
                    text: "Witnesses, which work as a filter",
                  },
                  {
                    label: "To the far right",
                    text: "Transcript and History, which show the details of the selected event",
                  },
                  {
                    label: "Separate",
                    text: "Add statement, since it’s a different task from reviewing",
                  },
                ],
                image: image(
                  "rashomon-before-after.png",
                  "Before and after, labeled above each panel: the first Figma Make panel with Flags, Events, History, and Witnesses as equal tabs, next to the restructured panel with the Witnesses filter on top, Flags and Events as main tabs, and the Transcript drawer to the right",
                  "Flat tabs vs. restructured panel",
                ),
              },
            ],
          },
        ],
      },
      {
        id: "final-design",
        title: "Final design",
        blocks: [
          {
            type: "list",
            items: [
              "3D scene with Overview, Claimed sightline, and witness POV views",
              "Timeline with rows for each person and props, playback speed control, and flag navigation",
              "Event cards with time, an Estimated Time tag, the action, and links to the source sentences in the statement",
              "Flags and Events tabs, a Witnesses filter, and Transcript, History, and Add statement drawers",
            ],
          },
          {
            type: "video",
            youtubeId: "dqd5Da_Tg48",
            title: "Rashomon demo video",
          },
        ],
      },
      {
        id: "design-to-code",
        title: "From design to code",
        blocks: [
          {
            type: "paragraph",
            text: "As the only designer and frontend developer, I had no time for a separate design-to-code handoff, so I made the handoff code instead of a spec.",
          },
          {
            type: "steps",
            items: [
              {
                label: "Ideation (Figma Community, 20 min)",
                text: "Studied how real apps place tabs, top bars, dropdowns, and toggles to write better prompts.",
              },
              {
                label: "Prototyping (Figma Make, 15 min each round)",
                text: "Described the whole app first, then each tab one by one.",
              },
              {
                label: "Handoff (GitHub, 10 min each round)",
                text: "Pushed the Make project to GitHub, and Claude Code applied it to our repository, connected to the real backend. Every large change went through this loop, more than three times in total. I used ChatGPT to turn my restructuring reasoning into a precise Make prompt.",
              },
              {
                label: "Code (Claude Code, 50 min)",
                text: "Once the structure held, I tuned colors, positions, and details directly in code with real data and the 3D scene.",
              },
            ],
          },
          {
            type: "image",
            image: image(
              "rashomon-workflow.png",
              "Diagram of the design-to-code workflow: Figma Community, Figma Make, GitHub, and Claude Code",
              "Design-to-code workflow",
            ),
          },
        ],
      },
      {
        id: "outcome",
        title: "Outcome",
        blocks: [
          {
            type: "paragraph",
            text: "A working demo connected to the real backend, presented at Cal Hacks 13.0.",
          },
        ],
      },
      {
        id: "learned",
        title: "What I learned",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "Structure before polish",
                text: "I spent 40 minutes polishing details before the layout was final, and every structural change undid that work.",
              },
              {
                label: "Next time",
                text: "As more interactions were added, the layout kept breaking, and I eventually rebuilt the screen in Claude Code from scratch. Next time, I’d lock the layout earlier and plan room for new interactions.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cuey",
    selected: true,
    order: 2,
    title: "CUEY",
    subtitle: "Assistive XR Glasses for Children",
    summaryLine:
      "Assistive XR glasses for children with Social Communication Disorder.",
    homeDescription:
      "Hands-free AR cues that help children with social communication difficulties navigate real conversations.",
    workDescription:
      "An assistive AR glasses interface for children with Social Communication Disorder. CUEY reads the social situation in real time and gives gentle, hands-free visual cues: who is speaking, how others feel, when to talk, and what to say. A friendly character and a traffic-light metaphor keep guidance simple enough for children to follow mid-conversation.",
    tags: ["XR", "Accessibility", "UX/UI Design"],
    // Same key visual for both: cropped toward the girl's face on cards,
    // shown in full at the top of the detail page.
    thumbnail: { ...cueyHero, focus: "52% 30%" },
    hero: { ...cueyHero, uncropped: true },
    meta: [
      { label: "Role", value: "UI design, character design" },
      { label: "Team", value: "4 people" },
      { label: "Timeline", value: "Nov 2025 – Feb 2026" },
      { label: "Tools", value: "Figma" },
      {
        label: "Type",
        value: "Course project · Submitted to the iF Design Student Award",
      },
    ],
    links: [],
    summary: {
      problem:
        "Children with social communication difficulties practice social scenarios in advance, but pre-learned scripts break down in unpredictable, real-time conversations.",
      whatIDid:
        "Designed the AR glasses UI and the “Cuey” character that delivers real-time social cues.",
      result:
        "A concept design and video prototype of a hands-free social support system, submitted to the iF Design Student Award.",
    },
    sections: [
      {
        id: "problem",
        title: "The problem",
        blocks: [
          {
            type: "paragraph",
            text: "Social Communication Disorder (SCD) affects children’s ability to use language and nonverbal cues appropriately. Children with SCD often struggle to interpret facial expressions, tone of voice, gestures, and conversational timing, and to follow implicit social rules such as turn-taking and staying on topic. This can make everyday interactions overwhelming and lead to social isolation and lower self-confidence.",
          },
          {
            type: "image",
            image: image(
              "cuey-before-after.png",
              "Before and after: a confused boy left out of his friends' conversation, then the same boy wearing CUEY glasses and joining in happily",
              "Before and after illustration",
            ),
          },
        ],
      },
      {
        id: "insight",
        title: "Key insight",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "The gap in social learning",
                text: "Children practice social scenarios before entering real settings, but pre-learned scripts can’t account for unpredictable, real-time social dynamics. Support needs to happen in the moment, not only before it.",
              },
            ],
          },
        ],
      },
      {
        id: "decisions",
        title: "Key design decisions",
        blocks: [
          {
            type: "decisions",
            items: [
              {
                title: "No manual operation",
                text: "All cues appear automatically, hands-free, so children stay focused on the person in front of them instead of the interface.",
              },
              {
                title: "A child-friendly traffic-light metaphor",
                text: "Green, yellow, and red signals show when to speak, pause, or listen, and indicate the other person’s emotional state, using a concept children already know.",
                image: image(
                  "cuey-traffic-light.png",
                  "Three turn-taking traffic lights: green with a speaking icon for talk, yellow with a switch icon for pause, and red with an ear icon for listen",
                  "Traffic-light signals",
                ),
              },
              {
                title: "A virtual friend, “Cuey”",
                text: "Guidance comes from a gentle character rather than a system, so it feels like encouragement instead of correction.",
                image: image(
                  "cuey-character.png",
                  "Cuey, a soft white cloud-like character with a smiling face, small arms raised, and two little feet",
                  "Cuey character",
                ),
              },
            ],
          },
        ],
      },
      {
        id: "final-design",
        title: "Final design",
        blocks: [
          {
            type: "image",
            image: image(
              "cuey-features.png",
              "CUEY interface overview: two children talking in a classroom, seen through the glasses, with callouts for the five features: emotion indicator, speaker highlighter, friendly helper, behavior instructions, and turn-taking signal",
              "Feature overview",
            ),
          },
          { type: "paragraph", text: "Three feature groups:" },
          {
            type: "list",
            items: [
              {
                label: "Social Cue Tracer",
                items: [
                  {
                    label: "Emotion Indicator",
                    text: "shows whether each friend’s emotional state is positive, neutral, or negative.",
                  },
                  {
                    label: "Speaker Highlighter",
                    text: "marks the active speaker so the child knows where to focus.",
                  },
                ],
              },
              {
                label: "Real-time Behavior Guidance",
                items: [
                  {
                    label: "Turn-taking Signal",
                    text: "a traffic light that shows when to speak, listen, and switch turns.",
                  },
                  {
                    label: "Cue Guidance Panel",
                    text: "real-time support for verbal expression (e.g., “Repeat after me: I’m sorry for interrupting. Could you please continue?”), nonverbal expression (e.g., “Copy the face to show empathy”), suggested topics, and actions.",
                  },
                ],
              },
              {
                label: "Behavior Reinforcement",
                items: [
                  {
                    label: "Star Reward System",
                    text: "rewards successful behaviors to build motivation.",
                  },
                  {
                    label: "Conversation Review",
                    text: "a post-interaction summary of successful moments and key takeaways.",
                  },
                ],
              },
            ],
          },
          {
            type: "image",
            image: image(
              "cuey-emotion-indicator.png",
              "Three emotion indicator bars: green with a smiling face for positive, yellow with a neutral face for neutral, and red with a frowning face for negative",
              "Emotion indicators",
            ),
          },
          {
            type: "video",
            youtubeId: "hYEwt_mkgsg",
            title: "CUEY concept video",
          },
        ],
      },
      {
        id: "impact",
        title: "Expected impact",
        blocks: [
          {
            type: "paragraph",
            text: "CUEY works as an invisible scaffold rather than a distraction, translating invisible social signals into accessible, real-time cues so children can build confidence and take part in conversations more naturally.",
          },
          {
            type: "lightbox",
            heading: "Full poster",
            image: image(
              "cuey-poster.png",
              "CUEY project poster with the background, impact, the Cuey persona, and key features: Social Cue Tracer, Real-time Behavior Guidance, and Behavior Reinforcement",
              "Project poster",
            ),
          },
        ],
      },
    ],
  },
  {
    slug: "idea-ro",
    selected: true,
    order: 3,
    title: "IDEA-RO",
    subtitle: "All-in-One Platform for Early Founders",
    summaryLine:
      "An all-in-one platform that uses AI and data to address the pain points of aspiring and early-stage founders.",
    homeDescription:
      "One platform, two tracks: idea validation for aspiring founders, paperwork and deadlines for early startups.",
    workDescription:
      "An AI and data platform that helps founders find government support programs and get through the paperwork. I led the UX and UI design, splitting the service into two tracks for two very different users. For early-stage founders, I designed a deadline dashboard, document status labels, and a side-by-side comparison of up to three programs.",
    tags: ["UX/UI Design", "Dashboard", "Web Service"],
    thumbnail: ideaRoOnboarding,
    hero: ideaRoOnboarding,
    meta: [
      { label: "Role", value: "UX planning, UI design" },
      {
        label: "Team",
        value:
          "5 people (service planning, research, UX/UI design, development)",
      },
      { label: "Timeline", value: "Apr – Jun 2026" },
      { label: "Tools", value: "Figma, Claude Design" },
      {
        label: "Type",
        value: "Course project · AI Convergence Capstone Design",
      },
    ],
    links: [{ label: "Live site", href: "https://idea-ro.site/" }],
    summary: {
      problem:
        "Aspiring founders don’t know if their idea is viable, while early-stage founders are buried in program announcements, eligibility checks, and document deadlines.",
      whatIDid:
        "Defined two target personas, designed a two-track information architecture, and designed the onboarding, home dashboard, program matching, and comparison screens.",
      result: "A live web service at idea-ro.site.",
    },
    sections: [
      {
        id: "problem",
        title: "The problem",
        blocks: [
          {
            type: "paragraph",
            text: "Every year, around 4,800 government support programs are announced in Korea. Founders have to check each one for eligibility, write long business plans, and track required documents and deadlines, often alone. The team’s interviews with founders and startup mentors showed the same pain points: too much scattered information, heavy paperwork, and documents that expire before they’re needed.",
          },
        ],
      },
      {
        id: "personas",
        title: "Target personas",
        blocks: [
          {
            type: "paragraph",
            text: "The two users need completely different things, so a single experience couldn’t serve both well. That was the starting point.",
          },
          {
            type: "list",
            items: [
              {
                label: "Aspiring founder (Persona A: a university student)",
                items: [
                  "Unsure whether the idea has real demand",
                  "Has heard of government support but has no concrete information",
                  "Doesn’t know where to start",
                  { label: "Needs", text: "confidence, and a clear first step" },
                ],
              },
              {
                label:
                  "Early-stage founder (Persona B: a founder in the second year of a startup)",
                items: [
                  "Under cash pressure, worried about next month’s salaries and marketing costs",
                  "Too busy to screen every announcement against eligibility requirements",
                  "Misses deadlines and forgets when documents need to be issued",
                  {
                    label: "Needs",
                    text: "time, and nothing slipping through the cracks",
                  },
                ],
              },
            ],
          },
          // idea-ro-personas.png is held back: the persona photos are sample
          // images, and the notes ask to confirm before using them.
        ],
      },
      {
        id: "two-tracks",
        title: "UX structure: two tracks",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "Onboarding",
                text: "users choose their stage first. Track A (pre-founder) leads to idea validation, and Track B (early-stage) leads to document and program management.",
              },
              {
                label: "Track A",
                text: "similarity and gap analysis of the idea, and an execution roadmap (WBS).",
              },
              {
                label: "Track B",
                text: "program search and browsing, personalized program recommendations, detailed analysis of each program, document management, and calendar-based deadline management.",
              },
            ],
          },
          {
            type: "image",
            image: image(
              "idea-ro-ux-planning.png",
              "UX planning map: the onboarding page branches into Track A for aspiring founders (similarity and gap analysis, execution roadmap) and Track B for early-stage founders (program browsing, personalized recommendations, detailed program analysis, document and schedule management)",
              "Two-track feature map",
            ),
          },
        ],
      },
      {
        id: "decisions",
        title: "Key design decisions",
        blocks: [
          {
            type: "decisions",
            items: [
              {
                title: "Split the service by user stage, starting at onboarding",
                text: "The onboarding page presents two clearly different cards: a light card for “Idea validation” (Track 01, pre-founder) and a dark card for “Documents & program management” (Track 02, early-stage). Each card lists what that track offers, so users can recognize themselves before signing up. A switcher at the top of the sidebar lets users move between tracks at any time.",
                image: ideaRoOnboarding,
              },
              {
                title: "A home dashboard built around deadlines",
                text: "For busy early-stage founders, the home screen shows only what needs attention now: upcoming milestones as D-day cards, documents that have expired or are about to expire with a one-click reissue button, and programs of interest closing within 10 days.",
                image: image(
                  "idea-ro-home-dashboard.png",
                  "Annotated home dashboard: a track switcher and category tabs in the sidebar, D-day milestone cards, expired and expiring documents with reissue buttons, and programs of interest closing soon",
                  "Home dashboard and sidebar",
                ),
              },
              {
                title: "Document status labels",
                text: "Each recommended program shows a label comparing its required documents with the user’s own: “Missing documents,” “Expiring soon,” or “All set.” Users can judge at a glance whether a program is realistic, then open the details to see exactly which documents they have and which they still need.",
                image: image(
                  "idea-ro-status-labels.png",
                  "Program matching tab with Missing, Expiring, and All set document labels on each program card, next to a detailed view of required and owned documents",
                  "Document status labels",
                ),
              },
              {
                title: "Checkbox comparison with a pop-up",
                text: "Each program card has a “Compare” checkbox, so users can collect programs while browsing, like adding items to a cart. A floating bar shows how many are selected. The comparison pop-up places 2–3 programs side by side, with application periods as a timeline and rows for eligibility, required documents, and support type.",
                image: image(
                  "idea-ro-compare.png",
                  "Compare checkboxes on program cards with a floating selection bar, and the comparison pop-up showing programs side by side with deadline timelines, eligibility, required documents, and support type",
                  "Program comparison",
                ),
              },
              {
                title: "A sidebar grouped by purpose",
                text: "Home gives an overview of everything, Explore holds search and analysis, and My Page holds documents, the calendar, and personal settings.",
              },
            ],
          },
        ],
      },
      {
        id: "final-design",
        title: "Final design",
        blocks: [
          {
            type: "list",
            items: [
              "Onboarding page with the two-track choice",
              "Early-stage home dashboard and sidebar",
              "Program matching tab with category filters and document status labels",
              "Program comparison pop-up",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "duodrive",
    selected: true,
    order: 4,
    title: "DuoDrive",
    subtitle: "2-Player Arduino Car",
    summaryLine:
      "A two-player co-op game where teamwork is built into the hardware.",
    homeDescription:
      "A two-player Arduino car that only moves when players tilt and talk together.",
    workDescription:
      "A cooperative block-stacking game played with a wireless car and two custom tilt controllers. Each player drives one side of the car and controls half of the claw, so neither can drive or grab alone. Controls are simple on their own, but syncing with a partner is the real challenge, which turns every round into constant conversation.",
    tags: ["Tangible Interaction", "Arduino", "Game Design"],
    // The thumbnail file is still marked "확인 필요", so the card uses the
    // hero image until one is chosen.
    thumbnail: duodriveControllers,
    hero: duodriveControllers,
    meta: [
      {
        label: "Role",
        value:
          "Controller design and fabrication, Arduino circuit design for the controllers and claw, programming",
      },
      { label: "Team", value: "2 people" },
      { label: "Timeline", value: "May – Jun 2026" },
      {
        label: "Tools",
        value:
          "Arduino Uno, Arduino Fio, XBee (wireless), tilt sensors, buttons, DC and servo motors, 3D printing, laser cutting",
      },
      { label: "Type", value: "Course project · Digital Fabrication" },
    ],
    links: [],
    summary: {
      problem:
        "People are used to passive, one-way digital media, leaving fewer chances for active, two-way communication in physical spaces.",
      whatIDid:
        "Designed and fabricated the tilt controllers, designed the Arduino circuits for the controllers and claw, and wrote the code.",
      result:
        "A working wireless prototype: a 3D-printed car with a claw and two laser-cut tilt controllers.",
    },
    sections: [
      {
        id: "problem",
        title: "The problem",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "The rise of one-way communication",
                text: "People today are heavily accustomed to passive, one-way digital media such as short-form videos and social media, which reduces opportunities for active, reciprocal communication in physical spaces.",
              },
            ],
          },
        ],
      },
      {
        id: "insight",
        title: "Key insight",
        blocks: [
          {
            type: "paragraph",
            text: "Making coordination a physical requirement, rather than an optional strategy, gives players a natural reason to talk.",
          },
        ],
      },
      {
        id: "decisions",
        title: "Key design decisions",
        blocks: [
          {
            type: "decisions",
            items: [
              {
                title: "True co-op, built into the hardware",
                text: "Both players share one machine. Player 1 controls the left wheels, Player 2 the right, and the claw only opens or closes when both players move together. Neither can drive or grab alone.",
                image: image(
                  "duodrive-claw-openclose.png",
                  "Tilting both controllers outward opens the claw, and tilting them inward closes it",
                  "Opening and closing the claw",
                ),
                images: [
                  image(
                    "duodrive-claw-updown.png",
                    "Pressing the left controller's button raises the claw, and pressing the right controller's button lowers it",
                    "Raising and lowering the claw",
                  ),
                ],
              },
              {
                title: "Intuitive tilt controls instead of joysticks",
                text: "Tilting forward and back rolls the wheels, and the tilt angle sets the speed, so the controls feel natural from the first second of play. All the difficulty comes from syncing with a partner, not from learning the controls.",
                image: image(
                  "duodrive-driving-mechanism.png",
                  "Grid of tilt positions for each controller: tilting forward drives that side's wheels forward, holding level stops them, and tilting back drives them backward",
                  "Driving mechanism",
                ),
                // The rejected alternative (rolling the controllers like
                // wheels) is still marked "확인 필요", so it isn't shown.
              },
              {
                title: "Failure as part of the fun",
                text: "Mismatched timing makes the car spin or drop the block. These moments are funny rather than frustrating, which makes players want to try again.",
              },
            ],
          },
        ],
      },
      {
        id: "final-design",
        title: "Final design",
        blocks: [
          {
            type: "paragraph",
            text: "Goal: stack as many blocks as possible together.",
          },
          {
            type: "image",
            image: image(
              "duodrive-playing.png",
              "Two players sitting on the studio floor, each holding a tilt controller and steering the small white car together",
              "Two players driving the car",
            ),
          },
          {
            type: "list",
            items: [
              {
                label: "Wheels",
                text: "each player tilts their controller forward or back to drive their side’s wheels forward, stop, or backward. The more they tilt, the faster the wheels turn.",
              },
              {
                label: "Claw open and close",
                text: "both players tilt their controllers outward at the same time to open the claw, and inward to close it. If only one player moves, nothing happens.",
              },
              {
                label: "Claw up and down",
                text: "the left controller’s button raises the claw, and the right controller’s button lowers it.",
              },
              {
                label: "Hardware",
                text: "a 3D-printed car with 4 DC-motor wheels, a motor driver, and 2 servo motors for the claw, run by an Arduino Uno. Each laser-cut controller has an Arduino Fio, a tilt sensor, and a button. The controllers send commands wirelessly over XBee.",
              },
            ],
          },
          {
            type: "image",
            image: image(
              "duodrive-car.png",
              "The 3D-printed DuoDrive car with yellow wheels lifting a white block in its claw, with another block on the floor",
              "Car and blocks",
            ),
          },
          {
            type: "image",
            image: image(
              "duodrive-inside.png",
              "Inside the car and the controllers: the car's Arduino Uno with an XBee shield, motor driver, batteries, and the servo-driven claw, above the two open laser-cut controllers with their Arduino Fio boards, breadboards, and tilt sensors",
              "Inside the car and controllers",
            ),
          },
          {
            type: "image",
            image: image(
              "duodrive-code.png",
              "Controller code in the Arduino IDE: the loop reads the tilt sensor and button, converts the offsets into move, claw, and button commands, and sends them over serial",
              "Controller code",
            ),
          },
          {
            type: "video",
            youtubeId: "nVfzMGpQzgs",
            title: "DuoDrive video",
          },
        ],
      },
    ],
  },
  {
    slug: "bugged-to-death",
    selected: false,
    order: 5,
    title: "Bugged to Death",
    subtitle: "3D Parkour Game",
    summaryLine:
      "A time-limited 3D revenge game played as a headless cockroach.",
    homeDescription:
      "A headless cockroach’s revenge, with pixel UI and five unlockable endings.",
    workDescription:
      "A single-player, time-limited 3D parkour game. Based on the fact that a cockroach can survive without its head until it dehydrates, the player swaps between new heads to take revenge on the human who crushed it. I designed the pixel UI, logo, and the ending album that rewards players for replaying.",
    tags: ["Game Design", "UI Design", "Unity"],
    thumbnail: buggedTitleScreen,
    hero: buggedTitleScreen,
    meta: [
      { label: "Role", value: "UI design, ending art" },
      { label: "Team", value: "3 people" },
      { label: "Timeline", value: "Sep – Dec 2025" },
      { label: "Tools", value: "Unity, web-based pixel art editor" },
      { label: "Type", value: "Course project · Creative Entrepreneurship" },
    ],
    links: [
      {
        label: "Play in browser",
        href: "https://dainty-meerkat-81ea29.netlify.app",
      },
    ],
    summary: {
      problem:
        "Turn a strange biological fact into a short game that is easy to learn and fun to replay.",
      whatIDid:
        "Designed the pixel UI, logo, in-game HUD, and the ending album with its art for all five endings.",
      result: "A playable web build with five endings that encourage replay.",
    },
    sections: [
      {
        id: "concept",
        title: "Concept",
        blocks: [
          {
            type: "paragraph",
            text: "Cockroaches don’t die right away when their heads are crushed; they survive until they dehydrate. In Bugged to Death, a cockroach loses its head to a drunk human and has 100 seconds to find new heads and take revenge.",
          },
        ],
      },
      {
        id: "game-system",
        title: "Game system",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "Time limit",
                text: "100 seconds. Collecting water drops adds 10 seconds.",
              },
              { label: "Villain", text: "the human has 500 HP." },
              {
                label: "Heads",
                text: "three swappable heads, each with different attack power and cooldown: Mosquito (7 damage, 0.5s), Beetle (30, 3s), and Roboroach (50, 7s).",
              },
              {
                label: "Sudden wake-up",
                text: "when the player attacks, the human sometimes wakes up and attacks back. Getting hit ends the game.",
              },
              {
                label: "Controls",
                text: "WASD to move, Space to jump, left click to attack, 1–3 to change heads.",
              },
            ],
          },
          {
            type: "image",
            image: image(
              "bugged-tutorial.png",
              "“Revenge!!!” tutorial screen explaining the controls",
              "Controls tutorial",
            ),
          },
          {
            type: "image",
            image: image(
              "bugged-wake-up.png",
              "The human wakes up and attacks the player",
              "Sudden wake-up",
            ),
          },
          {
            type: "video",
            youtubeId: "95rcKqtCNt8",
            title: "Bugged to Death gameplay video",
          },
        ],
      },
      {
        id: "decisions",
        title: "Key design decisions (my part)",
        blocks: [
          {
            type: "decisions",
            items: [
              {
                title: "Pixel-art UI over a realistic 3D world",
                text: "I drew every UI element by hand in pixel art to give the game a retro, deliberately absurd tone. The playful style keeps a dark revenge story light and funny, and matches its tongue-in-cheek humor.",
              },
              {
                title: "A HUD that makes the rules visible at a glance",
                text: "The water bar shows remaining survival time, the red bar shows the villain’s HP, and the head slots show each head’s cooldown.",
                image: image(
                  "bugged-hud.png",
                  "Gameplay screen with the water bar, the villain’s HP bar, and the head slots",
                  "In-game HUD",
                ),
              },
              {
                title: "An ending album to encourage replay",
                text: "Five endings unlock based on how the player plays, and locked endings appear behind bars, so players can see what’s left to collect. The album is available from the title screen and at the end of every game.",
                image: image(
                  "bugged-ending-records.png",
                  "Pixel-art Ending Records screen on a brick wall: the unlocked Revenge ending shows a skull-and-knife icon, while Headless, Mosquito King, Beetle King, and Robot King stay locked behind cell bars",
                  "Ending album",
                ),
              },
            ],
          },
        ],
      },
      {
        id: "ending-album",
        title: "Ending album",
        blocks: [
          {
            type: "table",
            caption: "The five endings and how to unlock them",
            columns: ["Ending", "Condition"],
            rows: [
              ["Headless", "Fail to kill the human"],
              ["Revenge", "Kill the human"],
              ["Mosquito King", "Kill the human using only the mosquito head"],
              ["Beetle King", "Kill the human using only the beetle head"],
              ["Robot King", "Kill the human using only the robot head"],
            ],
          },
          {
            type: "image",
            image: image(
              "bugged-endings.png",
              "The Revenge ending screen: the cockroach stands beside the defeated human on the floor, with the Revenge Ending badge and ALBUM and RETRY buttons",
              "Revenge ending screen",
            ),
          },
        ],
      },
    ],
  },
  {
    slug: "kyobo-library-redesign",
    selected: false,
    order: 6,
    title: "Kyobo Library Redesign",
    subtitle: "E-book Lending App",
    summaryLine: "A UI redesign of an e-book lending app.",
    homeDescription:
      "A cleaner, more intuitive UI for a library e-book lending app, for users of all ages.",
    workDescription:
      "A UI redesign of Kyobo Library, an app for borrowing e-books from school, corporate, and public libraries. I simplified the navigation, unified colors and icons, and rewrote confusing labels so users can find and borrow books faster.",
    tags: ["UI Redesign", "Mobile App"],
    thumbnail: kyoboAsIsToBe,
    hero: kyoboAsIsToBe,
    meta: [
      { label: "Role", value: "UI evaluation, UI design, prototyping" },
      { label: "Team", value: "Solo project" },
      { label: "Timeline", value: "Mar – Apr 2025" },
      { label: "Tools", value: "Figma" },
      { label: "Type", value: "Course project · UI/UX Design (midterm)" },
    ],
    // Per the private notes, the Figma prototype link is not published.
    links: [],
    summary: {
      problem:
        "The app’s cluttered navigation, inconsistent visuals, and unclear labels make it hard to find and borrow books.",
      whatIDid:
        "Evaluated the existing UI, analyzed other apps, and redesigned the main screens in a Figma prototype.",
      result:
        "A simpler, unified interface for searching, browsing, and borrowing books.",
    },
    disclaimer: "A student concept redesign, not affiliated with Kyobo.",
    sections: [
      {
        id: "problem",
        title: "The problem",
        blocks: [
          {
            type: "paragraph",
            text: "Kyobo Library lets users borrow and read e-books from libraries run by schools, universities, companies, and local governments. However, its UI is unintuitive:",
          },
          {
            type: "list",
            items: [
              "The navigation bar includes rarely used features such as Library Search and Favorite Libraries, which causes confusion when searching for books.",
              "Labels such as “바로보기 & 다운보기” (“View now & Download to view”) and “우리베스트” (“Our Best”) are hard for some age groups to understand or tell apart.",
              "Colors, spacing, alignment, and icons aren’t consistent, so it’s hard to find things at a glance.",
            ],
          },
          {
            type: "image",
            image: image(
              "kyobo-ui-evaluation.png",
              "Annotated screens showing problems in the original Kyobo Library UI",
              "UI evaluation",
            ),
          },
        ],
      },
      {
        id: "process",
        title: "Process",
        blocks: [
          {
            type: "steps",
            items: [
              "UI evaluation",
              "Analysis of other apps",
              "UI planning and wireframes",
              "Redesign",
              "Prototype",
            ],
          },
        ],
      },
      {
        id: "direction",
        title: "Design direction",
        blocks: [
          {
            type: "list",
            items: [
              "No ads or promotions, since it’s a lending service",
              "Accessible to users of all ages",
              "Intuitive, simple, and unified",
            ],
          },
        ],
      },
      {
        id: "changes",
        title: "Key changes",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "Navigation bar",
                text: "removed rarely used items so book search is no longer confusing.",
              },
              {
                label: "Color palette",
                text: "unified around the Kyobo logo colors.",
              },
              {
                label: "Icons",
                text: "replaced mismatched icons with a consistent set that’s easier to understand at a glance, especially for categories.",
              },
              {
                label: "Genre chips",
                text: "chips make it easy to browse by genre.",
              },
              {
                label: "Availability chip",
                text: "shows right away whether a book can be borrowed.",
              },
              {
                label: "Category search",
                text: "a subcategory table view makes categories easier to find and scan.",
              },
              {
                label: "Detail page",
                text: "separated the like, borrow, and preview buttons by importance, and visualized how many copies are borrowed and still available.",
              },
              {
                label: "UI writing",
                text: "shortened labels, for example “대출중인 콘텐츠” (“Content on loan”) to “대출 중” (“On loan”), and “대출했던 콘텐츠” (“Previously borrowed content”) to “책장” (“Bookshelf”). Fewer words, more visuals.",
              },
              {
                label: "Floating Bookshelf button",
                text: "opens a list of every book the user has read.",
              },
            ],
          },
          {
            type: "image",
            image: image(
              "kyobo-components.png",
              "Redesigned colors, chips, icons, and navigation bar",
              "Colors, chips, icons, and navigation",
            ),
          },
          {
            type: "image",
            image: image(
              "kyobo-category.png",
              "Category search before and after the redesign",
              "Category search",
            ),
          },
          {
            type: "image",
            image: image(
              "kyobo-detail-page.png",
              "Book detail page before and after the redesign",
              "Detail page",
            ),
          },
          {
            type: "image",
            image: image(
              "kyobo-ui-writing.png",
              "Revised UI labels and the floating Bookshelf button",
              "UI writing and Bookshelf button",
            ),
          },
          {
            type: "video",
            youtubeId: "hzZ-y3CMZS0",
            title: "Kyobo Library redesign video",
          },
        ],
      },
    ],
  },
  {
    slug: "nogosan-expedition",
    selected: false,
    order: 7,
    title: "Nogosan Expedition",
    subtitle: "Designing for Natural Small Talk",
    summaryLine:
      "A field experiment in creating small talk between strangers without making it feel forced.",
    homeDescription:
      "A campus hike that got strangers talking naturally. Won the Top Excellence Award among 17 teams.",
    workDescription:
      "We set out to create natural small talk between students who don’t know each other. After learning that any staged setup kills small talk, we reframed the problem and organized a humorous “expedition” up Nogosan, a small hill on campus. Participants chatted freely the whole way. The project won the Top Excellence Award at Sogang’s Inquiry Community Program.",
    tags: ["Experience Design", "Field Experiment"],
    thumbnail: nogosanHikeGroup,
    meta: [
      {
        label: "Role",
        value: "Planning, participant recruitment and communication",
      },
      { label: "Team", value: "4 people" },
      { label: "Timeline", value: "Nov 2025 – Jan 2026" },
      {
        label: "Type",
        value:
          "Sogang University Inquiry Community Program (Dreamers Club)",
      },
      {
        label: "Award",
        value:
          "Top Excellence Award (2nd of 4 tiers, 17 teams), Center for Teaching and Learning, Jan 2026",
      },
    ],
    links: [],
    summary: {
      problem:
        "How can students who don’t know each other start a natural, warm conversation?",
      whatIDid:
        "Planned the project with the team, managed recruitment, and handled communication with participants before the hike.",
      result:
        "Participants talked comfortably and freely throughout the hike, and the campaign drew far more attention on campus than we expected.",
    },
    sections: [
      {
        id: "process",
        title: "Process",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "First attempt",
                text: "we went out and tried to start conversations with people in person.",
              },
              {
                label: "What broke",
                text: "the moment we stepped in to set up a conversation, it stopped being small talk.",
              },
              {
                label: "Reframe",
                text: "was our goal the conversation itself, or what people get from it, the warmth of connecting? We realized we only needed a small, light excuse for people to come together.",
              },
              {
                label: "The idea",
                text: "an “expedition” up Nogosan, a small hill everyone on campus knows but no one thinks of climbing.",
              },
              {
                label: "Campaign",
                text: "a minimalist poster and a witty promotional post. Students started talking about “people climbing Nogosan.”",
              },
              {
                label: "The hike",
                text: "it went ahead even at −8°C.",
              },
            ],
          },
          {
            type: "image",
            image: image(
              "nogosan-poster-posted.png",
              "The expedition poster held up against a large rock on Nogosan, under bare winter trees",
              "Poster on campus",
            ),
          },
          {
            type: "image",
            image: image(
              "nogosan-campus-reaction.png",
              "Campus community board posts about the expedition, the recruiting post and the results report with the poster and group photo, followed by dozens of student comments asking to join next time (commenter nicknames blurred)",
              "Campus community reactions",
            ),
          },
        ],
      },
      {
        id: "decisions",
        title: "Key design decisions",
        blocks: [
          {
            type: "decisions",
            items: [
              {
                title: "Design the excuse, not the conversation",
                text: "Instead of prompting people to talk, we gave them a shared, slightly absurd activity and let conversation happen on its own.",
              },
              {
                title: "Familiar plus unexpected",
                text: "Everyone knows Nogosan, but actually climbing it sounds like a joke. That mix of familiarity and novelty made people curious.",
              },
              {
                title: "Humor as the hook",
                text: "A minimal poster and playful copy lowered the barrier to joining.",
                image: nogosanPoster,
              },
            ],
          },
        ],
      },
      {
        id: "outcome",
        title: "Outcome",
        blocks: [
          { type: "paragraph", text: "7 participants signed up." },
          {
            type: "paragraph",
            text: "Participants joined without hesitation and chatted easily, trading book recommendations, favorite makgeolli bars, and stories about other hikes. Reactions included “This actually works” and “I’d go next time.”",
          },
          { type: "image", image: nogosanHikeGroup },
          {
            type: "paragraph",
            text: "The campaign landed well beyond the hike itself. On the campus community board, our results post drew 3,294 views, 246 likes, and 23 comments, with students joking along and asking when the second expedition would be.",
          },
          {
            type: "paragraph",
            text: "The project won the Top Excellence Award (2nd of 4 tiers) among 17 teams at Sogang University’s Inquiry Community Program.",
          },
          {
            type: "image",
            image: image(
              "nogosan-award.png",
              "The team at the Inquiry Community final showcase, holding a bouquet and a Top Excellence Award sign",
              "Award ceremony",
            ),
          },
        ],
      },
      {
        id: "learned",
        title: "What we learned",
        blocks: [
          {
            type: "list",
            items: [
              {
                label: "Why it drew attention",
                text: "humor and marketing, and a familiar place used in a new way.",
              },
              {
                label: "Why only 7 people signed up",
                text: "people weren’t sure it was real (some even suspected a cult recruitment), there was no fixed schedule, and the weather suddenly turned very cold.",
              },
              {
                label: "What we learned",
                text: "connection comes from lightly and humorously doing something together, not from forcing a conversation.",
              },
            ],
          },
        ],
      },
    ],
  },
]

/** All projects in display order (표시 순서). */
export const projects = [...unsortedProjects].sort((a, b) => a.order - b.order)
