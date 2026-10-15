<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import PostCard from "./PostCard.vue";
import { POSTS_INDEX_URL } from "../utils/posts.js";

const posts = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch(POSTS_INDEX_URL);
    const data = await response.json();
    posts.value = data.slice(0, 4); // Assuming that the posts are already in chronological order
  } catch (error) {
    console.error("Error loading posts:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="posts-section" aria-labelledby="recent-posts-title">
    <div class="section-heading">
      <h2 id="recent-posts-title">Recent posts</h2>
      <RouterLink to="/posts">All posts →</RouterLink>
    </div>
    <div v-if="loading" class="posts-list" aria-busy="true">
      <div v-for="n in 3" :key="n" class="skeleton surface"></div>
    </div>
    <p v-else-if="posts.length === 0" class="muted">
      Couldn't load posts right now.
    </p>
    <div v-else class="posts-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </section>
</template>

<style scoped>
.posts-section {
  margin-top: var(--space-7);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton {
  height: 6.5rem;
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 0%,
    var(--bg-secondary) 50%,
    var(--bg-elevated) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}
</style>
