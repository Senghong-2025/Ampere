<template>
  <div class="min-h-screen bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
    <div class="text-center">
      <div class="relative mb-8">
        <svg class="w-32 h-32 mx-auto animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10L90 90H10L50 10Z" stroke="#3B82F6" stroke-width="5" class="animate-draw"/>
        </svg>
      </div>
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
        Powering the Future
      </h1>
      <p class="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in delay-200">
        Electric: Innovate, Accelerate, Celebrate
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.animate-draw {
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  animation: draw 1s ease-in-out forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-in-out forwards;
}

.delay-200 {
  animation-delay: 0.1s;
}

.delay-400 {
  animation-delay: 0.1s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>