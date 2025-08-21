
const isMobile = computed(() => window.matchMedia('(max-width: 620px)').matches);

export default {
    isMobile,
}