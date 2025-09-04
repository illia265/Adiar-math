'use client'

import { Zap, BookOpen, Target, TrendingUp } from 'lucide-react'

export const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Problem Solving",
      description: "Our AI breaks down SAT math questions step-by-step, showing you exactly how to use Desmos to solve them efficiently. Learn the 'how' not just the 'what.'"
    },
    {
      icon: BookOpen,
      title: "Interactive Desmos Walkthroughs",
      description: "Watch solutions unfold inside Desmos, then replicate the steps yourself to build real test-day confidence and muscle memory."
    },
    {
      icon: Target,
      title: "Personalized Adaptive Practice",
      description: "AI identifies your weak areas (algebra, functions, geometry, statistics) and generates customized problem sets for rapid score improvement."
    },
    {
      icon: TrendingUp,
      title: "Video Explanations & Strategy",
      description: "Complementary video lessons reinforce concepts and demonstrate Desmos shortcuts for maximum efficiency on test day."
    }
  ]

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center transition-colors duration-200">
        Revolutionize Your SAT Math Preparation
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
            <div className="flex items-center mb-3">
              <feature.icon className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
