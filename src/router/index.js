import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Posts from '../views/AllPostsView.vue'
import PostDetail from '../views/PostView.vue'
import AboutMe from '../views/AboutMe.vue'
import ResumeView from '../views/ResumeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

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
    },
    {
      path: '/about-me/resume',
      name: 'Resume',
      component: ResumeView,
      props: {
        pdfUrl: 'https://www.dropbox.com/scl/fi/rcig7xhnremz88u4erhbq/Resume.pdf?rlkey=d476bk0olkjtm1p0fwgpg6dlr&st=468sic89&dl=0&raw=1'
      }
    },
    {
      path: '/about-me/projects',
      name: 'Projects',
      component: ProjectsView
    }
  ]
})

export default router

