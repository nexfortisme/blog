<script setup>
import HomeCard from "../components/HomeCard.vue";
import Posts from "../components/RecentPosts.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { featuredProjects } from "../data/projects.js";

import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useHead } from "@unhead/vue";

const homeProjects = featuredProjects.slice(0, 3);

useHead({
  title: computed(() => `dharrison.dev - Home`),
  meta: computed(() => {
    return [
      // Open Graph
      { name: "ogTitle", content: `dharrison.dev - Home` },
      { name: "ogDescription", content: "Home" },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:title", content: `dharrison.dev - Home` },
      { name: "twitter:description", content: "Home" },
    ];
  }),
});
</script>

<template>
  <div id="homeContainer">
    <HomeCard />
    <Posts />
    <section class="projects-section" aria-labelledby="home-projects-title">
      <div class="section-heading">
        <h2 id="home-projects-title">Featured projects</h2>
        <RouterLink to="/about-me/projects">All projects →</RouterLink>
      </div>
      <div class="projects-grid">
        <ProjectCard
          v-for="project in homeProjects"
          :key="project.title"
          :title="project.title"
          :image="project.image"
          :description="project.description"
          :technologies="project.technologies"
          :link="project.link"
          compact
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.projects-section {
  margin-top: var(--space-8);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: var(--space-5);
}
</style>
