<template>
  <div class="keyboard-hint flex flex-col items-center gap-2 p-4">
    <div class="keyboard-row flex gap-1" v-for="(row, index) in keyboardLayout" :key="index">
      <div 
        v-for="key in row" 
        :key="key"
        class="key w-10 h-10 flex items-center justify-center rounded bg-gray-800 text-gray-400 transition-all duration-200"
        :class="{
          'bg-green-600 text-white transform scale-110': activeKey === key.toLowerCase(),
          'bg-red-600 text-white transform scale-110': errorKey === key.toLowerCase()
        }"
      >
        {{ key }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { KEYBOARD_LAYOUT } from '@/constants/keyboardLayout';

const props = defineProps({
  currentWord: { type: Object, required: true },
  currentIndex: { type: Number, required: true }
});

const keyboardLayout = KEYBOARD_LAYOUT;
const activeKey = ref('');
const errorKey = ref('');
let errorTimeout = null;

// 计算当前需要输入的字母
const currentLetter = computed(() => 
  props.currentWord?.name?.[props.currentIndex]?.toLowerCase() || ''
);

// 更新激活键
const updateActiveKey = () => {
  activeKey.value = currentLetter.value;
};

// 监听单词或索引变化
watch([() => props.currentWord, () => props.currentIndex], updateActiveKey);

// 标记错误并自动清除
const markError = (key) => {
  errorKey.value = key.toLowerCase();
  
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    errorKey.value = '';
  }, 500);
};

// 组件卸载时清除定时器
onUnmounted(() => clearTimeout(errorTimeout));

defineExpose({ markError });
</script>

<style scoped>
/* 样式保持不变 */
</style>