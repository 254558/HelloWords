// HelloWords/src/composables/useSound.js
import { ref, onMounted } from 'vue';

export function useSound() {
  const KEY_SOUND_BASE64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAAD+QBiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmKWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAToAAAAAAAAA/lOI9d2AAAAAAD/+1DEAAAFjAMNtBGAAhOk7fcw0AKQkEkEgARxKAtJw+qTL63n8Pl3hgu8H1Ah//KO8o7/yjjn5RzMgUd/+GP1w/dNlsZhMHA4BgKBgKAzdpyfCviwJQTCXvOzikdivbhtokUzN4DEGKiX60ykCQhXHyXVTTkgVDCDemMgScSs3UyETQYMd5LEYScbxyFI9+Jg5mIwXhoTZ0Hb+YlMml8eA8SlTdA3/+XzJNZeKx+JU6/T//70SWOkAuoTY/Wa/67hI5N48+XVkv9aaSAbVjkA//tSxASAC1B/dbz0ABF8Eau8ww3gl4jxwnDMPoz0CX1mTiuQ5iYma0A2Hg8ctDQ5D5r+GubZm9SVb71WvVa7KOZzCZaioGhKCoTKuMFTpU2xYiliKgKBLrvFAaX3/BUN++VBUFuusyaEVWMxAARTnXAsvClKXhAOruCIeGBZdJSxtBPBvTOst8j/tGO5fcZRSIcQKuw90kMz7p/HDn6xwYf3gmEXtSpyroYLsQXKM/2BtR57bSyUKaaQETYgbBoEwJSQhhiVqJhTZkRGFHJLy6j/+1LEBYALdLlb9PGAAYMQ7f8egAOvk8NBVnSujqfNjGqXsFTJ58+BGoYUZGJNSnujLSVdVIxhOZmXujMUY0FRgwE39/9m8iP22FA1KnQ1llPUeO4a/+21Sn9QdqBo8d2kURfVnUKiPDIqqqKiIZtutxuyWQAMiwYzKnYEFICcidoePrVzvLYqoIqLhzEqcXYJwRRNV6WUSI/Kq0VThwNQaKaxF79dnvUo833sqczG3JT/8pYf2fB1jsqvZ2v48P/WX0/wlf9KAEABwMAgpLmkSP/7UsQFA8thDx68YwAAAAA0gAAABOzMz//5mZyiSU+q/k1HZmf/JGv2qq70SSp8YkSw4lTzziUtrzLEiSOeq8goTpEii1ORAKTzjV5I1//2qvVV/6rtXfGOJBIGuj3fgr1nf/xF7ExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
  const ERROR_SOUND_BASE64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAAD+QBiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmKWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAMPAAAAAAAAA/n85Wy0AAAAAAD/+1DEAAAJXQLuFIQACZQjcLce0AK/iv93eyAaAKB4NAUBYodh/ZBkihm73CSiV9+6U73AoZIoZTu9////CV7ve7voKChkihklnwQZIoZLvCJJCbvomlS+hCSKGUHh7x483e51GgEApHIxGApAH7mubwfssYCe+rTi5AKkLKDBvoKTd6AIWJWpjby4CFhz1JUn+BRy1YcwlEna35KArALQF8ARYJ23/5aI2C1jLHgdJdL//iYDCFCXDQ+tf//+Sh43JRwY2v/61QAmvu6/wNLm//tSxAWAC2kbYzj0AAGGIytnEoAAA1xIJ5RY3xQmSHvmaI+BsDdWqwHB4dKCNHAc1Fa6K4iksbNcVZlItWrfLNRmnJpKS0QL1d3dp3V20Wirtf31jU54rpe9eW8p4jr/zKHJ7+V/qGRAgwk488AHTplfE5tdBjLCyz0aQjDizBUwUGlBwSSMsWEeRDFChYWgTGLYstNIX6PoQyRxhsNSTFS91R8lwxh21QnREL1vN7JX8TzMcVCfJVXskbyop1fHPmhzfjnoov9MEAAUAAAEMEn/+1LEBQALAQFnOJOAAY8cqYMSkAA+vaYrAPyHOKANrNy0RjR4piIDBsLyTPis4iIk1DlogkioH4uB6hypfxxTCYjCnOan40HSh5Q8gp3/TGpQmcrMp2v1/4jClgcDZX/+hehshb0TUEVnXGZMjNj40J4Fpso4rCzLxSjkmGqMIR98oGURCs0vBb4zSVZq8OqxsVPNqtSnNjbmvCbK0sZ2MG7+Nxyf7TstmGXrpX5e3KLhQqQCLTodXvG0JBwanS57/ztutHc6eIiIZ3ZmZmVg3//7UsQFAAuQqYH4xAAREofe64IwANw2Gw3GANyYGQWMulkiGR61J1fdmoHhEIYAWaAgESAto1toDoRLOFRVf8IomLFaPv+f0mqaWni//xylWxIolAt4hMGwAo9U33hxF7mGBQr/62EgQqAILRAWMIQqQhScwqL6qrAwEQYCYCnTwiDsFVuESw2JTqg7/gr6gaxEWPVHhF/8RFjxVQcBp50Rf8sHfwVKnaw3waVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

  // 音频上下文和缓冲
  let audioContext = null;
  let keyBuffer = null;
  let errorBuffer = null;
  let isInitialized = false;

  // 初始化音频上下文
  const initAudioContext = () => {
    if (audioContext) return;

    // 创建音频上下文
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // 为iOS设备解锁音频
      const unlockAudio = () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume().catch(e => console.error('无法恢复音频上下文:', e));
        }

        // 移除解锁事件
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('click', unlockAudio);
      };

      // 在用户交互时解锁音频
      document.addEventListener('touchstart', unlockAudio, { once: true });
      document.addEventListener('click', unlockAudio, { once: true });
    } catch (error) {
      console.error('创建音频上下文失败:', error);
    }
  };

  // 解码Base64音频数据
  const decodeAudioData = (base64Data) => {
    // 移除数据前缀
    const base64Audio = base64Data.replace(/^data:audio\/\w+;base64,/, '');
    const binary = atob(base64Audio);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i);
    }

    return buffer;
  };

  // 加载并解码音频
  const loadSounds = async () => {
    if (!audioContext) return;

    try {
      // 解码键盘音效
      const keyArrayBuffer = decodeAudioData(KEY_SOUND_BASE64);
      keyBuffer = await audioContext.decodeAudioData(keyArrayBuffer);

      // 解码错误音效
      const errorArrayBuffer = decodeAudioData(ERROR_SOUND_BASE64);
      errorBuffer = await audioContext.decodeAudioData(errorArrayBuffer);

      isInitialized = true;
      console.log('音频资源加载完成');
    } catch (error) {
      console.error('加载音频失败:', error);
    }
  };

  // 初始化音频系统
  const initialize = async () => {
    initAudioContext();
    await loadSounds();
  };

  // 在组件挂载时初始化音频系统
  onMounted(async () => {
    await initialize();
  });

  // 播放键盘音效
  const playKeySound = () => {
    if (!isInitialized || !keyBuffer) {
      console.warn('音频系统未初始化，使用备用方法');
      // 备用方案：使用Audio元素
      const audio = new Audio(KEY_SOUND_BASE64);
      audio.volume = 1;
      audio.play().catch(e => console.error('备用播放失败:', e));
      return;
    }

    // 创建音频缓冲区节点
    const source = audioContext.createBufferSource();
    source.buffer = keyBuffer;
    source.connect(audioContext.destination);

    // 立即播放
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        source.start(audioContext.currentTime);
      }).catch(e => console.error('恢复音频上下文失败:', e));
    } else {
      source.start(audioContext.currentTime);
    }
  };

  // 播放错误音效
  const playErrorSound = () => {
    if (!isInitialized || !errorBuffer) {
      console.warn('音频系统未初始化，使用备用方法');
      // 备用方案：使用Audio元素
      const audio = new Audio(ERROR_SOUND_BASE64);
      audio.volume = 1;
      audio.play().catch(e => console.error('备用播放失败:', e));
      return;
    }

    // 创建音频缓冲区节点
    const source = audioContext.createBufferSource();
    source.buffer = errorBuffer;
    source.connect(audioContext.destination);

    // 立即播放
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        source.start(audioContext.currentTime);
      }).catch(e => console.error('恢复音频上下文失败:', e));
    } else {
      source.start(audioContext.currentTime);
    }
  };

  // 语音合成（保持不变）
  const speakWord = (word) => {
    if (!word) return;

    try {
      // 停止任何正在播放的语音
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      // 创建新的语音实例
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // 语速稍慢一点

      // 开始语音合成
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('语音合成失败:', error);
    }
  };

  return {
    playKeySound,
    playErrorSound,
    speakWord
  };
}