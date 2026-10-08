export const SEED_DATA = {
  profile: {
    name: "Oscar Aora",
    tagline: "I craft digital experiences that scale — from pixel to production.",
    roles: ["Full-Stack Developer", "System Architect", "Open Source Contributor", "Tech Lead"],
    bio: `I'm a Full-Stack Developer with 7+ years building high-performance web applications that people love to use. I specialize in React, Node.js, and cloud infrastructure — bridging the gap between elegant UI and robust backend systems.\n\nMy work spans early-stage startups to Fortune 500 companies, always with the same conviction: software should be fast, accessible, and maintainable by the next engineer who touches it. I believe in writing code that's a joy to read.\n\nWhen I'm not shipping features, I'm contributing to open source, writing about engineering at scale, or mentoring junior developers. Currently open to Senior and Staff-level opportunities.`,
    stats: [
      { label: "Years Experience", value: 7, suffix: "+" },
      { label: "Projects Shipped", value: 52, suffix: "" },
      { label: "Happy Clients", value: 38, suffix: "+" },
      { label: "GitHub Stars", value: 2100, suffix: "+" },
    ],
    avatar: "",
    email: "aoraoscar06@gmail.com",
    phone: "+254 758695620",
    location: "Kiambu, Nairobi",
    github: "https://github.com/Oscar-star254",
    linkedin: "https://linkedin.com/in/oscaraora",
    twitter: "https://twitter.com/oscaraora_dev",
    resumeUrl: "/resume.pdf",
    resumeLabel: "Download Resume",
    resumeInfo: "PDF · 2 pages",
    resumeDownloads: 0,
    resumeDownloadLog: [] as string[],
  },

  skills: [
    { id: "1", category: "Frontend", name: "React / Next.js", level: 95, icon: "⚛️" },
    { id: "2", category: "Frontend", name: "TypeScript", level: 92, icon: "🔷" },
    { id: "3", category: "Frontend", name: "Tailwind CSS", level: 90, icon: "🎨" },
    { id: "4", category: "Frontend", name: "Three.js / WebGL", level: 70, icon: "🌐" },
    { id: "5", category: "Backend", name: "Node.js / Express", level: 93, icon: "🟢" },
    { id: "6", category: "Backend", name: "PostgreSQL", level: 88, icon: "🐘" },
    { id: "7", category: "Backend", name: "GraphQL", level: 82, icon: "◈" },
    { id: "8", category: "Backend", name: "Redis", level: 78, icon: "🔴" },
    { id: "9", category: "Tools", name: "Docker / K8s", level: 85, icon: "🐳" },
    { id: "10", category: "Tools", name: "AWS / GCP", level: 80, icon: "☁️" },
    { id: "11", category: "Tools", name: "CI/CD (GitHub Actions)", level: 88, icon: "⚙️" },
    { id: "12", category: "Tools", name: "Git / Version Control", level: 95, icon: "📦" },
    { id: "13", category: "Soft Skills", name: "Technical Leadership", level: 90, icon: "🧭" },
    { id: "14", category: "Soft Skills", name: "System Design", level: 88, icon: "🏛️" },
    { id: "15", category: "Soft Skills", name: "Code Review", level: 92, icon: "🔍" },
    { id: "16", category: "Soft Skills", name: "Mentoring", level: 85, icon: "🎓" },
  ],

  experience: [
    {
      id: "1", company: "Vercel", role: "Senior Full-Stack Engineer",
      start: "Jan 2022", end: "Present", current: true,
      logo: "V",
      achievements: [
        "Led a team of 6 engineers to rebuild the deployment pipeline, reducing build times by 42% for 80k+ active projects.",
        "Designed and shipped the Edge Middleware feature from prototype to GA, now used by 15k+ customers daily.",
        "Mentored 4 junior engineers through structured 1:1s and internal tech talks; 3 were promoted within 18 months.",
      ],
    },
    {
      id: "2", company: "Shopify", role: "Full-Stack Developer",
      start: "Mar 2020", end: "Dec 2021", current: false,
      logo: "S",
      achievements: [
        "Rebuilt the Storefront API client layer in TypeScript, improving type safety and reducing runtime errors by 67%.",
        "Developed a real-time inventory sync system handling 50k+ events/sec during peak Black Friday traffic.",
        "Contributed 18 merged PRs to internal tooling libraries, adopted by 200+ internal engineers.",
      ],
    },
    {
      id: "3", company: "Stripe", role: "Software Engineer",
      start: "Jun 2018", end: "Feb 2020", current: false,
      logo: "S",
      achievements: [
        "Owned the Dashboard analytics module, shipping 8 major features including the revenue reconciliation view.",
        "Built a distributed event-sourcing service in Node.js that processes $2M+ in transactions daily.",
        "Reduced dashboard Time-to-Interactive from 4.8s to 1.3s through code splitting and server-side rendering.",
      ],
    },
    {
      id: "4", company: "Freelance", role: "Full-Stack Consultant",
      start: "Aug 2016", end: "May 2018", current: false,
      logo: "F",
      achievements: [
        "Built 12 production web applications for clients in fintech, healthcare, and e-commerce verticals.",
        "Consistently delivered projects 15-20% ahead of schedule with 100% client satisfaction scores.",
        "Established a component library and design system adopted by 3 ongoing client teams.",
      ],
    },
  ],

  projects: [
  {
    id: "1", title: "JKUAT Study Hub", category: "Web", featured: true, status: "published",
    description: "TODO: one or two sentences on what it does and who it's for.",
    tech: [], // TODO
    liveUrl: "https://jkuat-study-hub.vercel.app/", sourceUrl: "", // TODO: repo URL or leave empty
    image: "/images/projects/jkuat-study-hub.png",
    order: 0,
  },
  {
    id: "2", title: "JKUAT Marketplace", category: "Web", featured: true, status: "published",
    description: "TODO: one or two sentences on what it does and who it's for.",
    tech: [], // TODO
    liveUrl: "https://jkuat-marketplace.vercel.app/", sourceUrl: "", // TODO: repo URL or leave empty
    image: "/images/projects/jkuat-marketplace.png",
    order: 1,
  },
  {
    id: "3", title: "LensKenya", category: "Web", featured: true, status: "published",
    description: "Photography booking platform for the Kenyan market. Clients book sessions for graduations, weddings and portraits, view galleries, and pay with M-Pesa.",
    tech: [], // TODO
    liveUrl: "https://photobooking-zeta.vercel.app/", sourceUrl: "", // TODO: repo URL or leave empty
    image: "/images/projects/lenskenya.png",
    order: 2,
  },
],

  education: [
    {
      id: "1", type: "degree", institution: "UC Berkeley",
      degree: "B.S. Computer Science", field: "Software Engineering",
      start: "2012", end: "2016", gpa: "3.8 / 4.0",
      description: "Focus on distributed systems, algorithms, and HCI. Dean's List 2014–2016.",
      certUrl: "",
    },
    {
      id: "2", type: "cert", institution: "AWS",
      degree: "AWS Certified Solutions Architect", field: "Cloud",
      start: "2021", end: "2024", gpa: "",
      description: "Professional level certification — SAP-C02.",
      certUrl: "",
    },
    {
      id: "3", type: "cert", institution: "Google",
      degree: "Google Cloud Professional Developer", field: "Cloud",
      start: "2022", end: "2025", gpa: "",
      description: "Professional Developer certification on GCP.",
      certUrl: "",
    },
    {
      id: "4", type: "cert", institution: "Meta",
      degree: "Meta Front-End Developer Certificate", field: "Frontend",
      start: "2020", end: "",
      gpa: "", description: "8-course professional certificate via Coursera.",
      certUrl: "",
    },
  ],

  testimonials: [
    {
      id: "1", name: "Jordan Kim", role: "VP Engineering, Vercel", avatar: "",
      quote: "Oscar has an exceptional ability to translate complex requirements into elegant, performant systems. They elevated the entire team's craft — a rare engineer who writes code that future maintainers actually thank them for.",
      rating: 5, approved: true,
    },
    {
      id: "2", name: "Sarah Chen", role: "CTO, FlowPay", avatar: "",
      quote: "We brought Oscar in to rescue a floundering payments infrastructure. Within 3 months, transaction failures dropped 94% and we shipped features we'd been blocked on for a year. Exceptional ownership and delivery.",
      rating: 5, approved: true,
    },
    {
      id: "3", name: "Marcus Thompson", role: "Product Director, Shopify", avatar: "",
      quote: "What sets Oscar apart is the combination of deep technical skill and genuine product intuition. They pushed back on scope creep in the best way — always protecting user experience and engineering quality simultaneously.",
      rating: 5, approved: true,
    },
    {
      id: "4", name: "Priya Patel", role: "Lead Designer, Orbit UI", avatar: "",
      quote: "Oscar built our entire component library with pixel-perfect fidelity and WCAG AA compliance out of the box. The attention to accessibility details was impressive — we rarely needed to file design bugs.",
      rating: 5, approved: true,
    },
  ],

  messages: [] as Array<{
    id: string; name: string; email: string; message: string;
    date: string; read: boolean; starred: boolean;
  }>,

  seo: {
    title: "Oscar Aora — Full-Stack Developer",
    description: "Senior Full-Stack Developer specializing in React, Node.js, and cloud infrastructure. Building high-performance web applications from pixel to production.",
    ogImage: "",
    favicon: "",
    analyticsId: "",
    maintenanceMode: false,
  },

  theme: {
    primaryColor: "#7c5cff",
    accentColor: "#22d3ee",
    darkMode: true,
    particlesEnabled: true,
    particleCount: 80,
    particleSpeed: 0.5,
    particleColor: "#7c5cff",
    animationsEnabled: true,
    heroStyle: "particles",
  },

  sections: [
    { id: "about", label: "About", visible: true, order: 0 },
    { id: "skills", label: "Skills", visible: true, order: 1 },
    { id: "experience", label: "Experience", visible: true, order: 2 },
    { id: "projects", label: "Projects", visible: true, order: 3 },
    { id: "education", label: "Education", visible: true, order: 4 },
    { id: "testimonials", label: "Testimonials", visible: true, order: 5 },
    { id: "contact", label: "Contact", visible: true, order: 6 },
  ],
};

export type Profile = typeof SEED_DATA.profile;
export type Skill = typeof SEED_DATA.skills[0];
export type Experience = typeof SEED_DATA.experience[0];
export type Project = typeof SEED_DATA.projects[0];
export type Education = typeof SEED_DATA.education[0];
export type Testimonial = typeof SEED_DATA.testimonials[0];
export type Message = { id: string; name: string; email: string; message: string; date: string; read: boolean; starred: boolean; };
export type SEO = typeof SEED_DATA.seo;
export type Theme = typeof SEED_DATA.theme;
export type Section = typeof SEED_DATA.sections[0];
