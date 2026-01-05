<script setup>
import { RouterLink } from "vue-router";
import { useTheme } from "../composables/useTheme";

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <header>
    <div class="header-container">
      <div class="logo">
        <RouterLink to="/">blog</RouterLink>
      </div>
      <div class="header-right">
        <nav>
          <RouterLink to="/posts">Posts</RouterLink>
          <RouterLink to="/about-me">About</RouterLink>
        </nav>
        <button
          @click="toggleTheme"
          class="theme-toggle"
          aria-label="Toggle theme"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
            width="20"
            height="20"
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
    <div class="header-divider"></div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

.header-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo a {
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 400;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--accent-color);
}

nav a.router-link-active {
  color: var(--accent-color);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: color 0.2s, transform 0.2s;
  border-radius: 4px;
}

.theme-toggle:hover {
  color: var(--accent-color);
  transform: scale(1.1);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle .icon {
  width: 20px;
  height: 20px;
}

.header-divider {
  height: 1px;
  background-color: var(--border-color);
  max-width: 800px;
  margin: 0 auto;
  transition: background-color 0.3s ease;
}
</style>
