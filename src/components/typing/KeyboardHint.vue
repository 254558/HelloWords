<template>
  <div class="keyboard-hint">
    <div class="keyboard-row" v-for="(row, index) in keyboardLayout" :key="index">
      <div 
        v-for="key in row" 
        :key="key"
        class="key"
        :class="{
          'active': activeKey === key.toLowerCase(),
          'error': errorKey === key.toLowerCase()
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
  currentWord: {
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true // 如果总是由父组件提供，可以设为required
  }
});

const keyboardLayout = KEYBOARD_LAYOUT;
const activeKey = ref('');
const errorKey = ref('');
let errorTimeout = null;

// 提取当前字母的计算逻辑
const getCurrentLetter = () => {
  return props.currentWord?.name?.[props.currentIndex]?.toLowerCase() || '';
};

// 更新激活键
const updateActiveKey = () => {
  activeKey.value = getCurrentLetter();
};

// 初始化时设置激活键
updateActiveKey();

// 监听当前单词变化
watch(() => props.currentWord?.name, updateActiveKey);

// 监听索引变化
watch(() => props.currentIndex, () => {
  activeKey.value = getCurrentLetter();
  // 只有当索引变化时才重置错误状态，而不是每次更新激活键时都重置
  errorKey.value = '';
});

// 标记错误并自动清除
const markError = (key) => {
  errorKey.value = key.toLowerCase();
  
  // 清除之前的定时器
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }
  
  // 设置新的定时器
  errorTimeout = setTimeout(() => {
    errorKey.value = '';
    errorTimeout = null;
  }, 500);
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }
});

defineExpose({ markError });
</script>

<style scoped>
.keyboard-hint {
  @apply flex flex-col items-center gap-2 p-4;
}
.keyboard-row {
  @apply flex gap-1;
}
.key {
  @apply w-10 h-10 flex items-center justify-center 
         rounded bg-gray-800 text-gray-400
         transition-all duration-200;
}
.active {
  @apply bg-green-600 text-white transform scale-110;
}
.error {
  @apply bg-red-600 text-white transform scale-110;
}
</style>
