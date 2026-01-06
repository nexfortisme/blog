<script lang="ts" setup>
import { ref } from "vue";

const showGif = ref(false);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

const handleMouseEnter = () => {
  hoverTimeout = setTimeout(() => {
    showGif.value = true;
  }, 1000);
};

const handleMouseLeave = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  showGif.value = false;
};
</script>

<template>
  <div class="hello-container">
    <h1
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="hello-there"
    >
      Hello There 👋
    </h1>
    <transition name="gif-fade">
      <img
        v-if="showGif"
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3lzODBuZXIyeHhyb3F2enFmcno3Y2VtYm41djRlazJpNHRtN29ldiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiIzJSKB4l7xTouE8/giphy.gif"
        alt="Hello There GIF"
        class="hello-gif"
      />
    </transition>
  </div>
  <p>
    Welcome to my personal site and blog. This is to serve as a resume of sorts
    and to document information and other interesting things that I come across
    and that might be helpful for others.
  </p>
  <br />
  <p>
    There will be no concrete theme to the posts other than that its related to
    something that I'm intesresetd in, or to document some kind of problem I
    encountered and the steps I took to resolve it.
  </p>
</template>

<style scoped>
.hello-container {
  position: relative;
  display: inline-block;
}

.hello-there {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.hello-there:hover {
  transform: scale(1.05);
}

.hello-gif {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  max-width: 300px;
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.gif-fade-enter-active,
.gif-fade-leave-active {
  transition: opacity 0.3s ease;
}

.gif-fade-enter-from,
.gif-fade-leave-to {
  opacity: 0;
}
</style>
