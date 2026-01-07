<script setup>
import { RouterLink } from "vue-router";

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(
        (item) =>
          typeof item === "object" &&
          item.hasOwnProperty("label") &&
          (item.hasOwnProperty("to") || item.hasOwnProperty("name") || true)
      );
    },
  },
});
</script>

<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <RouterLink
          v-if="item.to || item.name"
          :to="item.to || { name: item.name, query: item.query }"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="breadcrumb-current">{{ item.label }}</span>
        <span
          v-if="index < items.length - 1"
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          >
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 1.5rem;
}

.breadcrumb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--accent-color);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.breadcrumb-separator {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  user-select: none;
  transition: color 0.3s ease;
}
</style>
