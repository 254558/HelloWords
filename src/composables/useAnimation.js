import { ref } from 'vue'

export function useAnimation() {
  const animatingElements = ref(new Set())
  
  const animate = (element, animationName, duration = 300) => {
    if (!element || animatingElements.value.has(element)) return
    
    animatingElements.value.add(element)
    element.style.display = 'inline-block' // 确保元素支持transform
    
    element.style.animation = 'none'
    element.offsetHeight // 触发重排
    element.style.animation = `${animationName} ${duration}ms ease`
    
    setTimeout(() => {
      element.style.animation = ''
      animatingElements.value.delete(element)
    }, duration)
  }
  
  const jump = (element) => animate(element, 'jump', 200)
  const shake = (element) => animate(element, 'shake', 300)
  const fadeIn = (element) => animate(element, 'fadeIn', 500)
  const fadeOut = (element) => animate(element, 'fadeOut', 500)
  
  return {
    jump,
    shake,
    fadeIn,
    fadeOut
  }
}