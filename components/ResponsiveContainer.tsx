'use client'

import { ReactNode } from 'react'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
}

export const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '4xl' 
}: ResponsiveContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  }

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export const MobileFirstContainer = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}

export const GridContainer = ({ 
  children, 
  cols = 1, 
  gap = 6, 
  className = '' 
}: { 
  children: ReactNode; 
  cols?: 1 | 2 | 3 | 4; 
  gap?: 4 | 6 | 8 | 12; 
  className?: string 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const gridGap = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12'
  }

  return (
    <div className={`grid ${gridCols[cols]} ${gridGap[gap]} ${className}`}>
      {children}
    </div>
  )
}
