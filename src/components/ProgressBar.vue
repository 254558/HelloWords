<template>
  <div class="progress-bar mb-8 mt-20"> 
    <div class="progress-bg">
      <div 
        class="progress-fill"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    
    <div class="progress-text">
      {{ Math.round(progress) }}% ({{ currentIndex + 1 }} / {{ totalWords }})
    </div>
  </div>
</template>

<script setup>
import { useWordStore } from '../stores/word'

const store = useWordStore()
const progress = store.progress
const currentIndex = store.currentIndex
const totalWords = store.totalWords
</script>

<style scoped>
.progress-bar {
  @apply w-full max-w-md;
}

.progress-bg {
  @apply w-full h-1 bg-gray-700 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-green-500 transition-all duration-300 ease-out;
}

.progress-text {
  @apply text-xs text-gray-400 mt-2 text-center;
}
</style>