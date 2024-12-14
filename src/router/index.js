/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Global navigation guard, used ChatGPT to modify this function to work with the authentication info stored in the session
router.beforeEach((to, from, next) => {
    // Add your custom metadata here
    if (to.path === '/admin/adminmenu') {
        to.meta.requiresAuth = true;
        to.meta.roles = ['admin'];
    } else if (to.path === '/admin/adminsales') {
        to.meta.requiresAuth = true;
        to.meta.roles = ['admin'];
    } else if (to.path === '/admin/adminusers') {
        to.meta.requiresAuth = true;
        to.meta.roles = ['admin'];
    } else if (to.path === 'favourites') {
        to.meta.requiresAuth = true;
    } else if (to.path === 'orderhistory') {
        to.meta.requiresAuth = true;
    } else if (to.path === 'profile') {
        to.meta.requiresAuth = true;
    }
    
    const authStore = useAuthStore();
    
    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      return next('/login'); // Redirect to login if not authenticated
    }
  
    // Check if the route has role-based access control
    if (to.meta.roles) {
      // If admin access is required but the user is not an admin
      if (to.meta.roles.includes('admin') && !authStore.isAdminUser) {
        return next('/not-authorized'); // Redirect if user lacks admin role
      }
    }
  
    next(); // Proceed to the route if all checks pass
  });

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
