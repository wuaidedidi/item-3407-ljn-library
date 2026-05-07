/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ljnPrimary: '#e8a0bf',
        ljnPrimaryDark: '#d4789e',
        ljnPrimaryLight: '#f5d5e5',
        ljnSecondary: '#b4d4ee',
        ljnSecondaryDark: '#8abcdc',
        ljnAccent: '#f9c5d1',
        ljnBg: '#fef7fa',
        ljnCard: '#ffffff',
        ljnText: '#4a3347',
        ljnTextLight: '#8a7088',
        ljnBorder: '#f0dce6',
        ljnSuccess: '#7ecda0',
        ljnWarning: '#f5c373',
        ljnDanger: '#ef8b8b',
      },
      fontFamily: {
        ljnSans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        ljnSoft: '0 2px 15px rgba(232, 160, 191, 0.15)',
        ljnHover: '0 4px 20px rgba(232, 160, 191, 0.25)',
        ljnCard: '0 1px 10px rgba(232, 160, 191, 0.1)',
      },
      borderRadius: {
        ljn: '12px',
        ljnLg: '16px',
      }
    },
  },
  plugins: [],
}
