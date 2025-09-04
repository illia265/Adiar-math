// Image processing utilities
export const compressImage = async (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file) // Fallback to original if compression fails
          }
        },
        file.type,
        quality
      )
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const resizeImage = async (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      let { width, height } = img
      
      // Calculate aspect ratio
      const aspectRatio = width / height
      
      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }
      
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(resizedFile)
        } else {
          resolve(file)
        }
      }, file.type)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.src = URL.createObjectURL(file)
  })
}

export const validateAndProcessImage = async (file: File): Promise<{ success: boolean; processedFile?: File; error?: string }> => {
  try {
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' }
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }
    }
    
    // Compress and resize if needed
    const dimensions = await getImageDimensions(file)
    let processedFile = file
    
    if (dimensions.width > 1200 || dimensions.height > 1200) {
      processedFile = await resizeImage(file, 1200, 1200)
    }
    
    if (processedFile.size > 1 * 1024 * 1024) { // If still > 1MB, compress
      processedFile = await compressImage(processedFile, 800, 0.7)
    }
    
    return { success: true, processedFile }
  } catch (error) {
    return { success: false, error: 'Failed to process image' }
  }
}
