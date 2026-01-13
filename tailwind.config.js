/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                space: {
                    25: '#F1F5F9',
                    50: '#E2E8F0',
                    100: '#CBD5E1',
                    900: '#111827',
                    950: '#030712'
                },
                brand: {
                    50: '#EEF2FF',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                    light: '#818CF8'
                }
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
                '6xl': '3.5rem',
            }
        },
    },
    plugins: [],
}
