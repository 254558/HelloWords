// HelloWords/src/stores/word.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import words from '../data/words.json'
import { shuffle } from '../utils/shuffle'
import { storageService } from '../services/storageService'

export const useWordStore = defineStore('word', () => {
  const state = ref({
    wordList: [],
    currentIndex: 0,
    typedChars: [],
    errors: 0
  })

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

  initState()

  const currentWord = computed(() => {
    const word = state.value.wordList[state.value.currentIndex]
    return word || { name: '', usphone: '', trans: [] }
  })

  const totalWords = computed(() => state.value.wordList.length)

  const progress = computed(() => {
    if (totalWords.value === 0) return 0
    return (state.value.currentIndex / totalWords.value) * 100
  })

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

  function nextWord() {
    if (state.value.currentIndex < state.value.wordList.length - 1) {
      state.value.currentIndex++
    } else {
      state.value.wordList = shuffle(words)
      state.value.currentIndex = 0
    }
    state.value.typedChars = []
  }

  function reset() {
    state.value = {
      wordList: shuffle(words),
      currentIndex: 0,
      typedChars: [],
      errors: 0
    }
    storageService.clearProgress()
  }

  function increaseErrors() {
    state.value.errors++
  }

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