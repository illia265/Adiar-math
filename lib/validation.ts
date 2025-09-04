// Input validation utilities
export const validateMathProblem = (text: string, images: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check if at least one input is provided
  if (!text.trim() && images.length === 0) {
    errors.push('Please provide either a text question or an image')
  }

  // Check text length if provided
  if (text.trim() && text.trim().length < 10) {
    errors.push('Question text should be at least 10 characters long')
  }

  if (text.trim() && text.trim().length > 1000) {
    errors.push('Question text should be less than 1000 characters')
  }

  // Check image count
  if (images.length > 5) {
    errors.push('Maximum 5 images allowed per question')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous HTML/script tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'Image file size must be less than 5MB' }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }
  }

  return { isValid: true }
}
