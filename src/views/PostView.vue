<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Breadcrumb from "../components/Breadcrumb.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import {
  stripFrontmatter,
  stripLeadingTitleHeading,
} from "../utils/parseMarkdown.js";
import { POSTS_INDEX_URL, formatDate, readingTime } from "../utils/posts.js";

import { useHead } from "@unhead/vue";

const route = useRoute();
const router = useRouter();
const post = ref(null);
const content = ref("");
const loading = ref(true);

useHead({
  title: computed(() => `dharrison.dev - ${post.value?.title || "Post"}`),
  meta: computed(() => {
    if (!post.value) return [];
    return [
      { name: "description", content: post.value.description },
      // Open Graph
      { name: "ogTitle", content: `dharrison.dev - ${post.value.title}` },
      { name: "ogDescription", content: post.value.description },
      { name: "ogImage", content: post.value.descriptionImage },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `dharrison.dev - ${post.value.title}` },
      { name: "twitter:description", content: post.value.description },
      { name: "twitter:image", content: post.value.descriptionImage },
    ];
  }),
});

const navigateToPostsWithTag = (tag) => {
  router.push({
    name: "Posts",
    query: { tags: tag },
  });
};

const breadcrumbItems = computed(() => {
  if (!post.value) return [];
  return [
    { label: "Home", to: "/" },
    { label: "Posts", name: "Posts", query: route.query },
    { label: post.value.title || "Untitled" },
  ];
});

onMounted(async () => {
  try {
    const postId = route.params.postId;

    // Load posts index to get the post details
    const response = await fetch(POSTS_INDEX_URL);
    const posts = await response.json();
    const foundPost = posts.find((p) => p.id === parseInt(postId)); // This could cause performance issues with a whole bunch of posts but I dont really yap that much

    if (foundPost) {
      post.value = foundPost;

      // Load the markdown content
      const contentResponse = await fetch(foundPost.githubPath);
      if (contentResponse.ok) {
        const rawContent = await contentResponse.text();
        const body = stripFrontmatter(rawContent);
        // Avoid repeating the page title when the markdown body starts with the same h1
        content.value = stripLeadingTitleHeading(body, foundPost.title);
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
    <div v-if="loading" class="status muted">Loading post...</div>
    <div v-else-if="!post" class="status error">
      <p>Post not found.</p>
      <RouterLink to="/posts">Back to all posts</RouterLink>
    </div>
    <article v-else class="post-content">
      <Breadcrumb :items="breadcrumbItems" />
      <header class="post-header">
        <div class="post-meta">
          <time v-if="formatDate(post.createdAt)" :datetime="post.createdAt">
            {{ formatDate(post.createdAt) }}
          </time>
          <span v-if="formatDate(post.createdAt) && content" aria-hidden="true">·</span>
          <span v-if="content">{{ readingTime(content) }}</span>
        </div>
        <h1 class="post-title">{{ post.title || "Untitled" }}</h1>
        <p v-if="post.description" class="description">
          {{ post.description }}
        </p>
        <div v-if="post.tags && post.tags.length" class="tags">
          <button
            v-for="tag in post.tags"
            :key="tag"
            type="button"
            class="chip"
            @click="navigateToPostsWithTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </header>
      <div class="markdown-content">
        <MarkdownRenderer :source="content" />
      </div>
      <footer class="post-footer">
        <RouterLink :to="{ name: 'Posts', query: route.query }">← All posts</RouterLink>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.status {
  text-align: center;
  padding: var(--space-7) var(--space-6);
}

.error p {
  color: #ef4444;
  margin-bottom: var(--space-3);
}

/* Long-form reading: keep lines to a comfortable measure */
.post-content {
  max-width: var(--measure);
  margin: 0 auto;
}

.post-header {
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.post-meta {
  display: flex;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-3);
}

.post-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
}

.description {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.markdown-content {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.post-footer {
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-color);
}

.post-footer a {
  text-decoration: none;
  font-weight: 500;
}

.post-footer a:hover {
  text-decoration: underline;
}
</style>
