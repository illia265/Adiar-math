'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'

interface UserProfile {
  id: string
  email: string
  displayName: string
  photoURL?: string
  subscription: 'free' | 'premium'
  subscriptionExpiry?: Date
  createdAt: Date
  lastActive: Date
  weakAreas: string[]
  totalProblemsSolved: number
  correctAnswers: number
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false) // Start with false to show the UI immediately

  const signIn = async () => {
    try {
      // For now, just simulate a successful sign in
      console.log('Sign in clicked - Firebase integration coming soon')
      // TODO: Implement actual Firebase sign in
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      setUserProfile(null)
      console.log('Sign out clicked - Firebase integration coming soon')
      // TODO: Implement actual Firebase sign out
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const refreshUserProfile = async () => {
    // TODO: Implement when Firebase is ready
    console.log('Refresh user profile - Firebase integration coming soon')
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
