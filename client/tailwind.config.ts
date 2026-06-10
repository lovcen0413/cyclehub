import type { Config } from 'tailwindcss';

export default {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#111111',
        accent: '#FF2442',
        background: '#FFFFFF',
        'background-secondary': '#F7F7F7',
        border: '#ECECEC',
        'text-primary': '#111111',
        'text-secondary': '#888888',
        'text-tertiary': '#BBBBBB',
      },
      spacing: {
        '4.5': '18px',
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
