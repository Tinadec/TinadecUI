import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 88, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/architecture', name: 'architecture', component: () => import('@/pages/ArchitecturePage.vue') },
    { path: '/products', name: 'products', component: () => import('@/pages/ProductsPage.vue') },
    { path: '/products/tinadec-office', name: 'product-office', component: () => import('@/pages/ProductOfficePage.vue') },
  ],
})

export default router
