<template>
  <div class="w-full bg-gray-300 relative">
    <TheHeader />
    <div class="min-h-[calc(100vh-60px)] w-full mb-4">
      <NuxtPage />
    </div>
    <TheFooter />
  </div>
</template>
<script lang="ts" setup>
import TheHeader from './components/TheHeader.vue';
useHead({
  title: "Ampere",
  link: [
    {
      rel: "icon",
      type: "image/jpg",
      href: "logo.png",
    },
  ],
  meta: [
    {
      name: "description",
      content: "A modern web application built with Vue 3 and Nuxt 3",
    },
    {
      property: "og:image",
      content: "logo.png",
    },
  ],
});
</script>