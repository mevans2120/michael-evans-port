import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		// Optimized paths - only scan where Tailwind classes are actually used
		"./src/app/**/*.{ts,tsx}",
		"./src/components/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
				serif: ['var(--font-serif)', 'Georgia', 'serif'],
			},
			height: {
				'dvh': '100dvh', // Dynamic viewport height for mobile browsers
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				navigation: {
					DEFAULT: 'hsl(var(--navigation-background))',
					foreground: 'hsl(var(--navigation-foreground))',
					border: 'hsl(var(--navigation-border))',
					link: 'hsl(var(--navigation-link))',
					'link-hover': 'hsl(var(--navigation-link-hover))',
					'link-hover-bg': 'hsl(var(--navigation-link-hover-bg))'
				},
				chat: {
					DEFAULT: 'hsl(var(--chat-background))',
					foreground: 'hsl(var(--chat-foreground))',
					border: 'hsl(var(--chat-border))',
					message: 'hsl(var(--chat-message-bg))',
					input: 'hsl(var(--chat-input-bg))',
					'input-border': 'hsl(var(--chat-input-border))',
					'input-text': 'hsl(var(--chat-input-text))',
					'user-bubble': 'hsl(var(--chat-user-bubble-bg))',
					'user-bubble-text': 'hsl(var(--chat-user-bubble-text))',
					suggestion: 'hsl(var(--chat-suggestion-bg))',
					'suggestion-hover': 'hsl(var(--chat-suggestion-hover))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				button: {
					primary: 'hsl(var(--color-button-primary))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					light: 'hsl(var(--accent-light))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				code: {
					block: 'hsl(var(--code-block-bg))'
				},
				error: {
					DEFAULT: 'hsl(var(--error-bg))',
					border: 'hsl(var(--error-border))',
					text: 'hsl(var(--error-text))'
				},
				'ai-card': {
					DEFAULT: 'hsl(var(--ai-card-background))',
					foreground: 'hsl(var(--ai-card-foreground))',
					border: 'hsl(var(--ai-card-border))',
					'border-hover': 'hsl(var(--ai-card-border-hover))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'blink': {
					'0%, 49%': { opacity: '1' },
					'50%, 100%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'blink': 'blink 1s step-end infinite'
			},
			transitionDuration: {
				'fast': '150ms',
				'normal': '300ms',
				'slow': '400ms',
				'slower': '600ms',
				'slowest': '1200ms',
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			},
			animationDelay: {
				'100': '100ms',
				'200': '200ms',
				'300': '300ms',
				'400': '400ms',
				'500': '500ms',
				'600': '600ms',
				'700': '700ms',
				'800': '800ms',
			},
			zIndex: {
				'55': '55',
				'60': '60',
				'65': '65',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography")({
			className: 'prose', // Only generate .prose classes, not global styles
		}),
	],
} satisfies Config;
