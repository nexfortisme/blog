<script setup>
import { RouterLink } from "vue-router";
import { formatDate } from "../utils/posts.js";

defineProps({
  post: { type: Object, required: true },
  // Tags currently used as filters (only relevant when tags are interactive)
  selectedTags: { type: Set, default: () => new Set() },
  // When true, tags render as buttons that emit `tag-click`
  interactiveTags: { type: Boolean, default: false },
});

defineEmits(["tag-click"]);
</script>

<template>
  <article class="post-card surface">
    <div class="post-meta">
      <time v-if="formatDate(post.createdAt)" :datetime="post.createdAt">
        {{ formatDate(post.createdAt) }}
      </time>
    </div>
    <h3 class="post-title">
      <RouterLink :to="`/posts/${post.id}`" class="post-link">
        {{ post.title || "Untitled" }}
      </RouterLink>
    </h3>
    <p v-if="post.description" class="post-description">
      {{ post.description }}
    </p>
    <div
      v-if="post.tags && post.tags.length"
      class="post-tags"
      :class="{ 'is-interactive': interactiveTags }"
    >
      <template v-if="interactiveTags">
        <button
          v-for="tag in post.tags"
          :key="tag"
          type="button"
          class="chip"
          :class="{ active: selectedTags.has(tag) }"
          :aria-pressed="selectedTags.has(tag)"
          @click="$emit('tag-click', tag)"
        >
          {{ tag }}
        </button>
      </template>
      <template v-else>
        <span v-for="tag in post.tags" :key="tag" class="chip">{{ tag }}</span>
      </template>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  position: relative;
  padding: var(--space-5);
  transition: border-color var(--dur-fast) ease, transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) ease;
}

.post-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.post-meta {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

.post-title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.post-link {
  color: var(--text-primary);
  text-decoration: none;
}

/* Stretch the title link so the whole card is clickable */
.post-link::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.post-card:hover .post-link {
  color: var(--accent-text);
}

.post-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

/* Sit above the stretched link so filter tags stay clickable */
.post-tags.is-interactive {
  position: relative;
  z-index: 1;
}
</style>
