<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const post = ref(null);
const content = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    const postId = route.params.postId;

    // Load posts index to get the post details
    const response = await fetch("/content/index.json");
    const posts = await response.json();
    const foundPost = posts.find((p) => p.id === parseInt(postId));

    if (foundPost) {
      post.value = foundPost;

      // Load the markdown content
      const contentPath = foundPost.path.replace("../", "/content/");
      const contentResponse = await fetch(contentPath);
      if (contentResponse.ok) {
        content.value = await contentResponse.text();
      }
    }
  } catch (error) {
    console.error("Error loading post:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="post-detail-container">
    <div v-if="loading" class="loading">Loading post...</div>
    <div v-else-if="!post" class="error">Post not found</div>
    <article v-else class="post-content">
      <h1>{{ post.title || "Untitled" }}</h1>
      <div v-if="post.description" class="description">
        {{ post.description }}
      </div>
      <div v-if="post.tags && post.tags.length" class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="markdown-content">
        <pre>{{ content }}</pre>
      </div>
    </article>
  </div>
</template>

<style scoped>
.post-detail-container {
  padding: 0;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

.error {
  color: #ff6b6b;
}

.post-content h1 {
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 400;
  transition: color 0.3s ease;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
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

.markdown-content {
  margin-top: 2rem;
  line-height: 1.8;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.markdown-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  transition: background-color 0.3s ease;
}
</style>
