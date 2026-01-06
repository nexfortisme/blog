<script setup lang="ts">
import { onMounted, ref } from "vue";
import Breadcrumb from "../components/Breadcrumb.vue";

const resumeUrl = ref(
  "https://www.dropbox.com/scl/fi/rcig7xhnremz88u4erhbq/Resume.pdf?rlkey=d476bk0olkjtm1p0fwgpg6dlr&st=468sic89&dl=0&raw=1"
);
const isLoading = ref(true);

const breadcrumbItems = [
  { label: "Home", to: "/" },
  { label: "About Me", name: "AboutMe" },
  { label: "Resume" },
];

const handleIframeLoad = () => {
  isLoading.value = false;
};

onMounted(() => {});
</script>

<template>
  <div class="resume-container">
    <Breadcrumb :items="breadcrumbItems" />
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
      size="64"
      class="loading-spinner"
    ></v-progress-circular>
    <iframe
      :src="resumeUrl"
      title="Resume"
      class="resume-frame"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<style scoped>
.resume-container {
  width: 100%;
  height: calc(100vh - 128px); /* Subtract header height */
  padding: 1rem;
  position: relative;
}

.resume-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
