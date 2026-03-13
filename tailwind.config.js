/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#F7F8FA',
        card: '#FFFFFF',
        border: '#E5E7EB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        profit: '#16A34A',
        loss: '#DC2626',
        accent: '#2563EB',
      },
      fontSize: {
        'page-title': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        'section-title': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'table-header': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'financial': ['32px', { lineHeight: '1', fontWeight: '600' }],
      },
      spacing: {
        '18': '72px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'dropdown': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}
