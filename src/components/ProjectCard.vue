<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: {
    type: Array,
    required: true,
    default: () => [],
  },
  link: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<template>
  <component
    :is="link ? 'a' : 'div'"
    :href="link"
    :target="link ? '_blank' : undefined"
    :rel="link ? 'noopener noreferrer' : undefined"
    class="project-card"
  >
    <div class="project-image-container">
      <img :src="image" :alt="title" class="project-image" />
    </div>
    <div class="project-content">
      <h2 class="project-title">{{ title }}</h2>
      <p class="project-description">{{ description }}</p>
      <div class="technologies-container">
        <span
          v-for="(tech, index) in technologies"
          :key="index"
          class="technology-tag"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </component>
</template>

<style scoped>
.project-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(var(--accent-color-rgb), 0.2);
  border-color: var(--accent-color);
}

.project-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-content {
  padding: 1.5rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.project-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.technologies-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.technology-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.technology-tag:hover {
  opacity: 0.9;
  transform: scale(1.05);
}
</style>
