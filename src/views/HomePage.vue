<template>
<!-- 
根元素是一个占满整个屏幕高度的 div，背景色为深灰色 (#1A1B1E) 
-->
  <div class="h-screen bg-[#1A1B1E]">

<!-- 
container mx-auto: 使内容居中并自适应屏幕宽度
flex flex-col items-center: 设置为垂直方向的 flex 布局，并水平居中
h-full: 高度占满父容器 (整个屏幕) 
-->
    <div class="container mx-auto flex flex-col items-center h-full"> 
<!-- 
mt-20：设置元素的 顶部外边距（margin-top） 为 20 个单位。
在 Tailwind 默认配置中，1 个单位等于 0.25rem（即 4px）。
因此，mt-20 相当于 margin-top: 5rem（即 80px）。
mb-8：设置元素的 底部外边距（margin-bottom） 为 8 个单位。
同理，mb-8 相当于 margin-bottom: 2rem（即 32px）。 
-->
      <div class="progress-bar mb-8 mt-20"> 
        <div class="progress-bg">

<!-- 
width: ${store.progress}%：
根据进度值动态设置填充进度条。 
-->
          <div 
            class="progress-fill"
            :style="{ width: `${store.progress}%` }"
          ></div>
        </div>
        
        <div class="progress-text">
          {{ Math.round(store.progress) }}% ({{ store.currentIndex + 1 }} / {{ store.totalWords }})
        </div>
      </div>
      <TypingArea />
    </div>
  </div>
</template>

<script setup>
import { useWordStore } from '../stores/word'
import TypingArea from '../components/typing/TypingArea.vue'

const store = useWordStore()
</script>

<style scoped>
.container {
  @apply max-w-4xl px-4;
}

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