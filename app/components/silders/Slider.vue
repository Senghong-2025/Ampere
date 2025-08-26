<template>
  <div class="custom-swiper relative overflow-hidden">
    <div ref="sliderRef" class="slider-track flex transition-transform duration-500 ease-in-out">
      <div v-for="(slide, index) in slides" :key="index" class="slide flex-shrink-0 w-full max-h-[40%]">
        <div class="relative max-h-[40%]">
          <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" >
        </div>
      </div>
    </div>
    <button
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      :disabled="currentIndex === 0"
      @click="prevSlide">
      ←
    </button>
    <button
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      :disabled="currentIndex >= slides.length - 1"
      @click="nextSlide">
      →
    </button>
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <button
        v-for="(slide, index) in slides" :key="index" class="w-3 h-3 rounded-full" :class="currentIndex === index ? 'bg-blue-500' : 'bg-white opacity-70'"
        @click="goToSlide(index)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Slide {
  image: string
  title: string
  description: string
}

const slides: Slide[] = [
  {
    image: 'https://picsum.photos/1200/500?random=1',
    title: 'Slide 1',
    description: 'Beautiful landscape view'
  },
  {
    image: 'https://picsum.photos/1200/500?random=2',
    title: 'Slide 2',
    description: 'Stunning city skyline'
  },
  {
    image: 'https://picsum.photos/1200/500?random=3',
    title: 'Slide 3',
    description: 'Amazing nature scene'
  }
]

const sliderRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
let autoPlayInterval: NodeJS.Timeout | null = null

const updateSlidePosition = () => {
  if (sliderRef.value) {
    const offset = currentIndex.value * 100
    sliderRef.value.style.transform = `translateX(-${offset}%)`
  }
}

const nextSlide = () => {
  if (currentIndex.value < slides.length - 1) {
    currentIndex.value++
    updateSlidePosition()
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    updateSlidePosition()
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  updateSlidePosition()
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    if (currentIndex.value < slides.length - 1) {
      nextSlide()
    } else {
      currentIndex.value = 0
      updateSlidePosition()
    }
  }, 3000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const handleResize = () => {
  if (currentIndex.value > slides.length - 1) {
    currentIndex.value = slides.length - 1
  }
  updateSlidePosition()
}

onMounted(() => {
  startAutoPlay()
  window.addEventListener('resize', handleResize)
  updateSlidePosition()
})

onUnmounted(() => {
  stopAutoPlay()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped></style>