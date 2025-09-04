'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Header } from '@/components/Header'
import { ProblemInput } from '@/components/ProblemInput'
import { SignInModal } from '@/components/SignInModal'
import { FeaturesSection } from '@/components/FeaturesSection'
import { ValueProposition } from '@/components/ValueProposition'
import { Footer } from '@/components/Footer'
import { LoadingOverlay } from '@/components/LoadingSpinner'
import { validateMathProblem, sanitizeInput } from '@/lib/validation'
import { validateAndProcessImage } from '@/lib/imageUtils'
import { saveSATProblem } from '@/lib/supabase'

export default function HomePage() {
  const { user, loading } = useAuth()
  const { showToast } = useToast()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [isUpgradeFlow, setIsUpgradeFlow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // The actual sign in is handled by the AuthContext
      setShowSignInModal(false)
      showToast('Sign in successful!', 'success')
    } catch (error) {
      console.error('Sign in error:', error)
      showToast('Failed to sign in. Please try again.', 'error')
    }
  }

  const handleSolveProblem = async (text: string, images: string[]) => {
    if (!user) {
      showToast('Please sign in to submit problems', 'error')
      return
    }

    // Validate input
    const validation = validateMathProblem(text, images)
    if (!validation.isValid) {
      showToast(validation.errors[0], 'error')
      return
    }

    setIsSubmitting(true)
    try {
      // Sanitize text input
      const sanitizedText = sanitizeInput(text)
      
      // Save problem to Supabase
      const problemData = {
        user_id: user.email!,
        question: sanitizedText,
        image_url: images.length > 0 ? images[0] : undefined, // For now, just save first image
        category: 'algebra' as const, // Default category, can be enhanced later
        difficulty: 'medium' as const, // Default difficulty, can be enhanced later
      }
      
      const problemId = await saveSATProblem(problemData)
      
      showToast('Problem submitted successfully! AI processing coming soon.', 'success')
    } catch (error) {
      console.error('Error saving problem:', error)
      showToast('Failed to submit problem. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowSignInModal(false)
    setIsUpgradeFlow(false)
  }

  if (loading) {
    return <LoadingOverlay isVisible={true} text="Loading..." />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header onSignIn={handleSignIn} onUpgrade={handleUpgrade} />

      <SignInModal
        isOpen={showSignInModal}
        isUpgradeFlow={isUpgradeFlow}
        onClose={closeModal}
        onSignIn={handleGoogleSignIn}
        onToggleFlow={() => setIsUpgradeFlow(!isUpgradeFlow)}
      />

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
        <ProblemInput onSubmit={handleSolveProblem} isSubmitting={isSubmitting} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Value Proposition */}
        <ValueProposition />

        {/* Recent Practice Sessions */}
        <div className="mt-16">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Recent Practice Sessions
          </h3>
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

      <Footer />
    </div>
  )
}
