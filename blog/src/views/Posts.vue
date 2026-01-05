<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const posts = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("/content/index.json");
    const data = await response.json();
    posts.value = data;
    console.log("Posts", posts.value);
  } catch (error) {
    console.error("Error loading posts:", error);
  }
});
</script>

<template>
  <div class="posts-container">
    <h1>Posts</h1>
    <div v-if="posts.length === 0" class="loading">Loading posts...</div>
    <div v-else class="posts-list">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <RouterLink :to="`/posts/${post.id}`" class="post-link">
          <h2>{{ post.title || "Untitled" }}</h2>
          <p v-if="post.description" class="description">
            {{ post.description }}
          </p>
          <div v-if="post.tags && post.tags.length" class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </RouterLink>
      </article>
    </div>
  </div>
</template>

<style scoped>
.posts-container {
  padding: 0;
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-weight: 400;
  transition: color 0.3s ease;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-card {
  transition: opacity 0.2s;
}

.post-card:hover {
  opacity: 0.8;
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-link h2 {
  margin: 0 0 0.5rem 0;
  color: var(--accent-color);
  font-weight: 400;
  transition: color 0.3s ease;
}

.description {
  color: var(--text-secondary);
  margin: 0.5rem 0;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.tag {
  background-color: rgba(var(--accent-color-rgb), 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--accent-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
