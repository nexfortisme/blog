<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: {
    type: Array,
    default: () => [],
  },
  link: {
    type: String,
    required: false,
    default: null,
  },
  // Compact cards clamp the description and limit tags (used on the home page)
  compact: {
    type: Boolean,
    default: false,
  },
});

const imageFailed = ref(false);
const showImage = computed(() => props.image && !imageFailed.value);

// Monogram for projects without a screenshot, e.g. "Game Night Bot" -> "GN"
const initials = computed(() =>
  props.title
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
);

const isRepo = computed(() => props.link?.includes("github.com"));
const linkLabel = computed(() => (isRepo.value ? "View source" : "Visit site"));
const linkHost = computed(() => {
  if (!props.link) return "";
  try {
    const url = new URL(props.link);
    return isRepo.value ? url.pathname.replace(/^\//, "") : url.host;
  } catch {
    return props.link;
  }
});

const visibleTech = computed(() =>
  props.compact ? props.technologies.slice(0, 4) : props.technologies
);
const hiddenTechCount = computed(
  () => props.technologies.length - visibleTech.value.length
);
</script>

<template>
  <article class="project-card surface" :class="{ compact }">
    <div class="project-media">
      <img
        v-if="showImage"
        :src="image"
        :alt="`${title} screenshot`"
        class="project-image"
        loading="lazy"
        @error="imageFailed = true"
      />
      <div v-else class="project-placeholder" aria-hidden="true">
        <span class="placeholder-initials">{{ initials }}</span>
      </div>
    </div>
    <div class="project-content">
      <h3 class="project-title">
        <a
          v-if="link"
          :href="link"
          target="_blank"
          rel="noopener noreferrer"
          class="project-link"
        >
          {{ title }}
        </a>
        <template v-else>{{ title }}</template>
      </h3>
      <p class="project-description">{{ description }}</p>
      <div v-if="technologies.length" class="technologies-container">
        <span v-for="tech in visibleTech" :key="tech" class="chip">
          {{ tech }}
        </span>
        <span v-if="hiddenTechCount > 0" class="chip more">
          +{{ hiddenTechCount }}
        </span>
      </div>
      <div v-if="link" class="project-footer">
        <span class="link-label">{{ linkLabel }} ↗</span>
        <span class="link-host">{{ linkHost }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  transition: transform var(--dur) var(--ease), border-color var(--dur-fast) ease,
    box-shadow var(--dur) ease;
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow);
}

.project-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease);
}

.project-card:hover .project-image {
  transform: scale(1.03);
}

.project-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(var(--accent-color-rgb), 0.35),
      transparent 55%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(var(--accent-color-rgb), 0.18),
      transparent 50%
    ),
    var(--bg-secondary);
}

.placeholder-initials {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--text-primary);
  opacity: 0.85;
}

.project-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-5);
}

.project-title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.project-link {
  color: var(--text-primary);
  text-decoration: none;
}

/* Stretch the title link so the whole card is clickable */
.project-link::after {
  content: "";
  position: absolute;
  inset: 0;
}

.project-card:hover .project-link {
  color: var(--accent-text);
}

.project-description {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.65;
  margin-bottom: var(--space-4);
}

.compact .project-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.technologies-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.chip.more {
  color: var(--text-tertiary);
  background-color: var(--bg-secondary);
}

.project-footer {
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--text-xs);
}

.link-label {
  color: var(--accent-text);
  font-weight: 600;
  white-space: nowrap;
}

.link-host {
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
