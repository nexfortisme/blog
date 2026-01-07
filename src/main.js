import './assets/main.css'

import { createHead } from '@unhead/vue'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Configure FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

library.add(faEnvelope, faGithub, faLinkedin)

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

const head = createHead();

const app = createApp(App);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.use(router).use(head).mount('#app')
