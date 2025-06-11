<template>
  <div class="typing-container">
    <!-- 渲染单词卡片组件，传递当前单词和已输入的字符 -->
    <WordCard
      :word="store.currentWord"
      :typedChars="typedResult"
      ref="wordCardRef"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useWordStore } from '../../stores/word';
import WordCard from '../word/WordCard.vue';
import { useSound } from '../../composables/useSound';
import { useAnimation } from '../../composables/useAnimation';
import { errorHandler } from '../../utils/errorHandler';

// 获取单词状态管理 store
const store = useWordStore();
// 存储用户已输入的字符
const typedResult = ref([]);
// 引用 WordCard 组件实例
const wordCardRef = ref(null);
// 获取音效相关功能
const { playKeySound, playErrorSound } = useSound();
// 获取动画相关功能
const { jump } = useAnimation();

// 监听当前单词的变化，当单词切换时重置已输入的字符
watch(
  () => store.currentWord,
  () => {
    typedResult.value = [];
  },
  { 
    immediate: true,
    flush: 'post' // 确保在 DOM 更新后执行回调
  }
);

// 封装播放音效的函数，添加错误处理
const playSound = (soundFunction) => {
  try {
    soundFunction();
  } catch (error) {
    errorHandler.handleAudioError(error);
  }
};

// 封装执行动画的函数，添加错误处理
const executeAnimation = (element, animationFunction) => {
  try {
    if (element) {
      animationFunction(element);
    }
  } catch (error) {
    errorHandler.handleApiError(error);
  }
};
</script>

<style scoped>
.typing-container {
  @apply flex flex-col items-center justify-center;
}
</style>