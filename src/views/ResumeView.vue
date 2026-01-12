<template>
  <div class="resume">
    <Breadcrumb :items="breadcrumbItems" />
    <!-- Header -->
    <header class="header">
      <div class="title">
        <h1 class="name">{{ data.name }}</h1>
        <p class="tagline">{{ data.tagline }}</p>
      </div>

      <div v-if="props.pdfUrl" class="header-actions">
        <a
          :href="pdfUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="pdf-link-button"
        >
          <span>View PDF</span>
          <span class="pdf-link-icon">↗</span>
        </a>
      </div>

      <!-- <div class="contact">
        <a v-if="data.contact.email" class="pill" :href="`mailto:${data.contact.email}`">
          {{ data.contact.email }}
        </a>
        <a v-if="data.contact.phone" class="pill" :href="`tel:${data.contact.phone}`">
          {{ data.contact.phone }}
        </a>
        <a
          v-if="data.contact.website"
          class="pill"
          :href="data.contact.website"
          target="_blank"
          rel="noreferrer"
        >
          {{ prettyUrl(data.contact.website) }}
        </a>
      </div> -->
    </header>

    <!-- Summary -->
    <section class="card">
      <h2 class="sectionTitle">Summary</h2>
      <p class="summary">{{ data.summary }}</p>
    </section>

    <!-- Tabs -->
    <nav class="tabs" role="tablist" aria-label="Resume sections">
      <button
        v-for="t in tabs"
        :key="t"
        class="tab"
        :class="{ active: activeTab === t }"
        type="button"
        role="tab"
        :aria-selected="activeTab === t"
        @click="activeTab = t"
      >
        {{ t }}
      </button>
    </nav>

    <!-- Experience -->
    <section v-if="activeTab === 'Experience'" class="card">
      <div class="sectionHeader">
        <h2 class="sectionTitle">Professional Experience</h2>
        <div class="muted">{{ data.experience.length }} roles</div>
      </div>

      <div class="stack">
        <article v-for="(job, idx) in data.experience" :key="idx" class="job">
          <div class="jobTop">
            <div>
              <h3 class="jobTitle">
                {{ job.title }}
                <span class="muted">·</span>
                <span class="company">{{ job.company }}</span>
              </h3>
              <div class="jobMeta">
                <span>{{ job.location }}</span>
                <span class="dot">•</span>
                <span>{{ job.dates }}</span>
              </div>
            </div>

            <button
              v-if="hasExpandableContent(job)"
              class="ghost"
              type="button"
              :aria-expanded="expanded.has(idx)"
              @click="toggleExpanded(idx)"
            >
              {{ expanded.has(idx) ? "Collapse" : "Expand" }}
            </button>
          </div>

          <div v-if="job.projects?.length" class="chips">
            <span v-for="(p, i) in job.projects" :key="i" class="chip">{{
              p.name
            }}</span>
          </div>

          <div v-if="expanded.has(idx)" class="jobBody">
            <div v-for="(p, pIdx) in job.projects" :key="pIdx" class="project">
              <div class="projectHeader">
                <h4 class="projectTitle">{{ p.name }}</h4>
                <div v-if="p.stack?.length" class="inlineChips">
                  <span
                    v-for="(s, sIdx) in p.stack"
                    :key="sIdx"
                    class="miniChip"
                    >{{ s }}</span
                  >
                </div>
              </div>
              <ul class="bullets">
                <li v-for="(b, bIdx) in p.bullets" :key="bIdx">{{ b }}</li>
              </ul>
            </div>

            <div v-if="job.highlights?.length" class="project">
              <h4 class="projectTitle">Highlights</h4>
              <ul class="bullets">
                <li v-for="(h, hIdx) in job.highlights" :key="hIdx">{{ h }}</li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Skills -->
    <section v-else-if="activeTab === 'Skills'" class="card">
      <div class="sectionHeader">
        <h2 class="sectionTitle">Technical Skills</h2>
        <div class="muted">{{ filteredSkillCount }} items</div>
      </div>

      <div class="skillsTools">
        <input
          v-model="skillQuery"
          class="input"
          type="search"
          placeholder="Search skills (e.g., Vue, Go, SQL)"
          aria-label="Search skills"
        />
        <label class="check">
          <input v-model="groupSkills" type="checkbox" />
          Group by category
        </label>
      </div>

      <div v-if="groupSkills" class="grid">
        <div
          v-for="(items, cat) in filteredSkillsByCategory"
          :key="cat"
          class="skillGroup"
        >
          <h3 class="skillCat">{{ cat }}</h3>
          <div class="pillWrap">
            <span v-for="(s, idx) in items" :key="idx" class="pill">{{
              s
            }}</span>
          </div>
        </div>
      </div>

      <div v-else class="pillWrap">
        <span v-for="(s, idx) in filteredSkillsFlat" :key="idx" class="pill">{{
          s
        }}</span>
      </div>
    </section>

    <!-- Education -->
    <section v-else-if="activeTab === 'Education'" class="card">
      <h2 class="sectionTitle">Education</h2>

      <div class="edu">
        <h3 class="jobTitle">
          {{ data.education.school }}
          <span class="muted">·</span>
          <span class="company">{{ data.education.location }}</span>
        </h3>
        <div class="jobMeta">
          <span>{{ data.education.degree }}</span>
          <span class="dot">•</span>
          <span>{{ data.education.date }}</span>
        </div>

        <div v-if="data.education.courses?.length" class="project">
          <h4 class="projectTitle">Courses</h4>
          <ul class="bullets">
            <li v-for="(c, idx) in data.education.courses" :key="idx">
              {{ c }}
            </li>
          </ul>
        </div>

        <div v-if="data.education.projects?.length" class="project">
          <h4 class="projectTitle">Relevant Projects</h4>
          <div
            v-for="(p, idx) in data.education.projects"
            :key="idx"
            class="project"
          >
            <div class="projectHeader">
              <h4 class="projectTitle">{{ p.name }}</h4>
              <div v-if="p.stack?.length" class="inlineChips">
                <span
                  v-for="(s, sIdx) in p.stack"
                  :key="sIdx"
                  class="miniChip"
                  >{{ s }}</span
                >
              </div>
            </div>
            <p
              class="muted"
              style="margin: 0.25rem 0 0.75rem; transition: color 0.3s ease"
            >
              {{ p.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-else-if="activeTab === 'Projects'" class="card">
      <div class="sectionHeader">
        <h2 class="sectionTitle">Personal Projects</h2>
        <div class="muted">{{ personalProjects.length }} projects</div>
      </div>

      <div class="stack">
        <article
          v-for="(project, idx) in personalProjects"
          :key="idx"
          class="job"
        >
          <div class="jobTop">
            <div>
              <h3 class="jobTitle">
                {{ project.title }}
                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  rel="noreferrer"
                  class="project-link"
                >
                  ↗
                </a>
              </h3>
            </div>
          </div>

          <div v-if="project.technologies?.length" class="chips">
            <span
              v-for="(tech, i) in project.technologies"
              :key="i"
              class="chip"
              >{{ tech }}</span
            >
          </div>

          <div class="project-description-text">
            <p>{{ project.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- Activities -->
    <section v-else class="card">
      <h2 class="sectionTitle">Activities</h2>
      <ul class="bullets">
        <li v-for="(a, idx) in data.activities" :key="idx">{{ a }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useHead } from "@unhead/vue";
import Breadcrumb from "../components/Breadcrumb.vue";

type Project = {
  name: string;
  bullets: string[];
  stack?: string[];
};

type Experience = {
  company: string;
  location: string;
  title: string;
  dates: string;
  projects: Project[];
  highlights?: string[];
};

type EducationProject = {
  name: string;
  description: string;
  stack?: string[];
};

type ResumeData = {
  name: string;
  tagline: string;
  contact: { email?: string; phone?: string; website?: string };
  summary: string;
  experience: Experience[];
  skills: Record<string, string[]>;
  education: {
    school: string;
    location: string;
    degree: string;
    date: string;
    courses?: string[];
    projects?: EducationProject[];
  };
  activities: string[];
};

const props = defineProps<{
  resumeData?: ResumeData;
  pdfUrl?: string;
}>();

// Default data (from the uploaded PDF)
const defaultData = reactive<ResumeData>({
  name: "David Harrison",
  tagline: "Experienced Software Developer",
  contact: {
    email: "david@dharrison.dev",
    phone: "484-477-9535",
    website: "https://dharrison.dev",
  },
  summary:
    "Experienced Software Developer with a proven track record of problem-solving. Committed to delivering exceptional client satisfaction through effective communication and collaborative teamwork. Passionate about developing and implementing high-quality systems. Proactive in taking calculated risks and eager to learn and grow professionally. Dedicated to exceeding expectations and consistently delivering outstanding results.",
  experience: [
    {
      company: "Edtell LLC",
      location: "Garnet Valley, PA",
      title: "Software Engineer",
      dates: "October 2018 – Present",
      projects: [
        {
          name: "Redevelopment of Student Registration System",
          stack: ["Angular", "Spring", "MySQL"],
          bullets: [
            "Contributed to full development lifecycle from inception through deployment",
            "Incorporated customer feedback to iteratively enhance system usability and performance",
            "Used Agile methodologies for feature development and bug tracking",
            "Customized 3rd party libraries to meet the required design and functionality",
            "Developed database stored procedures and functions to determine pricing logic based on factors like overrides, territory discounts, and customer adjustments",
          ],
        },
        {
          name: "Developed New Student Information System",
          stack: ["Angular", "Spring", "MySQL"],
          bullets: [
            "Developed a portal for students and parents to view grades and progress through courses",
            "Built multi-user security model to control data visibility by user type",
            "Authored stored procedures to summarize data for end-user reports",
            "Adjusted stored procedure results based on customer feedback and changing reporting requirements",
            "Laid groundwork for future system development and expansion",
          ],
        },
      ],
    },
    {
      company: "Joseki Technologies Inc.",
      location: "Malvern, PA",
      title: "Intern",
      dates: "May 2017 – January 2018",
      projects: [
        {
          name: "Java/React Reporting System",
          stack: ["Java", "React"],
          bullets: [
            "Developed features including Single Sign-On (SSO) and SMTP mail notifications",
            "Fixed bugs and practiced Agile development",
            "Designed and implemented user management",
            "Customized 3rd party libraries with custom components and custom CSS",
            "Added execution tracking and stat reporting through new functions and smart SQL queries",
            "Updated dependencies and fixed issues that arose with updates",
          ],
        },
      ],
    },
    {
      company: "Joseki Technologies Inc.",
      location: "Malvern, PA",
      title: "Intern",
      dates: "June 2016 – August 2016",
      projects: [
        {
          name: "Fortune 500 eCommerce Company",
          bullets: [
            "Participated in Development",
            "Practiced Agile software development (Epics, Stories, Bugs), task pointing, and reporting",
            "Configured Jasmine test runner and authored test suites",
            "Increased code coverage to meet and exceed the 80% target",
          ],
        },
        {
          name: "Fortune 500 Hospitality Company",
          bullets: [
            "Designed and implemented a URL shortening service for integration into a Guest Communication System",
            "Fixed bugs with in-house J2EE CRM application",
            "Built a Compare-O-Matic tool using diff2html.js",
          ],
        },
        {
          name: "Modeling Agency",
          bullets: [
            "Supported manual billing extract process",
            "Helped design and test a custom replication process of jobs into billing system",
          ],
        },
      ],
    },
    {
      company: "CVS Pharmacy",
      location: "Berwyn, PA",
      title: "Front Store Associate",
      dates: "May 2012 – August 2016",
      projects: [],
      highlights: [],
    },
  ],
  skills: {
    Languages: ["Java", "JavaScript", "TypeScript", "SQL", "Golang"],
    "Frameworks & Libraries": [
      "Angular",
      "React",
      "VueJS",
      "Spring Boot (JDBC, MVC, REST)",
      "ExpressJS",
      "HonoJS",
      "jQuery",
      "React Bootstrap",
      "React Router",
      "Java Mail",
      "Apache Commons",
    ],
    "Runtime Environments": ["NodeJS", "Deno", "BunJS"],
    Databases: ["MySQL"],
    Concepts: [
      "Design Patterns",
      "REST",
      "JDBC",
      "DML",
      "DDL",
      "Futures and Promises",
      "SSO Implementation",
    ],
    "Development Tools": [
      "Maven",
      "Git",
      "Vim",
      "Postman",
      "IntelliJ",
      "VS Code",
      "Cygwin",
    ],
    "Operating Systems": ["Linux", "OSX", "Windows"],
    "AI Tools": ["GitHub CoPilot", "Cursor IDE", "ChatGPT", "Anthropic Claude"],
    Productivity: ["Office"],
  },
  education: {
    school: "Elizabethtown College",
    location: "Elizabethtown, PA",
    degree: "B.S. in Computer Science",
    date: "May 2018",
    courses: [
      "Accounting, Legal Environment of Business, Business Management, Principles of Marketing, Macroeconomics, Promotional Management",
      "Computer Science I and II, Algorithms and Data Structures (Java), Computer Security",
      "Systems Programming (C, C++, Linux Command Line), Intro. to Computer Networking",
      "Database Systems, Software Engineering",
    ],
    projects: [
        // {
        //   name: "Movie Recommendations App",
        //   stack: ["ReactJS", "React Router", "ExpressJS", "MySQL"],
        //   description:
        //     "Single-page web app that displays movie information and recommendations based on user ratings and other users' ratings. Frontend in React; backend in Express serving REST endpoints backed by MySQL.",
        // },
    ],
  },
  activities: [
    "Eagle Scout, Boy Scouts of America",
    "Served as Senior Patrol Leader, Assistant Senior Patrol Leader, and Patrol Leader",
  ],
});

const personalProjects = [
  {
    title: "Bot Person",
    description:
      "A Discord bot with ChatGPT, Dall-e, and Sora integration. Started as a fun side project for friends but evolved into a more robust utility with cost management features. Picture comes from a friend, who I have permission from to use, but it kind of became the icon for the bot.",
    technologies: ["SQLite", "DiscordGo", "OpenAI API", "Golang"],
    link: "https://github.com/nexfortisme/bot-person",
  },
  {
    title: "This Website",
    description:
      "My personal blog and portfolio website built with Vue.js. Serves as both a resume and a place to document interesting things I come across.",
    technologies: ["Vue.js", "Vite", "JavaScript", "CSS"],
  },
];

const data = computed(() => props.resumeData ?? defaultData);
const pdfUrl = computed(
  () => props.pdfUrl ?? "https://dharrison.dev/resume.pdf"
);

const tabs = [
  "Experience",
  "Skills",
  "Education",
  "Projects",
  "Activities",
] as const;
const activeTab = ref<(typeof tabs)[number]>("Experience");

const expanded = reactive(new Set<number>());
function toggleExpanded(i: number) {
  if (expanded.has(i)) expanded.delete(i);
  else expanded.add(i);
}

function hasExpandableContent(job: Experience): boolean {
  // Check if there are projects with bullets
  const hasProjectsWithBullets =
    job.projects.length > 0 &&
    job.projects.some((p) => p.bullets && p.bullets.length > 0);
  // Check if there are highlights
  const hasHighlights = (job.highlights?.length ?? 0) > 0;
  return hasProjectsWithBullets || hasHighlights;
}

// Skills searching
const skillQuery = ref("");
const groupSkills = ref(true);

const filteredSkillsByCategory = computed(() => {
  const q = skillQuery.value.trim().toLowerCase();
  const out: Record<string, string[]> = {};
  for (const [cat, items] of Object.entries(data.value.skills)) {
    const filtered = !q
      ? items
      : items.filter((s) => s.toLowerCase().includes(q));
    if (filtered.length) out[cat] = filtered;
  }
  return out;
});

const filteredSkillsFlat = computed(() => {
  const q = skillQuery.value.trim().toLowerCase();
  const all = Object.values(data.value.skills).flat();
  const filtered = !q ? all : all.filter((s) => s.toLowerCase().includes(q));
  // Unique + stable order
  const seen = new Set<string>();
  return filtered.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
});

const filteredSkillCount = computed(() => {
  return groupSkills.value
    ? Object.values(filteredSkillsByCategory.value).reduce(
        (n, arr) => n + arr.length,
        0
      )
    : filteredSkillsFlat.value.length;
});

const breadcrumbItems = [
  { label: "Home", to: "/" },
  { label: "About Me", to: "/about-me" },
  { label: "Resume" },
];

useHead({
  title: computed(() => `dharrison.dev - Resume`),
  meta: computed(() => {
    return [
      // Open Graph
      { name: "ogTitle", content: `dharrison.dev - Resume` },
      { name: "ogDescription", content: "Resume" },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:title", content: `dharrison.dev - Resume` },
      { name: "twitter:description", content: "Resume" },
    ];
  }),
});
</script>

<style scoped>
.resume {
  padding: 0;
}

.header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 18px 14px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.title {
  min-width: 260px;
}

.name {
  font-size: 28px;
  margin: 0;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.tagline {
  margin: 6px 0 0;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.contact {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pdf-link-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--accent-color);
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;
}

.pdf-link-button:hover {
  background: rgba(var(--accent-color-rgb), 0.9);
  transform: translateY(-1px);
}

.pdf-link-icon {
  font-size: 12px;
  opacity: 0.9;
}

.pill,
.pill:visited {
  display: inline-flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  text-decoration: none;
  background: var(--bg-primary);
  font-size: 14px;
  transition: border-color 0.3s ease, color 0.3s ease,
    background-color 0.3s ease;
}

.card {
  margin-top: 14px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 18px;
  background: var(--bg-secondary);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.sectionHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.sectionTitle {
  margin: 0 0 10px;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.summary {
  margin: 0;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.tabs {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: 999px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;
}

.tab:hover {
  background: var(--bg-secondary);
}

.tab.active {
  background: var(--accent-color);
  color: #ffffff;
  border-color: var(--accent-color);
}

.stack {
  display: grid;
  gap: 12px;
}

.job {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 14px;
  background: var(--bg-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.jobTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.jobTitle {
  margin: 0;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.company {
  font-weight: 600;
}

.jobMeta {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.dot {
  opacity: 0.6;
}

.ghost {
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;
}

.ghost:hover {
  background: var(--bg-primary);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chip {
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;
}

.jobBody {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.project {
  border-top: 1px dashed var(--border-color);
  padding-top: 12px;
  transition: border-color 0.3s ease;
}

.projectHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.projectTitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.inlineChips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.miniChip {
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;
}

.bullets {
  margin: 8px 0 0;
  padding-left: 18px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.muted {
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

.skillsTools {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.input {
  flex: 1;
  min-width: 240px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  transition: color 0.3s ease;
}

.pillWrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.skillGroup {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 14px;
  background: var(--bg-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.skillCat {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.edu {
  display: grid;
  gap: 12px;
}

.project-link {
  color: var(--accent-color);
  text-decoration: none;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  transition: opacity 0.3s ease;
}

.project-link:hover {
  opacity: 0.8;
}

.project-description-text {
  margin-top: 12px;
}

.project-description-text p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  transition: color 0.3s ease;
}

@media (max-width: 820px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  .contact {
    justify-content: flex-start;
  }
  .header-actions {
    justify-content: flex-start;
    margin-top: 12px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
