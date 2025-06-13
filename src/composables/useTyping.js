import { ref, computed, watch } from 'vue'

export function useTyping(maxLength = Infinity, customValidator = null) {
  const inputState = ref('')
  
  // 可选：从props接收最大长度限制
  const maxLengthRef = ref(maxLength)
  
  const handleInput = (char) => {
    if (
      isValidInput(char) && 
      inputState.value.length < maxLengthRef.value
    ) {
      inputState.value += char
    }
  }
  
  const handleBackspace = (event) => {
    if (event?.ctrlKey) {
      // 删除到上一个单词边界
      inputState.value = inputState.value.replace(/\w+$/, '')
    } else {
      // 普通删除
      inputState.value = inputState.value.slice(0, -1)
    }
  }
  
  const isValidInput = (char) => {
    if (!/^[a-zA-Z\-']$/.test(char)) return false
    if (customValidator && typeof customValidator === 'function') {
      return customValidator(char, inputState.value.length)
    }
    return true
  }

  const reset = () => {
    inputState.value = ''
  }
  
  // 可选：计算属性获取字符数组
  const typedChars = computed(() => 
    inputState.value.split('')
  )
  
  return {
    inputState,
    typedChars, // 如果需要保留字符数组
    handleInput,
    handleBackspace,
    reset
  }
}