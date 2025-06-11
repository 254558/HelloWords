import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import words from '../data/words.json'
import { shuffle } from '../utils/shuffle'
import { storageService } from '../services/storageService'

export const useWordStore = defineStore('word', () => {
  // 定义状态对象
  const state = ref({
    wordList: [],
    currentIndex: 0,
    typedChars: [],
    errors: 0
  })

  // 初始化状态（从本地存储加载或生成新列表）
  const initState = () => {
    const savedProgress = storageService.getProgress()
    if (savedProgress && savedProgress.wordList?.length) {
      state.value = {
        ...state.value,
        wordList: savedProgress.wordList,
        currentIndex: savedProgress.currentIndex
      }
    } else {
      state.value.wordList = shuffle(words)
    }
  }

  // 组件初始化时执行状态初始化
  initState()

  // 计算当前单词（含默认空对象）
  const currentWord = computed(() => {
    const word = state.value.wordList[state.value.currentIndex]
    return word || { name: '', usphone: '', trans: [] }
  })

  // 计算总单词数
  const totalWords = computed(() => state.value.wordList.length)

  // 计算学习进度百分比
  const progress = computed(() => {
    if (totalWords.value === 0) return 0
    return (state.value.currentIndex / totalWords.value) * 100
  })

  // 监听状态变化并保存到本地存储（仅保存列表和索引）
  watch(
    () => ({
      wordList: state.value.wordList,
      currentIndex: state.value.currentIndex
    }),
    (newValue) => {
      storageService.saveProgress(newValue)
    },
    { deep: true }
  )

  // 切换到下一个单词
  function nextWord() {
    if (state.value.currentIndex < state.value.wordList.length - 1) {
      state.value.currentIndex++
    } else {
      // 循环重置单词列表
      state.value.wordList = shuffle(words)
      state.value.currentIndex = 0
    }
    state.value.typedChars = []
  }

  // 重置所有状态（清空进度）
  function reset() {
    state.value = {
      wordList: shuffle(words),
      currentIndex: 0,
      typedChars: [],
      errors: 0
    }
    storageService.clearProgress()
  }

  // 增加错误计数
  function increaseErrors() {
    state.value.errors++
  }

  // 暴露可读写的 typedChars 计算属性
  const typedChars = computed({
    get: () => state.value.typedChars,
    set: (value) => {
      state.value.typedChars = value
    }
  })

  return {
    currentWord,
    progress,
    totalWords,
    currentIndex: computed(() => state.value.currentIndex),
    typedChars,
    errors: computed(() => state.value.errors),
    nextWord,
    reset,
    increaseErrors
  }
})