import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env.local file.')
  console.warn('Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database types
export interface SATProblem {
  id?: string
  user_id: string
  question: string
  image_url?: string
  solution?: string
  desmos_steps?: string[]
  category: 'algebra' | 'functions' | 'geometry' | 'statistics'
  difficulty: 'easy' | 'medium' | 'hard'
  created_at: string
  completed_at?: string
  is_correct?: boolean
}

export interface UserProfile {
  id: string
  email: string
  display_name: string
  photo_url?: string
  subscription: 'free' | 'premium'
  subscription_expiry?: string
  created_at: string
  last_active: string
  weak_areas: string[]
  total_problems_solved: number
  correct_answers: number
}

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// User profile functions
export const createUserProfile = async (user: any) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const userProfile: Omit<UserProfile, 'id'> = {
      email: user.email || '',
      display_name: user.user_metadata?.full_name || user.email || '',
      photo_url: user.user_metadata?.avatar_url || undefined,
      subscription: 'free',
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
      weak_areas: [],
      total_problems_solved: 0,
      correct_answers: 0
    }

    const { error } = await supabase
      .from('users')
      .insert(userProfile)
    
    if (error) throw error
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userId)
      .single()
    
    if (error) throw error
    return data as UserProfile
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const { error } = await supabase
      .from('users')
      .update({ ...updates, last_active: new Date().toISOString() })
      .eq('id', userId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// SAT Problem functions
export const saveSATProblem = async (problem: Omit<SATProblem, 'id' | 'created_at'>) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const problemData = {
      ...problem,
      created_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('sat_problems')
      .insert(problemData)
      .select()
      .single()
    
    if (error) throw error
    return data.id
  } catch (error) {
    console.error('Error saving SAT problem:', error)
    throw error
  }
}

export const getUserProblems = async (userId: string, limitCount: number = 10) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const { data, error } = await supabase
      .from('sat_problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limitCount)
    
    if (error) throw error
    return data as SATProblem[]
  } catch (error) {
    console.error('Error getting user problems:', error)
    throw error
  }
}

export const updateProblemSolution = async (problemId: string, solution: string, desmosSteps: string[], isCorrect: boolean) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }

    const { error } = await supabase
      .from('sat_problems')
      .update({
        solution,
        desmos_steps: desmosSteps,
        is_correct: isCorrect,
        completed_at: new Date().toISOString()
      })
      .eq('id', problemId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating problem solution:', error)
    throw error
  }
}

// Analytics functions
export const updateUserStats = async (userId: string, isCorrect: boolean, category: string) => {
  try {
    const userProfile = await getUserProfile(userId)
    if (!userProfile) return

    const newTotalProblems = userProfile.total_problems_solved + 1
    const newCorrectAnswers = userProfile.correct_answers + (isCorrect ? 1 : 0)
    
    // Update weak areas if answer is incorrect
    let weakAreas = [...userProfile.weak_areas]
    if (!isCorrect && !weakAreas.includes(category)) {
      weakAreas.push(category)
    }

    await updateUserProfile(userProfile.id, {
      total_problems_solved: newTotalProblems,
      correct_answers: newCorrectAnswers,
      weak_areas: weakAreas
    })
  } catch (error) {
    console.error('Error updating user stats:', error)
    throw error
  }
}
