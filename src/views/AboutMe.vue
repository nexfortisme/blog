<script setup>
import { RouterLink } from "vue-router";
import { computed } from "vue";
import { useHead } from "@unhead/vue";
import Breadcrumb from "../components/Breadcrumb.vue";

const breadcrumbItems = [{ label: "Home", to: "/" }, { label: "About Me" }];

useHead({
  title: computed(() => `dharrison.dev - About Me`),
  meta: computed(() => {
    return [
      // Open Graph
      { name: "ogTitle", content: `dharrison.dev - About Me` },
      { name: "ogDescription", content: "About Me" },
      { name: "ogUrl", content: window.location.href },
      // Twitter
      { name: "twitter:title", content: `dharrison.dev - About Me` },
      { name: "twitter:description", content: "About Me" },
    ];
  }),
});
</script>

<template>
  <div class="about-me-container">
    <Breadcrumb :items="breadcrumbItems" />
    <header class="page-header">
      <h1 class="page-title">About Me</h1>
    </header>
    <div class="content">
      <p>
        Hi, my name is David. I am a full-stack developer in the DMV area. I
        have spent my career up until this point working with education software
        such as Learning Management Systems, Course Creation Systems, and
        Registration Systems. I enjoy building software that people use and are
        able to get a tangible benefit from.
      </p>
      <p>
        Some personal projects I have been working on include
        <a
          href="https://github.com/nexfortisme/bot-person"
          target="_blank"
          rel="noopener noreferrer"
          >Bot Person</a
        >, my Discord bot with ChatGPT, Dall-e, and Sora integration, and other
        half-baked attempts at trying to add further utility to it. It started
        as a fun little side project for my friends but snowballed into its
        current iteration as ways to make it more useful and limit the runaway
        costs of using the OpenAI APIs. Find a list of more projects <RouterLink :to="{name: 'Projects'}">here</RouterLink>.
      </p>
      <p>
        Outside of work, my interests include gaming (PC primarily), Formula 1,
        and traveling. I’ve gotten the chance to see an F1 race in the UK at
        Silverstone, which turned out to be the best race of the season (<a
          href="https://en.wikipedia.org/wiki/2022_British_Grand_Prix"
          target="_blank"
          rel="noopener noreferrer"
          >See Attached</a
        >). Beyond going to races, I’ve been to France, Germany, Switzerland,
        and Japan, with more trips planned in the future.
      </p>
      <p>
        For those looking for my resume,
        <RouterLink :to="{ name: 'Resume' }">find it here</RouterLink>.
      </p>
      <figure class="photo">
        <img
          src="../assets/images/20230721_182820.JPG"
          alt="David holding a puppy"
          loading="lazy"
        />
        <figcaption>Random picture of myself holding a puppy</figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.content {
  max-width: var(--measure);
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--text-secondary);
}

.content p {
  margin-bottom: var(--space-5);
}

.photo {
  margin-top: var(--space-6);
  max-width: 22rem;
}

.photo img {
  display: block;
  width: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.photo figcaption {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}
</style>
