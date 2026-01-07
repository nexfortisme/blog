<script setup>
import { VueMarkdownIt } from "@f3ve/vue-markdown-it";
import { onMounted, ref, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "../components/Breadcrumb.vue";

import { useHead } from "@unhead/vue";

const route = useRoute();
const router = useRouter();
const post = ref(null);
const content = ref("");
const loading = ref(true);

useHead({
  title: computed(() => post.value?.title || "Post"),
  meta: computed(() => {
    if (!post.value) return [];
    return [
      { name: "description", content: post.value.description },
      // Open Graph
      { name: "ogTitle", content: post.value.title },
      { name: "ogDescription", content: post.value.description },
      { name: "ogImage", content: post.value.descriptionImage },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: post.value.title },
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

const stripFrontmatter = (markdown) => {
  if (!markdown) return "";

  // Match frontmatter between ---- and ----
  const frontmatterRegex = /^----\s*\n[\s\S]*?\n----\s*\n/;
  return markdown.replace(frontmatterRegex, "").trim();
};

onMounted(async () => {
  try {
    const postId = route.params.postId;

    // Load posts index to get the post details
    const response = await fetch(
      "https://raw.githubusercontent.com/nexfortisme/content/refs/heads/main/index.json"
    );
    const posts = await response.json();
    const foundPost = posts.find((p) => p.id === parseInt(postId)); // This could cause performance issues with a whole bunch of posts but I dont really yap that much

    if (foundPost) {
      post.value = foundPost;

      // Load the markdown content
      const contentResponse = await fetch(foundPost.githubPath);
      if (contentResponse.ok) {
        const rawContnet = await contentResponse.text();
        content.value = stripFrontmatter(rawContnet);
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
      <Breadcrumb :items="breadcrumbItems" />
      <h1>{{ post.title || "Untitled" }}</h1>
      <div v-if="post.description" class="description">
        {{ post.description }}
      </div>
      <div v-if="post.tags && post.tags.length" class="tags">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="tag"
          @click="navigateToPostsWithTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
      <div class="markdown-content">
        <!-- <pre>{{ content }}</pre> -->
        <pre>
          <vue-markdown-it :source="content" />
        </pre>
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
  cursor: pointer;
  display: inline-block;
}

.tag:hover {
  background-color: rgba(var(--accent-color-rgb), 0.3);
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
