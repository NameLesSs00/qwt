import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { ToastProvider } from './components/toast/ToastProvider.tsx'
import { store } from './store/store.ts'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </Provider>
  </StrictMode>,
)
