<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Breadcrumb from "../components/Breadcrumb.vue";

const route = useRoute();
const router = useRouter();
const posts = ref([]);
const tags = ref([]);
const selectedTags = ref(new Set());

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
    const postsResponse = await fetch(
      "https://raw.githubusercontent.com/nexfortisme/content/refs/heads/main/index.json"
    );
    const postData = await postsResponse.json();
    posts.value = postData;
    console.log("posts", postData);
  } catch (error) {
    console.error("Error loading posts:", error);
  }

  try {
    const tagResponse = await fetch(
      "https://raw.githubusercontent.com/nexfortisme/content/refs/heads/main/tag_index.json"
    );
    const tagData = await tagResponse.json();
    tags.value = tagData;
  } catch (error) {
    console.error("Error Loading Tags:", error);
  }

  // Load tags from query params after tags are loaded
  loadTagsFromQuery();
});

// Watch for route query changes (e.g., browser back/forward)
watch(
  () => route.query.tags,
  () => {
    loadTagsFromQuery();
  }
);

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") return "";
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};
</script>

<template>
  <div class="posts-container">
    <Breadcrumb :items="breadcrumbItems" />
    <h1>Posts</h1>

    <!-- Filter Bar -->
    <div v-if="tags.length > 0" class="filter-bar">
      <div class="filter-header">
        <span class="filter-label">Filter by tags:</span>
        <button
          @click="clearFilters"
          :class="['clear-filters-btn', { show: selectedTags.size > 0 }]"
        >
          Clear filters
        </button>
      </div>
      <div class="filter-tags">
        <button
          v-for="tag in tags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="['filter-tag', { active: selectedTags.has(tag) }]"
        >
          {{ tag }}
        </button>
      </div>
      <div v-if="selectedTags.size > 0" class="filter-info">
        Showing {{ filteredPosts.length }} of {{ posts.length }} posts
      </div>
    </div>

    <!-- <div v-if="posts.length > 0" class="filter-divider"></div> -->

    <div v-if="posts.length === 0" class="loading">Loading posts...</div>
    <div v-else-if="filteredPosts.length === 0" class="no-results">
      No posts match the selected filters.
    </div>
    <div v-else class="posts-list">
      <template v-for="(post, index) in filteredPosts" :key="post.id">
        <article class="post-card">
          <RouterLink :to="`/posts/${post.id}`" class="post-link">
            <h2>{{ post.title || "Untitled" }}</h2>
            <div v-if="post.createdAt" class="post-date">
              {{ formatDate(post.createdAt) }}
            </div>
            <p v-if="post.description" class="description">
              {{ post.description }}
            </p>
          </RouterLink>
          <div v-if="post.tags && post.tags.length" class="tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="tag"
              :class="{ active: selectedTags.has(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </article>
        <div v-if="index < filteredPosts.length - 1" class="post-divider"></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.posts-container {
  padding: 0;
}

h1 {
  margin-bottom: 1rem;
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

.post-date {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.posts-list {
  display: flex;
  flex-direction: column;
}

.post-card {
  transition: opacity 0.2s;
  padding: 2rem 0;
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
  cursor: pointer;
  display: inline-block;
}

.tag:hover {
  background-color: rgba(var(--accent-color-rgb), 0.3);
}

.tag.active {
  background-color: rgba(var(--accent-color-rgb), 0.4);
  font-weight: 500;
}

.filter-bar {
  margin-bottom: 2rem;
}

.filter-header {
  position: relative;
  margin-bottom: 0.75rem;
}

.filter-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.clear-filters-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.clear-filters-btn.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.clear-filters-btn:hover {
  background-color: rgba(var(--accent-color-rgb), 0.1);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  background-color: rgba(var(--accent-color-rgb), 0.1);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover {
  background-color: rgba(var(--accent-color-rgb), 0.2);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.filter-tag.active {
  background-color: rgba(var(--accent-color-rgb), 0.3);
  border-color: var(--accent-color);
  color: var(--accent-color);
  font-weight: 500;
}

.filter-info {
  margin-top: 0.75rem;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.filter-divider {
  height: 1px;
  background-color: var(--border-color);
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;
}

.post-divider {
  height: 1px;
  background-color: var(--border-color);
  transition: background-color 0.3s ease;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-tertiary);
  font-size: 1rem;
}
</style>
