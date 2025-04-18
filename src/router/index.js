import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup page',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/auth/SIgnUpView.vue'),
    },
    {
      path: '/login',
      name: 'login page',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Customers.vue'),
    },
    {
      path: '/dashboard/services',
      name: 'Services',
      component: () => import('../views/Services.vue'),
    },
    {
      path: '/dashboard/calendar',
      name: 'Task - Calendar',
      component: () => import('../views/Calendar.vue'),
    },
    {
      path: '/dashboard/forms',
      name: 'Forms',
      component: () => import('../views/Forms.vue'),
    },
    {
      path: '/dashboard/staffs',
      name: 'Staffs',
      component: () => import('../views/Staffs.vue'),
    },
  ],
})

export default router
