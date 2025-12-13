<template>
    <div class="mx-auto container relative">
        <div class="flex w-full mb-2 sticky top-[52px] z-30 bg-gray-200/80 py-2 sm:rounded-sm sm:mt-2 sm:px-2 sm:top-[58px]">
            <div class="flex w-full gap-2 overflow-x-auto flex-nowrap px-2">
                <NuxtLink
                    v-for="(route, index) in loadRoutes" :key="index" :to="route.path"
                    class="rounded-sm px-2 py-2 shrink-0"
                    :class="[$route.path === route.path ? 'bg-red-800 text-white' : 'bg-gray-100']">
                    <span>{{ route.name }}</span>
                </NuxtLink>
            </div>
        </div>
        <div class="p-2">
            <NuxtPage />
        </div>
    </div>
</template>
<script setup lang="ts">
// import { loads } from "@s/assets/data/load";

const { loadRoutes } = useNavbar();

onMounted(() => {
    navigateTo("/load/details");
})
</script>