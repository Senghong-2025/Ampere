export default defineNuxtRouteMiddleware((to) => {
    if (!import.meta.client) return;

    const config = useRuntimeConfig();
    const token = useCookie('token');
    const isLoggedIn = token.value === config.public.TOKEN_KEY;

    if (!isLoggedIn && to.path !== '/auth/login' && !to.path.startsWith('/auth') && !to.path.startsWith('/share')) {
      return navigateTo('/auth/login');
    }
    if (isLoggedIn && to.path === '/auth/login') {
        return navigateTo('/');
    }
    });