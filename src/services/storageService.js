// words/src/services/storageService.js
const STORAGE_KEY = 'qwerty-learner-'
const DEFAULT_EXPIRATION = 7 * 24 * 60 * 60 * 1000 // 7天

export const storageService = {
  saveProgress(data, expiration = DEFAULT_EXPIRATION) {
    localStorage.setItem(STORAGE_KEY + 'progress', JSON.stringify({
      currentIndex: data.currentIndex,
      wordList: data.wordList,
      timestamp: Date.now(),
      expiration
    }))
  },

  getProgress() {
    const data = localStorage.getItem(STORAGE_KEY + 'progress')
    if (!data) return null

    try {
      const parsed = JSON.parse(data)

      // 验证数据结构
      if (!Array.isArray(parsed.wordList) ||
        typeof parsed.currentIndex !== 'number' ||
        isNaN(parsed.currentIndex) ||
        !parsed.timestamp) {
        console.warn('Invalid progress data format')
        this.clearProgress()
        return null
      }

      // 检查过期
      const expiration = parsed.expiration || DEFAULT_EXPIRATION
      if (Date.now() - parsed.timestamp > expiration) {
        console.log('Progress data expired')
        this.clearProgress()
        return null
      }

      return parsed
    } catch (error) {
      console.error('Failed to parse progress data:', error)
      this.clearProgress()
      return null
    }
  },

  clearProgress() {
    localStorage.removeItem(STORAGE_KEY + 'progress')
  },

  // 可选增强方法
  getAllData() {
    const keys = Object.keys(localStorage)
     .filter(key => key.startsWith(STORAGE_KEY))

    return keys.reduce((result, key) => {
      try {
        result[key] = JSON.parse(localStorage.getItem(key))
      } catch (error) {
        console.error(`Failed to parse ${key}:`, error)
      }
      return result
    }, {})
  },

  clearAll() {
    const keys = Object.keys(localStorage)
     .filter(key => key.startsWith(STORAGE_KEY))

    keys.forEach(key => localStorage.removeItem(key))
  }
}