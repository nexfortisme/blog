<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import PostCard from "../components/PostCard.vue";
import { POSTS_INDEX_URL, TAG_INDEX_URL } from "../utils/posts.js";

const route = useRoute();
const router = useRouter();
const posts = ref([]);
const tags = ref([]);
const loading = ref(true);
const selectedTags = ref(new Set());

useHead({
  title: computed(() => `dharrison.dev - Posts`),
  meta: computed(() => {
    return [
      // Open Graph
      { name: "ogTitle", content: `dharrison.dev - Posts` },
      { name: "ogDescription", content: "All Posts" },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:title", content: `dharrison.dev - Posts` },
      { name: "twitter:description", content: "All Posts" },
    ];
  }),
});

const filteredPosts = computed(() => {
  if (selectedTags.value.size === 0) {
    return posts.value;
  }
  return posts.value.filter((post) => {
    if (!post.tags || post.tags.length === 0) {
      return false;
    }
    return post.tags.some((tag) => selectedTags.value.has(tag));
  });
});

const toggleTag = (tag) => {
  if (selectedTags.value.has(tag)) {
    selectedTags.value.delete(tag);
  } else {
    selectedTags.value.add(tag);
  }
  updateQueryParams();
};

const clearFilters = () => {
  selectedTags.value.clear();
  updateQueryParams();
};

const breadcrumbItems = [{ label: "Home", to: "/" }, { label: "Posts" }];

const updateQueryParams = () => {
  const tagArray = Array.from(selectedTags.value);
  if (tagArray.length > 0) {
    router.replace({
      query: { tags: tagArray },
    });
  } else {
    router.replace({ query: {} });
  }
};

const loadTagsFromQuery = () => {
  const queryTags = route.query.tags;
  if (queryTags) {
    const tagArray = Array.isArray(queryTags) ? queryTags : [queryTags];
    selectedTags.value = new Set(tagArray);
  }
};

onMounted(async () => {
  try {
    const postsResponse = await fetch(POSTS_INDEX_URL);
    const postData = await postsResponse.json();
    posts.value = postData;
  } catch (error) {
    console.error("Error loading posts:", error);
  }

  try {
    const tagResponse = await fetch(TAG_INDEX_URL);
    const tagData = await tagResponse.json();
    tags.value = tagData;
  } catch (error) {
    console.error("Error Loading Tags:", error);
  }

  // Load tags from query params after tags are loaded
  loadTagsFromQuery();
  loading.value = false;
});

// Watch for route query changes (e.g., browser back/forward)
watch(
  () => route.query.tags,
  () => {
    loadTagsFromQuery();
  }
);

</script>

<template>
  <div class="posts-container">
    <Breadcrumb :items="breadcrumbItems" />
    <header class="page-header">
      <h1 class="page-title">Posts</h1>
      <p class="page-subtitle">
        Notes on side projects, things I've learned, and problems I've had to
        dig my way out of.
      </p>
    </header>

    <!-- Filter Bar -->
    <div v-if="tags.length > 0" class="filter-bar" role="group" aria-label="Filter posts by tag">
      <div class="filter-header">
        <span class="filter-label">Filter by tag</span>
        <button
          v-if="selectedTags.size > 0"
          type="button"
          class="clear-filters-btn"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>
      <div class="filter-tags">
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          @click="toggleTag(tag)"
          :class="['chip', { active: selectedTags.has(tag) }]"
          :aria-pressed="selectedTags.has(tag)"
        >
          {{ tag }}
        </button>
      </div>
      <div v-if="selectedTags.size > 0" class="filter-info" aria-live="polite">
        Showing {{ filteredPosts.length }} of {{ posts.length }} posts
      </div>
    </div>

    <div v-if="loading" class="status muted">Loading posts...</div>
    <div v-else-if="posts.length === 0" class="status muted">
      Couldn't load posts right now.
    </div>
    <div v-else-if="filteredPosts.length === 0" class="status muted">
      No posts match the selected filters.
    </div>
    <div v-else class="posts-list">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        :selected-tags="selectedTags"
        interactive-tags
        @tag-click="toggleTag"
      />
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  margin-bottom: var(--space-6);
  padding: var(--space-4) var(--space-5);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2rem;
  margin-bottom: var(--space-3);
}

.filter-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.clear-filters-btn {
  background: transparent;
  border: none;
  color: var(--accent-text);
  font: inherit;
  font-size: var(--text-sm);
  cursor: pointer;
}

.clear-filters-btn:hover {
  text-decoration: underline;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.filter-info {
  margin-top: var(--space-3);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.status {
  text-align: center;
  padding: var(--space-7) var(--space-6);
}
</style>
