<template>
  <div class="word-display">
    <div class="word" @click="handleSpeak">
      <span
        v-for="(char, index) in word.name"
        :key="index"
        :class="{
          'text-green-400': isCharCorrect(index),
          'text-red-500': isCharError(index),
          'cursor': index === currentIndex && !hasError
        }"
        :ref="(el) => setCharRef(el, index)"
      >{{ char }}</span>
    </div>
    <div class="phonetic" @click="handleSpeak">{{ word.usphone }}</div>
    <div class="translation">
      <div class="trans-container">
        <p v-for="(part, index) in formattedTrans" :key="index" class="trans-part">
          {{ part }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useSound } from '../composables/useSound'
import { useAnimation } from '../composables/useAnimation'

const { speakWord } = useSound()
const { jump, shake } = useAnimation()

const props = defineProps({
  word: {
    type: Object,
    required: true,
    default: () => ({ name: '', usphone: '', trans: [] })
  },
  typedChars: { type: Array, default: () => [] },
  currentIndex: { type: Number, required: true }
})

const chars = ref([])

const setCharRef = (el, idx) => {
  if (el) {
    chars.value[idx] = el?.$el || el
    console.log(`字符 ${idx} 引用已设置:`, chars.value[idx])
  }
}

onMounted(() => {
  const wordLength = props.word?.name?.length || 0
  chars.value = Array(wordLength).fill(null)
  nextTick(() => console.log('字符引用初始化完成:', chars.value))
})

const handleSpeak = () => {
  if (props.word?.name) speakWord(props.word.name)
}

const isCharCorrect = (idx) => props.typedChars[idx] === props.word.name[idx]?.toLowerCase()
const isCharError = (idx) => props.typedChars[idx] && props.typedChars[idx] !== props.word.name[idx]?.toLowerCase()
const hasError = () => props.typedChars.some((char, idx) => char && char !== props.word.name[idx]?.toLowerCase())

const WORD_TYPES = ['n.', 'v.', 'vt.', 'vi.', 'adj.', 'adv.', 'pron.', 'prep.', 'conj.', 'art.', 'num.', 'interj.']
const formattedTrans = computed(() => {
  if (!props.word?.trans?.length) return []
  const text = props.word.trans[0]
  const pattern = new RegExp(`(?=${WORD_TYPES.map(type => `\\s${type}\\s|^${type}\\s`).join('|')})`)
  return text.split(pattern).map(part => part.trim()).filter(Boolean)
})

defineExpose({ chars, handleSpeak })
</script>

<style scoped>
.word-display {
  @apply flex flex-col items-center justify-start text-center h-[calc(100vh-300px)];
  padding-top: 5rem;
}
.word {
  @apply text-[120px] font-mono tracking-wider text-white cursor-pointer select-none hover:opacity-80 transition-opacity leading-none mb-12;
}
.word span {
  @apply inline-block;
}
.phonetic {
  @apply text-4xl text-gray-400 cursor-pointer select-none hover:text-gray-300 transition-colors font-light tracking-wide mb-12;
}
.translation {
  @apply flex justify-center w-full;
}
.trans-container {
  @apply inline-flex flex-col items-start gap-4;
}
.trans-part {
  @apply text-2xl text-gray-300 leading-normal text-left font-light tracking-wide;
}
.cursor {
  @apply relative;
}
.cursor::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-1 bg-white opacity-50;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0; }
}
</style>