
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
					foreground: 'hsl(var(--accent-foreground))'
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
				// Sci-Fi Theme Colors
				'neon-purple': '#9b87f5',
				'neon-blue': '#1EAEDB',
				'neon-pink': '#D946EF',
				'dark-bg': '#1A1F2C',
				'dark-card': '#222222',
				'dark-accent': '#403E43',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"pulse-glow": {
					"0%, 100%": { 
						boxShadow: "0 0 5px #9b87f5, 0 0 10px #9b87f5, 0 0 15px #9b87f5" 
					},
					"50%": { 
						boxShadow: "0 0 10px #9b87f5, 0 0 20px #9b87f5, 0 0 30px #9b87f5" 
					}
				},
				"text-glitch": {
					"0%, 100%": { transform: "translate(0)" },
					"20%": { transform: "translate(-2px, 2px)" },
					"40%": { transform: "translate(-2px, -2px)" },
					"60%": { transform: "translate(2px, 2px)" },
					"80%": { transform: "translate(2px, -2px)" }
				},
				"scanning-line": {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(100%)" }
				},
				"flicker": {
					"0%, 100%": { opacity: "1" },
					"33%": { opacity: "0.85" },
					"66%": { opacity: "0.95" }
				},
				"rotate-glow": {
					"0%": { 
						transform: "rotate(0deg)", 
						boxShadow: "0 0 10px #1EAEDB, 0 0 20px #1EAEDB" 
					},
					"100%": { 
						transform: "rotate(360deg)", 
						boxShadow: "0 0 15px #D946EF, 0 0 30px #D946EF" 
					}
				},
				"decrypt-text": {
					"0%": { 
						content: "'%$#@!&*'",
						color: "#D946EF"
					},
					"50%": {
						content: "'Decrypting...'",
						color: "#1EAEDB"
					},
					"100%": {
						content: "attr(data-final-text)",
						color: "#9b87f5"
					}
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" }
				},
				"slide-up": {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-glow": "pulse-glow 2s infinite",
				"text-glitch": "text-glitch 0.5s infinite",
				"scanning-line": "scanning-line 2s linear infinite",
				"flicker": "flicker 1.5s linear infinite",
				"rotate-glow": "rotate-glow 10s linear infinite",
				"decrypt-text": "decrypt-text 2s forwards",
				"fade-in": "fade-in 0.5s ease-out",
				"slide-up": "slide-up 0.5s ease-out"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
