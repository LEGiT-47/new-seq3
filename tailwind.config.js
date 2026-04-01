import tailwindcssAnimate from 'tailwindcss-animate';
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#0B1D35',
                    800: '#102848',
                    700: '#1A3555',
                    600: '#26486E',
                    100: '#B8C8D8',
                    50: '#E8F0F8',
                },
                gold: {
                    600: '#C9A84C',
                    400: '#DAC06E',
                    100: '#F7EED2',
                },
                brand: {
                    amber: '#E8762A',
                    amberDk: '#D76219',
                    cream: '#F8F4EC',
                    white: '#FFFBF5',
                },
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                card: {
                    DEFAULT: 'rgb(var(--card) / <alpha-value>)',
                    foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
                },
                muted: {
                    DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
                    foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
                },
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
                    foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
                },
                border: 'rgb(var(--border) / <alpha-value>)',
                input: 'rgb(var(--input) / <alpha-value>)',
                ring: 'rgb(var(--primary) / <alpha-value>)',
            },
            fontFamily: {
                display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['"DM Sans"', 'Inter', 'sans-serif'],
                body: ['"DM Sans"', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                soft: '0 2px 16px 0 rgba(0,0,0,0.18)',
                medium: '0 4px 32px 0 rgba(0,0,0,0.25)',
                strong: '0 8px 48px 0 rgba(0,0,0,0.35)',
                card: '0 1px 4px 0 rgba(0,0,0,0.12), 0 4px 16px 0 rgba(201,168,76,0.10)',
                gold: '0 0 0 2px #C9A84C',
            },
            backgroundImage: {
                'gradient-navy': 'linear-gradient(135deg, #0B1D35 0%, #1A3555 100%)',
                'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #DAC06E 50%, #C9A84C 100%)',
                'gradient-amber': 'linear-gradient(135deg, #E8762A 0%, #D76219 100%)',
                'gradient-hero': 'linear-gradient(to right, rgba(11,29,53,0.85) 0%, rgba(11,29,53,0.35) 100%)',
                'gradient-card': 'linear-gradient(180deg, rgba(11,29,53,0) 60%, rgba(11,29,53,0.6) 100%)',
                'gradient-primary': 'linear-gradient(135deg, #1A3555 0%, #0B1D35 60%, #102848 100%)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            animation: {
                marquee: 'marquee 28s linear infinite',
                'fade-up': 'fadeUp 0.55s ease both',
                'scale-in': 'scaleIn 0.3s ease both',
                'gold-pulse': 'goldPulse 2.5s ease-in-out infinite',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                goldPulse: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            scale: {
                102: '1.02',
                105: '1.05',
                108: '1.08',
            },
        },
    },
    plugins: [tailwindcssAnimate, lineClamp],
};
