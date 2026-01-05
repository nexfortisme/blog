import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Initialize theme before mounting
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const isDark = savedTheme ? savedTheme === "dark" : true; // Default to dark

if (isDark) {
  root.classList.add("dark");
  root.classList.remove("light");
} else {
  root.classList.add("light");
  root.classList.remove("dark");
}

createApp(App).use(router).mount('#app')
