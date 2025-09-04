'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastType } from '@/components/Toast'

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; isVisible: boolean }>>([])

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, message, type, isVisible: true }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.map(toast => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      ))
      
      // Remove toast after animation completes
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, 300)
    }, 5000)
  }, [])

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isVisible: false } : toast
    ))
    
    // Remove toast after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Render all toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => closeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}
