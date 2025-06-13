export function useSound() {
  // 音频文件路径
  const KEY_SOUND_URL = '/sounds/keyboard.mp3'
  const ERROR_SOUND_URL = '/sounds/error.mp3'
  
  // 复用音频对象，避免重复创建
  const keySound = new Audio(KEY_SOUND_URL)
  const errorSound = new Audio(ERROR_SOUND_URL)
  const isAudioReady = false // 音频准备状态
  
  // 预加载音频
  const preloadAudio = () => {
    keySound.load()
    errorSound.load()
    
    // 首次播放初始化（解决浏览器自动播放限制）
    keySound.play().then(() => {
      isAudioReady = true
    }).catch(error => {
      console.log('音频初始化失败:', error)
    })
  }
  
  // 按键音效
  const playKeySound = () => {
    if (!isAudioReady) {
      preloadAudio()
      return
    }
    
    // 重置音频并播放
    keySound.currentTime = 0
    keySound.play().catch(error => {
      console.log('按键音效播放失败:', error)
    })
  }
  
  // 错误音效
  const playErrorSound = () => {
    if (!isAudioReady) {
      preloadAudio()
      return
    }
    
    errorSound.currentTime = 0
    errorSound.play().catch(error => {
      console.log('错误音效播放失败:', error)
    })
  }
  
  // 单词发音
  const speakWord = (word) => {
    if (!word) return
    
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    
    // 处理语音合成错误
    utterance.onerror = (event) => {
      console.log('语音合成错误:', event.error)
    }
    
    speechSynthesis.speak(utterance)
  }
  
  return {
    playKeySound,
    playErrorSound,
    speakWord
  }
}