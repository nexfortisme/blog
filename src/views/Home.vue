<script setup>
import HomeCard from "../components/HomeCard.vue";
import Posts from "../components/RecentPosts.vue";

import { computed } from "vue";
import { useHead } from "@unhead/vue";

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
  </div>
</template>

<style scoped>
#homeContainer {
  padding: 0;
}
</style>
