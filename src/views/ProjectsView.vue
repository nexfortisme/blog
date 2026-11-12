<script setup>
import { useHead } from "@unhead/vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { computed } from "vue";
import { featuredProjects, otherProjects } from "../data/projects.js";

const breadcrumbItems = [
  { label: "Home", to: "/" },
  { label: "About Me", to: "/about-me" },
  { label: "Projects" },
];

useHead({
  title: computed(() => `dharrison.dev - Projects`),
  meta: computed(() => {
    return [
      // Open Graph
      { name: "ogTitle", content: `dharrison.dev - Projects` },
      { name: "ogDescription", content: "Projects" },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:title", content: `dharrison.dev - Projects` },
      { name: "twitter:description", content: "Projects" },
    ];
  }),
});
</script>

<template>
  <div id="projectContainer">
    <Breadcrumb :items="breadcrumbItems" />
    <header class="page-header">
      <h1 class="page-title">Projects</h1>
      <p class="page-subtitle">
        Things I've built in my spare time, mostly to scratch my own itch or to
        learn something new. Most of it lives on
        <a
          href="https://github.com/nexfortisme"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        >.
      </p>
    </header>

    <section aria-labelledby="featured-title">
      <div class="section-heading">
        <h2 id="featured-title">Featured</h2>
      </div>
      <div class="projects-grid featured-grid">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project.title"
          :title="project.title"
          :image="project.image"
          :description="project.description"
          :technologies="project.technologies"
          :link="project.link"
        />
      </div>
    </section>

    <section class="more-section" aria-labelledby="more-title">
      <div class="section-heading">
        <h2 id="more-title">More projects &amp; experiments</h2>
        <a
          href="https://github.com/nexfortisme?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          >All repositories ↗</a
        >
      </div>
      <div class="projects-grid">
        <ProjectCard
          v-for="project in otherProjects"
          :key="project.title"
          :title="project.title"
          :image="project.image"
          :description="project.description"
          :technologies="project.technologies"
          :link="project.link"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--space-5);
}

/* Featured projects get room for full descriptions: two columns on desktop */
.featured-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
}

.more-section {
  margin-top: var(--space-8);
}
</style>
