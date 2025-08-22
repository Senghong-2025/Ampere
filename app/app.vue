<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
const setVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

if (import.meta.client) {
  setVh();
  window.addEventListener('resize', setVh);
}

useHead({
  title: "Ampere (អំពែ)",
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
      content: "សម្រាប់គ្រប់គ្រងការប្រើប្រាស់អគ្គិសនី",
    },
    {
      property: "og:image",
      content: "logo.png",
    },
  ],
});
</script>