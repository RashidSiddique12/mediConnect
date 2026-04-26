
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Healthcare teal — trustworthy, clinical, modern
        brand: {
          50:  { value: '#e6f7f7' },
          100: { value: '#b3e8e8' },
          200: { value: '#80d8d8' },
          300: { value: '#4dc9c9' },
          400: { value: '#26bcbc' },
          500: { value: '#0b9c9c' },
          600: { value: '#087878' },
          700: { value: '#065858' },
          800: { value: '#033a3a' },
          900: { value: '#011c1c' },
        },
        // Accent green for positive states
        accent: {
          50:  { value: '#e8f8ef' },
          500: { value: '#22a65a' },
          600: { value: '#1a8047' },
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body:    { value: `'Inter', sans-serif` },
      },
    },
    semanticTokens: {
      colors: {
        'chakra-body-bg':   { value: { base: '#f0f7f7', _dark: '#0d1117' } },
        'chakra-body-text': { value: { base: 'gray.800', _dark: 'gray.100' } },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export default system
