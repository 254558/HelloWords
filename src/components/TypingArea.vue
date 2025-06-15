<template>
  <div 
    class="typing-area" 
    tabindex="0" 
    ref="areaRef"
    @keydown="handleKeydown"
    @blur="handleBlur"
  >
    <div class="word-container">
      <WordCard
        :word="store.currentWord"
        :typedChars="store.typedChars"
        :currentIndex="inputState.length"
        ref="wordCardRef"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useWordStore } from '../stores/word'
import WordCard from './WordCard.vue'
import { useTyping } from '../composables/useTyping'
import { useSound } from '../composables/useSound'
import { useAnimation } from '../composables/useAnimation'
import { errorHandler } from '../utils/errorHandler'

const VALID_CHAR_REGEX = /^[a-zA-Z\-']$/

const store = useWordStore()
const areaRef = ref(null)
const wordCardRef = ref(null)
const { inputState, handleInput, handleBackspace, reset } = useTyping()
const { playKeySound, playErrorSound, speakWord } = useSound()
const { jump, shake } = useAnimation()

// 监听当前单词变化，自动朗读
watch(
  () => store.currentWord,
  (newWord) => {
    if (newWord?.name) {
      try {
        speakWord(newWord.name)
      } catch (error) {
        errorHandler.handleAudioError(error)
      }
      reset()
      store.typedChars = []
    }
  },
  { immediate: true }
)

// 监听输入状态变化，同步到 store
watch(inputState, (newValue) => {
  store.typedChars = newValue.split('')
})

// 处理键盘输入
const handleKeydown = (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  
  const currentLength = inputState.value.length
  const correctChar = store.currentWord.name[currentLength]?.toLowerCase()
  
  if (event.key.length === 1) {
    if (VALID_CHAR_REGEX.test(event.key)) {
      const inputChar = event.key.toLowerCase()
      
      if (correctChar) {
        handleInput(inputChar)
        
        if (inputChar === correctChar) {
          setTimeout(() => {
            try { 
              playKeySound() 
            } catch (error) {
              errorHandler.handleAudioError(error) 
            }
          }, 0)

          const chars = wordCardRef.value?.chars
          if (chars && chars[currentLength]) {
            jump(chars[currentLength])
          }
          
          if (inputState.value === store.currentWord.name) {
            setTimeout(() => {
              reset()
              store.typedChars = []
              store.nextWord()
            }, 300)
          }
        } else {
          setTimeout(() => {
            try { 
              playErrorSound() 
            } catch (error) {
              errorHandler.handleAudioError(error) 
            }
          }, 0)

          const chars = wordCardRef.value?.chars
          if (chars && chars[currentLength]) {
            shake(chars[currentLength])
          }
          
          store.increaseErrors?.()
        }
      }
    }
  } else if (event.key === 'Backspace') {
    if (inputState.value.length > 0) {
      setTimeout(() => {
        try { 
          playKeySound() 
        } catch (error) {
          errorHandler.handleAudioError(error) 
        }
      }, 0)

      handleBackspace()
      store.typedChars.pop()
    }
  }
}

// 处理失去焦点
const handleBlur = () => {
  setTimeout(() => {
    areaRef.value?.focus()
  }, 0)
}

// 组件挂载时自动获取焦点
onMounted(() => {
  areaRef.value?.focus()
})
</script>

<style scoped>
.typing-area {
  @apply w-full outline-none flex items-center justify-center;
}
.word-container {
  @apply flex flex-col items-center justify-center;
}
</style>