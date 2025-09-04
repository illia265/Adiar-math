'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, signInWithGoogle, signOutUser, onAuthStateChange, createUserProfile, getUserProfile, UserProfile as SupabaseUserProfile } from '../lib/supabase'

interface AuthContextType {
  user: any | null
  userProfile: SupabaseUserProfile | null
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
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.email!)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      setUser(user)
      if (user) {
        await loadUserProfile(user.email!)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (email: string) => {
    try {
      let profile = await getUserProfile(email)
      if (!profile) {
        // Create profile for new user
        await createUserProfile(user)
        profile = await getUserProfile(email)
      }
      setUserProfile(profile)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const signIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await signOutUser()
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshUserProfile = async () => {
    if (user?.email) {
      await loadUserProfile(user.email)
    }
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
