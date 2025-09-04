'use client'

import { useState } from 'react'
import { Camera, Send } from 'lucide-react'

interface ProblemInputProps {
  onSubmit: (text: string, images: string[]) => void
  isSubmitting: boolean
}

export const ProblemInput = ({ onSubmit, isSubmitting }: ProblemInputProps) => {
  const [inputText, setInputText] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
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

  const handleSubmit = () => {
    if (!inputText.trim() && pastedImages.length === 0) return
    
    onSubmit(inputText, pastedImages)
    setInputText('')
    setPastedImages([])
  }

  const removeImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
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
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pasted Images ({pastedImages.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {pastedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Pasted image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={() => removeImage(index)}
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
          onClick={handleSubmit}
          disabled={(!inputText.trim() && pastedImages.length === 0) || isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Send className="h-4 w-4" />
          <span>{isSubmitting ? 'Solving...' : 'Solve with Desmos'}</span>
        </button>
      </div>
    </div>
  )
}
