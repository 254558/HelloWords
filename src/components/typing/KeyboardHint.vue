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
import { ref, watch } from 'vue';
import { KEYBOARD_LAYOUT } from '@/constants/keyboardLayout'; // 假设提取到常量文件

const props = defineProps({
  currentWord: {
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});

const keyboardLayout = KEYBOARD_LAYOUT;
const activeKey = ref('');
const errorKey = ref('');

const updateActiveKey = () => {
  const currentWord = props.currentWord;
  if (currentWord && currentWord.name) {
    activeKey.value = currentWord.name[props.currentIndex]?.toLowerCase() || '';
    errorKey.value = '';
  }
};

watch(() => props.currentWord?.name, updateActiveKey, { immediate: true });

// 提供方法给父组件调用
const markError = (key) => {
  errorKey.value = key.toLowerCase();
  setTimeout(() => {
    errorKey.value = '';
  }, 500);
};

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