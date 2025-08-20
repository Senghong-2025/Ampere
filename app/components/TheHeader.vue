<template>
  <div class="flex justify-between w-full bg-[var(--bg2)] h-[52px] items-center px-4">
    <div class="flex gap-2 items-center">
      <div class="w-8 h-8">
        <img src="../assets/icons/logo.png" alt="">
      </div>
      <p class="text-red-600 text-[20px] font-medium">Ampere</p>
    </div>
    <div>
      <div class="flex gap-2 w-full justify-end px-4">
        <nuxt-link v-for="(nav, index) in navbars" :key="index" :to="nav.isEnabled ? nav.path : '/'">
          <div class="bg-gray-500/50 px-2 rounded-sm text-white py-2">
            {{ nav.name }}
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

const { navbars } = useNavbar();
</script>

<style></style>