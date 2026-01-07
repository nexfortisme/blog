import { ref, onMounted } from "vue";

// Initialize from localStorage or default to dark
const getInitialTheme = () => {
  if (typeof localStorage !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true; // Default to dark
  }
  return true; // Default to dark
};

const isDark = ref(getInitialTheme());

const updateTheme = () => {
  const root = document.documentElement;
  if (isDark.value) {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
  // Store preference in localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }
};

export function useTheme() {
  onMounted(() => {
    // Sync with current DOM state
    const root = document.documentElement;
    isDark.value = root.classList.contains("dark");
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    updateTheme();
  };

  return {
    isDark,
    toggleTheme,
  };
}

