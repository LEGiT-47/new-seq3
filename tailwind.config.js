import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    amber: '#E8762A',
                    green: '#2D5016',
                    dark: '#1A0A00',
                    cream: '#FDF6EC',
                    muted: '#F5EFE6',
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
                border: 'rgb(var(--border) / <alpha-value>)',
                input: 'rgb(var(--border) / <alpha-value>)',
                ring: 'rgb(var(--primary) / <alpha-value>)',
            },
            fontFamily: {
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                body: ['"DM Sans"', 'Inter', 'sans-serif'],
                sans: ['"DM Sans"', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                soft: '0 2px 16px 0 rgba(26,10,0,0.07)',
                medium: '0 4px 32px 0 rgba(26,10,0,0.13)',
                strong: '0 8px 48px 0 rgba(26,10,0,0.18)',
                card: '0 1px 4px 0 rgba(26,10,0,0.08), 0 4px 16px 0 rgba(232,118,42,0.08)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #E8762A 0%, #c45e1a 60%, #1A0A00 100%)',
                'gradient-green': 'linear-gradient(135deg, #2D5016 0%, #1a2e0a 100%)',
                'gradient-warm': 'linear-gradient(180deg, #FDF6EC 0%, #F5EFE6 100%)',
                'gradient-hero': 'linear-gradient(to right, rgba(26,10,0,0.72) 0%, rgba(26,10,0,0.2) 100%)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            scale: {
                108: '1.08',
            },
            animation: {
                marquee: 'marquee 28s linear infinite',
                'fade-up': 'fadeUp 0.5s ease both',
                'scale-in': 'scaleIn 0.3s ease both',
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
                    '0%': { opacity: '0', transform: 'scale(0.96)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
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
        },
    },
    plugins: [tailwindcssAnimate],
};
