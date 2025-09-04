'use client'

export const ValueProposition = () => {
  return (
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
  )
}
