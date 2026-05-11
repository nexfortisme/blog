<script setup lang="ts">
import { useHead } from "@unhead/vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { computed } from "vue";

const breadcrumbItems = [
  { label: "Home", to: "/" },
  { label: "About Me", to: "/about-me" },
  { label: "Projects" },
];

const projects = [
{
    title: "Relay",
    image:
      "https://raw.githubusercontent.com/nexfortisme/asset-store/refs/heads/main/relay_homepage.png",
    description:
      "An AI chat application but with all of the dials and features in a more user-friendly interface and gives the user more control over the converstaion and their data. Uses local models to interact with their data and stores it all locally. An exersize in learning and creating an application that I would want to use myself through the use of AI tools. Created using Cursor, Claude Code, Codex and Github Copilot.",
    technologies: ["Vue.js", "SQLite", "Golang", "MCPs", "RAG", "Cursor", "Claude Code", "Codex", "Github Copilot"],
    link: "https://github.com/nexfortisme/relay",
  },
  {
    title: "Bot Person",
    image:
      "https://github.com/nexfortisme/asset-store/blob/main/Wracker%20New.jpg?raw=true",
    description:
      "A Discord bot with ChatGPT, Dall-e, and Sora integration. Started as a fun side project for friends but evolved into a more robust utility with cost management features. Picture comes from a friend, who I have permission from to use, but it kind of became the icon for the bot.",
    technologies: ["SQLite", "DiscordGo", "OpenAI API", "Golang"],
    link: "https://github.com/nexfortisme/bot-person",
  },
  {
    title: "Bart",
    image:
      "https://raw.githubusercontent.com/nexfortisme/Bart/refs/heads/main/resources/pictures/bart_icon.png?raw=true",
    description:
      "Next evolution of Bot Person but using a more natural means of communication; through just a normal discord chat instead of through slash commands or special alert keywords or characters. It uses MCPs, model embeddings, and KNN classifiers to understand the context of the conversation and respond accordingly.",
    technologies: [
      "SQLite",
      "DiscordGo",
      "Golang",
      "MCPs",
      "Model Embeddings",
      "KNN Classifiers",
      "Local Model Hosting",
    ],
    link: "https://github.com/nexfortisme/bart",
  },
  {
    title: "This Website",
    image:
      "https://github.com/nexfortisme/asset-store/blob/main/website_screenshot.png?raw=true",
    description:
      "My personal blog and portfolio website built with Vue.js. Serves as both a resume and a place to document interesting things I come across.",
    technologies: ["Vue.js", "Vite", "JavaScript", "CSS"],
  },
  {
    title: "OSS Forums",
    image:
      "https://github.com/nexfortisme/asset-store/blob/main/OSSForumsHomePage.png?raw=true",
    description:
      "A simple, old-school, forum I'm working on because I got tired of all of the needless data collection of modern software. It's a simple, self hostable forum that allows you to create categories and topics and post to them.",
    technologies: ["Vue.js", "BunJS", "SQLite"],
    link: "https://github.com/nexfortisme/oss-forums",
  },
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
    <h1>Here are some of my personal projects</h1>
    <div class="projects-grid">
      <ProjectCard
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :image="project.image"
        :description="project.description"
        :technologies="project.technologies"
        :link="project.link"
      />
    </div>
  </div>
</template>

<style scoped>
#projectContainer {
  padding: 0;
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-weight: 400;
  transition: color 0.3s ease;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
