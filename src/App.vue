<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div id="app">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content">
      <div class="container">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
main {
  flex: 1;
}

.skip-link {
  position: absolute;
  left: var(--space-4);
  top: -3rem;
  z-index: 100;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--accent-color);
  color: var(--accent-contrast);
  text-decoration: none;
  transition: top var(--dur-fast) ease;
}

.skip-link:focus {
  top: var(--space-3);
}

.page-enter-active,
.page-leave-active {
  transition: opacity var(--dur-fast) ease, transform var(--dur-fast) ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
}
</style>
