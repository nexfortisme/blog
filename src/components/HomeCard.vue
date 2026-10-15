<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import {
  faEnvelope,
  faFile,
  faProjectDiagram,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const showGif = ref(false);
let hoverTimeout = null;

const handleMouseEnter = () => {
  hoverTimeout = setTimeout(() => {
    showGif.value = true;
  }, 1000);
};

const handleMouseLeave = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  showGif.value = false;
};

const socials = [
  { label: "Email", href: "mailto:david@dharrison.dev", icon: faEnvelope },
  { label: "GitHub", href: "https://github.com/nexfortisme", icon: faGithub },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/harrison042/",
    icon: faLinkedin,
  },
];
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <span class="eyebrow">Full-stack developer · DMV area</span>
    <div class="hello-container">
      <h1
        id="hero-title"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        class="hello-there"
      >
        Hello There <span class="wave" aria-hidden="true">👋</span>
      </h1>
      <transition name="gif-fade">
        <img
          v-if="showGif"
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3lzODBuZXIyeHhyb3F2enFmcno3Y2VtYm41djRlazJpNHRtN29ldiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiIzJSKB4l7xTouE8/giphy.gif"
          alt="General Kenobi saying Hello There"
          class="hello-gif"
        />
      </transition>
    </div>

    <p class="lede">
      I'm <strong>David Harrison</strong>, a developer who builds education
      software by day and Discord bots, local-LLM experiments, and small web
      tools by night.
    </p>
    <p class="intro">
      This site is a resume of sorts and a place to document interesting things
      I come across that might be helpful for others. There's no concrete theme
      to the posts other than things I'm interested in, or problems I ran into
      and the steps I took to resolve them.
    </p>

    <div class="cta-row">
      <RouterLink to="/posts" class="btn btn-primary">
        Read the blog
        <FontAwesomeIcon :icon="faArrowRight" />
      </RouterLink>
      <RouterLink to="/about-me/projects" class="btn">
        <FontAwesomeIcon :icon="faProjectDiagram" />
        Projects
      </RouterLink>
      <RouterLink to="/about-me/resume" class="btn">
        <FontAwesomeIcon :icon="faFile" />
        Resume
      </RouterLink>
    </div>

    <ul class="socials" aria-label="Contact">
      <li v-for="s in socials" :key="s.label">
        <a
          :href="s.href"
          :target="s.href.startsWith('http') ? '_blank' : undefined"
          :rel="s.href.startsWith('http') ? 'noopener noreferrer' : undefined"
        >
          <FontAwesomeIcon :icon="s.icon" />
          <span>{{ s.label }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: var(--space-6) 0 var(--space-7);
}

/* Soft accent glow behind the hero */
.hero::before {
  content: "";
  position: absolute;
  inset: -2rem auto auto -6rem;
  width: 28rem;
  height: 18rem;
  background: radial-gradient(
    closest-side,
    rgba(var(--accent-color-rgb), 0.16),
    transparent
  );
  pointer-events: none;
  z-index: -1;
}

.hello-container {
  position: relative;
  display: inline-block;
}

.hello-there {
  font-size: var(--text-3xl);
  font-weight: 700;
  cursor: default;
  margin-bottom: var(--space-4);
}

.wave {
  display: inline-block;
  transform-origin: 70% 70%;
}

.hello-there:hover .wave {
  animation: wave 1.2s ease-in-out;
}

@keyframes wave {
  0%, 60%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
}

.hello-gif {
  position: absolute;
  top: 100%;
  left: 0;
  max-width: 300px;
  z-index: 10;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.gif-fade-enter-active,
.gif-fade-leave-active {
  transition: opacity var(--dur) ease;
}

.gif-fade-enter-from,
.gif-fade-leave-to {
  opacity: 0;
}

.lede {
  font-size: var(--text-xl);
  line-height: 1.5;
  color: var(--text-primary);
  max-width: 36rem;
  margin-bottom: var(--space-4);
  letter-spacing: -0.01em;
}

.intro {
  color: var(--text-secondary);
  max-width: var(--measure);
  margin-bottom: var(--space-6);
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.socials {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
}

.socials a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--dur-fast) ease;
}

.socials a:hover {
  color: var(--accent-text);
}
</style>
