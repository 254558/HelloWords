<template>
  <div class="h-screen bg-[#1A1B1E]">
    <div class="container mx-auto flex flex-col items-center h-full"> 
      <ProgressBar />
      <TypingArea />
    </div>
  </div>
</template>

<script setup>
import TypingArea from '../components/TypingArea.vue'
import ProgressBar from '../components/ProgressBar.vue'
</script>

<style scoped>
.container {
  @apply max-w-4xl px-4;
}
</style>