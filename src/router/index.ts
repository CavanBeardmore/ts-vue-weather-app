import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LocationsView from '../views/LocationsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/locations',
    name: 'locations',
    component: LocationsView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
