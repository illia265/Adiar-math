'use client'

import { User, LogOut, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  onSignIn: () => void
  onUpgrade: () => void
}

export const Header = ({ onSignIn, onUpgrade }: HeaderProps) => {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Image 
                src="/adiar.png" 
                alt="Adiar Math Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Adiar Math</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.user_metadata?.avatar_url ? (
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      width={32} 
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-2 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={onSignIn}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </button>
                <button 
                  onClick={onUpgrade}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm transition-colors duration-200"
                >
                  Upgrade
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
