'use client'

import { useState } from 'react'
import { Camera, Upload, Send, MessageSquare, Download, School, Target, Zap, BookOpen, TrendingUp, X, User, LogOut, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function HomePage() {
  const { user, userProfile, loading, signIn, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [inputText, setInputText] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [isUpgradeFlow, setIsUpgradeFlow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentProblems, setRecentProblems] = useState<any[]>([])
  const [pastedImages, setPastedImages] = useState<string[]>([])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // Handle file drop logic here
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setPastedImages(prev => [...prev, result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageItems = items.filter(item => item.type.startsWith('image/'))
    
    imageItems.forEach(item => {
      const file = item.getAsFile()
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setPastedImages(prev => [...prev, result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleSignIn = () => {
    setIsUpgradeFlow(false)
    setShowSignInModal(true)
  }

  const handleUpgrade = () => {
    setIsUpgradeFlow(true)
    setShowSignInModal(true)
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn()
      setShowSignInModal(false)
    } catch (error) {
      console.error('Sign in error:', error)
      // You could add toast notification here
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleSolveProblem = async () => {
    if (!inputText.trim() && pastedImages.length === 0) return

    setIsSubmitting(true)
    try {
      // For now, just simulate saving the problem
      console.log('Saving problem:', inputText)
      console.log('Pasted images:', pastedImages.length)
      
      // Clear the input and images
      setInputText('')
      setPastedImages([])
      
      // You could add success notification here
      console.log('Problem saved successfully!')
    } catch (error) {
      console.error('Error saving problem:', error)
      // You could add error notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowSignInModal(false)
    setIsUpgradeFlow(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
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
                <span className="text-xl font-bold text-gray-900">Adiar Math</span>
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
                    {user.photoURL ? (
                      <Image 
                        src={user.photoURL} 
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
                      {user.displayName || user.email}
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
                    onClick={handleSignIn}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleUpgrade}
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

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isUpgradeFlow ? 'Upgrade to Premium' : 'Sign In to Adiar Math'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {isUpgradeFlow && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Premium Features:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Unlimited SAT practice problems</li>
                  <li>• Advanced Desmos tutorials</li>
                  <li>• Personalized study plans</li>
                  <li>• Progress analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            )}
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>
                {isUpgradeFlow ? 'Continue with Google' : 'Sign in with Google'}
              </span>
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isUpgradeFlow 
                  ? 'Already have an account?' 
                  : "Don't have an account?"
                }
                <button 
                  onClick={() => setIsUpgradeFlow(!isUpgradeFlow)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-1 transition-colors duration-200"
                >
                  {isUpgradeFlow ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Adiar Math – The SAT Desmos Math Tutor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-200">
            Master SAT math with AI-powered Desmos training. Think strategically, solve efficiently, and leverage the exact tool you'll use on test day.
          </p>
          
          {/* Subject Tab */}
          <div className="flex justify-center mb-8">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              SAT Desmos Training
            </button>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-sm transition-colors duration-200">
          {/* Image Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Camera className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload your SAT math problem
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Take a picture or drag & drop images/PDFs of SAT questions
            </p>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Type your SAT math question here... (You can also paste images with Ctrl+V)"
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            />
            
            {/* Display Pasted Images */}
            {pastedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pasted Images:</h4>
                <div className="flex flex-wrap gap-2">
                  {pastedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Pasted image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() => setPastedImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition-colors duration-200">
                Desmos Input
              </button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition-colors duration-200">
                SAT Tools
              </button>
            </div>
            
            <button 
              onClick={handleSolveProblem}
              disabled={(!inputText.trim() && pastedImages.length === 0) || isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center space-x2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Solving...' : 'Solve with Desmos'}</span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center transition-colors duration-200">
            Revolutionize Your SAT Math Preparation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI-Powered Problem Solving
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI breaks down SAT math questions step-by-step, showing you exactly how to use Desmos to solve them efficiently. 
                Learn the "how" not just the "what."
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
              <div className="flex items-center mb-3">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Interactive Desmos Walkthroughs
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Watch solutions unfold inside Desmos, then replicate the steps yourself to build real test-day confidence and muscle memory.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personalized Adaptive Practice
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                AI identifies your weak areas (algebra, functions, geometry, statistics) and generates customized problem sets for rapid score improvement.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Video Explanations & Strategy
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Complementary video lessons reinforce concepts and demonstrate Desmos shortcuts for maximum efficiency on test day.
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 transition-colors duration-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Affordable Elite SAT Prep
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Get comprehensive SAT math + Desmos prep for just $19.99/month — less than the price of a single tutoring session.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions */}
        <div className="mt-16">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Recent Practice Sessions</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center transition-colors duration-200">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">
              {user ? 'No practice sessions yet' : 'Sign in to see your practice sessions'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {user ? 'Start solving SAT problems to see your progress here' : 'Your progress will be saved when you sign in'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-2">
              <Image 
                src="/adiar.png" 
                alt="Adiar Math Logo" 
                width={24} 
                height={24}
                className="rounded-lg"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Adiar Math can make mistakes. Please double check important steps and calculations.</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 Adiar Math. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
