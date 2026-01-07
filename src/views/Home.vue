<script setup>
import HomeCard from "../components/HomeCard.vue";
import Posts from "../components/RecentPosts.vue";
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
