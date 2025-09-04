'use client'

import Image from 'next/image'

export const Footer = () => {
  return (
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
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Adiar Math can make mistakes. Please double check important steps and calculations.
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025 Adiar Math. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
