import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'rgba(var(--background))',
  			foreground: 'rgba(var(--foreground))',
			customPurp: 'rgba(228, 100, 124, 1)', // Min custom farge
			customPink: 'rgba(255, 188, 200, 1)', // Min custom farge
			customDarkPurp: 'rgba(228, 100, 124, 0.7)', // Min custom farge
  			card: {
  				DEFAULT: 'rgba(var(--card))',
  				foreground: 'rgba(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'rgba(var(--popover))',
  				foreground: 'rgba(var(--popover-foreground))'
  			},
  			primary: { //customPurp
  				DEFAULT: 'rgba(var(--primary))',
  				foreground: 'rgba(var(--primary-foreground))'
  			},
  			secondary: { //customPink
  				DEFAULT: 'rgba(var(--secondary))',
  				foreground: 'rgba(var(--secondary-foreground))'
  			},
  			muted: { // Dark purp
  				DEFAULT: 'rgba(var(--muted))',
  				foreground: 'rgba(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'rgba(var(--accent))',
  				foreground: 'rgba(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'rgba(var(--destructive))',
  				foreground: 'rgba(var(--destructive-foreground))'
  			},
  			border: 'rgba(var(--border))',
  			input: 'rgba(var(--input))',
  			ring: 'rgba(var(--ring))',
  			chart: {
  				'1': 'rgba(var(--chart-1))',
  				'2': 'rgba(var(--chart-2))',
  				'3': 'rgba(var(--chart-3))',
  				'4': 'rgba(var(--chart-4))',
  				'5': 'rgba(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
	// eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
