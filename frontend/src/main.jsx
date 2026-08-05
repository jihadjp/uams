import React from 'react'
import ReactDOM from 'react-dom/client'
import toast, { Toaster, ToastBar } from 'react-hot-toast'
import { X } from 'lucide-react'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center shrink-0"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  </React.StrictMode>,
)
