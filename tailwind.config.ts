import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          maroon: '#5b0202',
          'maroon-600': '#6e0a0a',
          'maroon-700': '#4a0202',
          gold: '#daa520',
          'gold-soft': '#f3d27a',
        },
        status: {
          'posted': '#1e5fbf',
          'posted-bg': '#e8f0fb',
          'approved': '#0f7a55',
          'approved-bg': '#e3f4ec',
          'pending': '#a36a00',
          'pending-bg': '#fbf1dc',
          'void': '#a3201c',
          'void-bg': '#fbe6e5',
          'draft': '#5b6573',
          'draft-bg': '#eef1f4',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}

export default config
