<script setup>
import { RouterLink } from "vue-router";
import { useTheme } from "../composables/useTheme";

const { isDark, toggleTheme } = useTheme();

// `exact` keeps "About" from lighting up on its child routes (Resume/Projects)
const navLinks = [
  { label: "Posts", to: "/posts" },
  { label: "Projects", to: "/about-me/projects" },
  { label: "Resume", to: "/about-me/resume" },
  { label: "About", to: "/about-me", exact: true },
];
</script>

<template>
  <header class="site-header">
    <div class="header-container">
      <RouterLink to="/" class="logo" aria-label="dharrison.dev home">
        <span class="logo-mark" aria-hidden="true">dh</span>
        <span class="logo-text">dharrison<span class="logo-tld">.dev</span></span>
      </RouterLink>
      <div class="header-right">
        <nav aria-label="Primary">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :exact-active-class="link.exact ? 'is-active' : undefined"
            :active-class="link.exact ? '' : 'is-active'"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--bg-header);
  backdrop-filter: saturate(160%) blur(12px);
  -webkit-backdrop-filter: saturate(160%) blur(12px);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--dur) ease;
}

.header-container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-3) var(--gutter);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 650;
  letter-spacing: -0.01em;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    135deg,
    var(--accent-color),
    rgba(var(--accent-color-rgb), 0.55)
  );
  color: var(--accent-contrast);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 500;
}

.logo-tld {
  color: var(--text-tertiary);
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

nav {
  display: flex;
  gap: var(--space-1);
}

nav a {
  position: relative;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;
}

nav a:hover {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

nav a.is-active {
  color: var(--text-primary);
}

nav a.is-active::after {
  content: "";
  position: absolute;
  left: var(--space-3);
  right: var(--space-3);
  bottom: 0.15rem;
  height: 2px;
  border-radius: 2px;
  background-color: var(--accent-color);
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border-color);
  cursor: pointer;
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: color var(--dur-fast) ease, border-color var(--dur-fast) ease,
    transform var(--dur-fast) var(--ease);
}

.theme-toggle:hover {
  color: var(--accent-text);
  border-color: var(--border-strong);
}

.theme-toggle:active {
  transform: scale(0.94);
}

/* Small screens: nav drops to its own scrollable row under the logo */
@media (max-width: 640px) {
  .header-container {
    flex-wrap: wrap;
    row-gap: var(--space-2);
  }

  .header-right {
    display: contents;
  }

  .theme-toggle {
    order: 1;
  }

  nav {
    order: 2;
    flex-basis: 100%;
    overflow-x: auto;
    margin: 0 calc(var(--space-3) * -1);
    scrollbar-width: none;
  }

  nav::-webkit-scrollbar {
    display: none;
  }
}
</style>
