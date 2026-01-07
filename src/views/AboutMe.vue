<script setup>
import { RouterLink } from "vue-router";
import Breadcrumb from "../components/Breadcrumb.vue";

const breadcrumbItems = [{ label: "Home", to: "/" }, { label: "About Me" }];
</script>

<template>
  <div class="about-me-container">
    <Breadcrumb :items="breadcrumbItems" />
    <h1>About Me</h1>
    <div class="content">
      <p>
        Hi, my name is David. I am a full-stack developer in the DMV area. I
        have spent my career up until this point working with education software
        such as Learning Management Systems, Course Creation Systems, and
        Registration Systems. I enjoy building software that people use and are
        able to get a tangible benefit from.
      </p>
      <br />
      <p>
        Some personal projects I have been working on include
        <a href="https://github.com/nexfortisme/bot-person" target="_blank"
          >Bot Person</a
        >, my Discord bot with ChatGPT, Dall-e, and Sora integration, and other
        half-baked attempts at trying to add further utility to it. It started
        as a fun little side project for my friends but snowballed into its
        current iteration as ways to make it more useful and limit the runaway
        costs of using the OpenAI APIs.
      </p>
      <br />
      <p>
        Outside of work, my interests include gaming (PC primarily), Formula 1,
        and traveling. I’ve gotten the chance to see an F1 race in the UK at
        Silverstone, which turned out to be the best race of the season (<a
          href="https://en.wikipedia.org/wiki/2022_British_Grand_Prix"
          target="_blank"
          >See Attached</a
        >). Beyond going to races, I’ve been to France, Germany, Switzerland,
        and Japan, with more trips planned in the future.
      </p>
      <br />
      <p>
        For those looking for my resume,
        <RouterLink :to="{ name: 'Resume' }">find it here</RouterLink>.
      </p>
      <br />
      <div style="display: flex; flex-direction: column; align-items: center">
        <h4>Random picture of myself holding a puppy</h4>
        <img src="../assets/images/20230721_182820.JPG" style="width: 50%" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-me-container {
  padding: 0;
}

a {
  color: var(--accent-color);
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-weight: 400;
  transition: color 0.3s ease;
}

.content {
  line-height: 1.6;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.content p {
  margin-bottom: 1rem;
}
</style>
