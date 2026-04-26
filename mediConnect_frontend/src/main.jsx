
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import store from '@/app/store'
import theme from '@/styles/theme'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider value={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </StrictMode>,
)
