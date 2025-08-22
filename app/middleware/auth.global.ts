export default defineNuxtRouteMiddleware((to) => {
    if (!import.meta.client) return;

    const config = useRuntimeConfig();
    const token = sessionStorage.getItem('token');
    const isLoggedIn = token === config.public.TOKEN_KEY;

    if (!isLoggedIn && to.path !== '/auth/login' && !to.path.startsWith('/auth') && !to.path.startsWith('/share')) {
        return navigateTo('/auth/login');
    }
    if (isLoggedIn && to.path === '/auth/login') {
        return navigateTo('/');
    }
});