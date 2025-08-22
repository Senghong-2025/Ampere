<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
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