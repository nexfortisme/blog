<script setup>
import { RouterLink } from "vue-router";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const year = new Date().getFullYear();

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
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-meta">
        <span>© {{ year }} David Harrison</span>
        <span class="sep" aria-hidden="true">·</span>
        <RouterLink to="/posts">Posts</RouterLink>
        <RouterLink to="/about-me/projects">Projects</RouterLink>
        <RouterLink to="/about-me/resume">Resume</RouterLink>
      </div>
      <div class="footer-socials">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          :aria-label="s.label"
          :title="s.label"
          :target="s.href.startsWith('http') ? '_blank' : undefined"
          :rel="s.href.startsWith('http') ? 'noopener noreferrer' : undefined"
        >
          <FontAwesomeIcon :icon="s.icon" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-5) var(--gutter);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.footer-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.footer-meta a {
  color: var(--text-tertiary);
  text-decoration: none;
}

.footer-meta a:hover {
  color: var(--accent-text);
}

.footer-socials {
  display: flex;
  gap: var(--space-2);
}

.footer-socials a {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 1.05rem;
  transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;
}

.footer-socials a:hover {
  color: var(--accent-text);
  background-color: var(--bg-secondary);
}
</style>
