<script setup>
import Header from "./components/Header.vue";
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  flex: 1;
}
</style>
