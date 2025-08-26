<template>
  <!-- <SplashScreen v-if="isFirstAccess" /> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// import SplashScreen from '@/components/SplashScreen.vue';

// const isFirstAccess = ref(true);
// onMounted(() => {
//   if (sessionStorage.getItem('hasLoaded')) {
//     isFirstAccess.value = false
//   } else {
//     setTimeout(() => {
//       isFirstAccess.value = false
//       sessionStorage.setItem('hasLoaded', '1')
//     }, 2000)
//   }

// })

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
