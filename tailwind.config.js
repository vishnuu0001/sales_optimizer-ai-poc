/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1', // Indigo
                    600: '#4f46e5',
                    700: '#4338ca',
                    900: '#312e81',
                },
                accent: {
                    purple: '#8b5cf6',
                    teal: '#14b8a6',
                    rose: '#f43f5e',
                },
                dark: {
                    bg: '#0f172a',
                    surface: '#1e293b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(79, 70, 229, 0.15)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
            }
        },
    },
    plugins: [],
}