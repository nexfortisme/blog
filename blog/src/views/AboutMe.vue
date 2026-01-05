<script setup></script>

<template>
  <div class="about-me-container">
    <h1>About Me</h1>
    <div class="content">
      <p>Welcome to my blog! This is the About Me page.</p>
      <p>
        Add your personal information, bio, and anything else you'd like to
        share here.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-me-container {
  padding: 0;
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
