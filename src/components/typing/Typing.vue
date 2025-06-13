<template>
  <div class="typing-container" @keydown="handleKeydown">
    <WordCard
      :word="store.currentWord"
      :typedChars="typedResult"
      :currentIndex="currentIndex"
      ref="wordCardRef"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useWordStore } from '../../stores/word';
import WordCard from '../word/WordCard.vue';
import { useSound } from '../../composables/useSound';
import { useAnimation } from '../../composables/useAnimation';
import { errorHandler } from '../../utils/errorHandler';

// 获取单词状态管理 store
const store = useWordStore();
// 存储用户已输入的字符
const typedResult = ref([]);
// 当前输入索引
const currentIndex = ref(0);
// 引用 WordCard 组件实例
const wordCardRef = ref(null);
// 获取音效相关功能
const { playKeySound, playErrorSound } = useSound();
// 获取动画相关功能
const { jump } = useAnimation();

// 监听当前单词的变化，当单词切换时重置输入状态
watch(
  () => store.currentWord,
  () => {
    typedResult.value = [];
    currentIndex.value = 0;
  },
  { 
    immediate: true,
    flush: 'post' // 确保在 DOM 更新后执行回调
  }
);

// 通用的错误处理函数
const withErrorHandling = (action, errorType = 'general') => {
  try {
    return action();
  } catch (error) {
    if (errorType === 'audio') {
      errorHandler.handleAudioError(error);
    } else if (errorType === 'api') {
      errorHandler.handleApiError(error);
    } else {
      errorHandler.handleError(error);
    }
  }
};

// 处理键盘输入
const handleKeydown = (event) => {
  if (!store.currentWord || !store.currentWord.name) return;
  
  const currentChar = store.currentWord.name[currentIndex.value]?.toLowerCase();
  const keyPressed = event.key.toLowerCase();
  
  // 忽略非字母键
  if (!/^[a-z]$/.test(keyPressed)) return;
  
  event.preventDefault();
  
  // 检查输入是否正确
  if (keyPressed === currentChar) {
    // 正确输入
    typedResult.value = [...typedResult.value, keyPressed];
    currentIndex.value++;
    
    // 播放按键音效
    withErrorHandling(() => playKeySound(), 'audio');
    
    // 检查是否完成当前单词
    if (currentIndex.value >= store.currentWord.name.length) {
      // 单词完成，触发完成逻辑
      withErrorHandling(() => {
        store.completeCurrentWord();
        jump(wordCardRef.value.$el);
      }, 'api');
    }
  } else {
    // 错误输入
    withErrorHandling(() => playErrorSound(), 'audio');
    
    // 通知WordCard组件标记错误
    wordCardRef.value?.markError(keyPressed);
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.typing-container {
  @apply flex flex-col items-center justify-center min-h-[300px];
}
</style>
