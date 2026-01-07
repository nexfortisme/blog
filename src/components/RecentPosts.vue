<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const posts = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/nexfortisme/content/refs/heads/main/index.json"
    );
    const data = await response.json();
    posts.value = data.slice(0, 4); // Assuming that the posts are already in chronological order
  } catch (error) {
    console.error("Error loading posts:", error);
  }
});

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
  <section class="posts-section">
    <h2 class="section-title">Recent Posts</h2>
    <div v-if="posts.length === 0" class="loading">Loading posts...</div>
    <div v-else class="posts-list">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <RouterLink :to="`/posts/${post.id}`" class="post-link">
          <h3 class="post-title">{{ post.title || "Untitled" }}</h3>
          <div v-if="post.createdAt" class="post-date">
            {{ formatDate(post.createdAt) }}
          </div>
          <p v-if="post.description" class="post-description">
            {{ post.description }}
          </p>
        </RouterLink>
      </article>
    </div>
    <div class="all-posts-link">
      <RouterLink to="/posts">All Posts →</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.posts-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.section-title {
  font-size: 1.5rem;
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

.post-title {
  margin: 0 0 0.5rem 0;
  color: var(--accent-color);
  font-size: 1.2rem;
  font-weight: 400;
  transition: color 0.3s ease;
}

.post-date {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.post-description {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.all-posts-link {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.all-posts-link a {
  color: var(--accent-color);
  text-decoration: none;
  transition: opacity 0.2s, color 0.3s ease;
}

.all-posts-link a:hover {
  opacity: 0.8;
}
</style>
