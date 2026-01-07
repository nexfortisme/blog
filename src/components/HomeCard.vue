<script setup>
import { ref } from "vue";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
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
</script>

<template>
  <div class="hello-container">
    <h1
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="hello-there"
    >
      Hello There 👋
    </h1>
    <transition name="gif-fade">
      <img
        v-if="showGif"
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3lzODBuZXIyeHhyb3F2enFmcno3Y2VtYm41djRlazJpNHRtN29ldiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiIzJSKB4l7xTouE8/giphy.gif"
        alt="Hello There GIF"
        class="hello-gif"
      />
    </transition>
  </div>
  <p>
    Welcome to my personal site and blog. This is to serve as a resume of sorts
    and to document information and other interesting things that I come across
    and that might be helpful for others.
  </p>
  <br />
  <p>
    There will be no concrete theme to the posts other than that its related to
    something that I'm intesresetd in, or to document some kind of problem I
    encountered and the steps I took to resolve it.
  </p>
  <br />

  <div class="links-section">
    <h2>Contact Me</h2>
    <div class="links-container">
      <a href="mailto:david@dharrison.dev" class="link-item" aria-label="Email">
        <FontAwesomeIcon :icon="faEnvelope" class="link-icon" />
        <span>Email</span>
      </a>
      <a
        href="https://github.com/nexfortisme"
        target="_blank"
        rel="noopener noreferrer"
        class="link-item"
        aria-label="GitHub"
      >
        <FontAwesomeIcon :icon="faGithub" class="link-icon" />
        <span>GitHub</span>
      </a>
      <a
        href="https://www.linkedin.com/in/harrison042/"
        target="_blank"
        rel="noopener noreferrer"
        class="link-item"
        aria-label="LinkedIn"
      >
        <FontAwesomeIcon :icon="faLinkedin" class="link-icon" />
        <span>LinkedIn</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.hello-container {
  position: relative;
  display: inline-block;
}

.hello-there {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.hello-there:hover {
  transform: scale(1.05);
}

.hello-gif {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  max-width: 300px;
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.gif-fade-enter-active,
.gif-fade-leave-active {
  transition: opacity 0.3s ease;
}

.gif-fade-enter-from,
.gif-fade-leave-to {
  opacity: 0;
}

.links-section {
  margin-top: 2rem;
}

.links-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.links-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.link-item:hover {
  background-color: var(--accent-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(var(--accent-color-rgb), 0.3);
}

.link-icon {
  font-size: 1.2rem;
}

.link-item span {
  font-size: 1rem;
}
</style>
