<template>
  <div class="flex justify-center w-full bg-[var(--bg2)] h-[52px] items-center">
    <div class="flex gap-2 w-full justify-end px-4">
      <nuxt-link v-for="(nav, index) in navbars" :key="index" :to="nav.isEnabled ? nav.path : '/'">
        <div class="bg-gray-500/50 px-2 rounded-sm text-white py-2">
          {{ nav.name }}
        </div>
      </nuxt-link>
    </div>
  </div>
</template>
<script lang="ts" setup>

const { navbars } = useNavbar();
</script>

<style></style>