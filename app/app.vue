<template>
 <NuxtLayout>
   <div v-if="ready"> 
      <NuxtPage />
    </div>
    <div v-else class="flex items-center justify-center h-screen bg-gray-100" style="background-image: url('/logo.png'); background-size: cover; background-position: center;">
      <div class="flex flex-col items-center bg-white bg-opacity-80 p-8 rounded-lg shadow">
      <!-- Electric loading animation -->
      <svg class="animate-pulse h-12 w-12 text-yellow-400 mb-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26 4L10 26H24L22 44L38 22H26L26 4Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      <span class="text-yellow-700 text-lg font-semibold">កំពុងផ្ទុកអគ្គិសនី...</span>
      </div>
    </div>
 </NuxtLayout>
</template>

<script setup lang="ts">

const ready = ref(false);
onMounted(() => {
  ready.value = true;
})

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
