/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        round: [
          '"Nunito"',
          '"Quicksand"',
          '"Rubik"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          '"HarmonyOS Sans"',
          '"MiSans"',
          'system-ui',
          'sans-serif',
        ],
      },
      // 新增动画配置
      animation: {
        jump: 'jump 200ms ease',
        shake: 'shake 300ms ease',
      },
      keyframes: {
        jump: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%, 75%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}