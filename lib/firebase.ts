import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Error initializing Firebase:', error)
  // Create a fallback app with minimal config
  app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  })
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export const db = getFirestore(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  try {
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.error('Error setting up auth state listener:', error)
    // Return a dummy unsubscribe function
    return () => {}
  }
}

// Firestore functions for SAT problems and user data
export interface SATProblem {
  id?: string
  userId: string
  question: string
  imageUrl?: string
  solution?: string
  desmosSteps?: string[]
  category: 'algebra' | 'functions' | 'geometry' | 'statistics'
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: Date
  completedAt?: Date
  isCorrect?: boolean
}

export interface UserProfile {
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

// User profile functions
export const createUserProfile = async (user: User) => {
  try {
    const userProfile: Omit<UserProfile, 'id'> = {
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      subscription: 'free',
      createdAt: new Date(),
      lastActive: new Date(),
      weakAreas: [],
      totalProblemsSolved: 0,
      correctAnswers: 0
    }

    await addDoc(collection(db, 'users'), userProfile)
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { ...updates, lastActive: new Date() })
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// SAT Problem functions
export const saveSATProblem = async (problem: Omit<SATProblem, 'id' | 'createdAt'>) => {
  try {
    const problemData = {
      ...problem,
      createdAt: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'satProblems'), problemData)
    return docRef.id
  } catch (error) {
    console.error('Error saving SAT problem:', error)
    throw error
  }
}

export const getUserProblems = async (userId: string, limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, 'satProblems'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SATProblem[]
  } catch (error) {
    console.error('Error getting user problems:', error)
    throw error
  }
}

export const updateProblemSolution = async (problemId: string, solution: string, desmosSteps: string[], isCorrect: boolean) => {
  try {
    const problemRef = doc(db, 'satProblems', problemId)
    await updateDoc(problemRef, {
      solution,
      desmosSteps,
      isCorrect,
      completedAt: new Date()
    })
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

    const newTotalProblems = userProfile.totalProblemsSolved + 1
    const newCorrectAnswers = userProfile.correctAnswers + (isCorrect ? 1 : 0)
    
    // Update weak areas if answer is incorrect
    let weakAreas = [...userProfile.weakAreas]
    if (!isCorrect && !weakAreas.includes(category)) {
      weakAreas.push(category)
    }

    await updateUserProfile(userProfile.id, {
      totalProblemsSolved: newTotalProblems,
      correctAnswers: newCorrectAnswers,
      weakAreas
    })
  } catch (error) {
    console.error('Error updating user stats:', error)
    throw error
  }
}
