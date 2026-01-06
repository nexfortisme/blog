import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Posts from '../views/AllPostsView.vue'
import PostDetail from '../views/PostView.vue'
import AboutMe from '../views/AboutMe.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/posts/:postId',
      name: 'PostDetail',
      component: PostDetail
    },
    {
      path: '/about-me',
      name: 'AboutMe',
      component: AboutMe
    }
  ]
})

export default router

