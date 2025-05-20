/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                '7/10': '70%',
                '3/10': '30%',
                'fill': '-webkit-fill-available',
                '250': '250px',
                '78': '78px',
                '10px': '10px',
            },
            fontSize: {
                '2xs': '.625rem',
                '3xs': '.5rem',
            },
            maxHeight: {
                'listagem': 'calc(100% - 150px)',
                'full-28': 'calc(100% - 28px)',
                'full-40': 'calc(100% - 40px)',
            },
            boxShadow: {
                'default': '8px 8px 13px 0px rgba(0, 0, 0, 0.2)',
            },
        },
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1279px',
            '2xl': '1535px',
            '3xl': '1920px',
        },
    },
    plugins: [],
}