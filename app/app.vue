<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Ampere (អំពែ)",
  link: [
    { rel: "icon", type: "image/png", href: "/logo.png" },
  ],
  meta: [
    {
      name: "description",
      content: "សម្រាប់គ្រប់គ្រងការប្រើប្រាស់អគ្គិសនី",
    },
    {
      property: "og:image",
      content: "/logo.png",
    },
  ],
});
</script>
