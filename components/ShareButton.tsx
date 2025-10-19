// components/ShareButton.tsx
"use client"
import { useState } from 'react'

interface ShareButtonProps {
  repoData: any
  aiCaption: string
  vizMode: 'brain' | 'tree'
}

export default function ShareButton({ repoData, aiCaption, vizMode }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      // Get the appropriate screenshot function based on visualization mode
      const screenshotFunction = vizMode === 'brain' 
        ? (window as any).captureNeuralScreenshot 
        : (window as any).captureTreeScreenshot

      if (!screenshotFunction) {
        throw new Error('Screenshot function not available')
      }

      // Capture the screenshot
      const dataURL = screenshotFunction()
      if (!dataURL) {
        throw new Error('Failed to capture screenshot')
      }
      
      // Create shareable text
      const shareText = aiCaption || `Check out this ${vizMode === 'brain' ? 'neural network' : 'code tree'} visualization of ${repoData?.metadata?.repoName}! 🧠✨`
      const shareUrl = `https://codesoul.app/visualize?repo=${encodeURIComponent(repoData?.metadata?.repoName || '')}`

      // Convert dataURL to blob
      const response = await fetch(dataURL)
      const blob = await response.blob()

      // Try to use Web Share API if available
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'codesoul-visualization.png', { type: 'image/png' })
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'CodeSoul Visualization',
            text: shareText,
            url: shareUrl,
            files: [file],
          })
          return
        }
      }

      // Fallback: Share to Twitter/X
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
      window.open(twitterUrl, '_blank')

    } catch (error) {
      console.error('Error sharing:', error)
      
      // Ultimate fallback: share without image
      const shareText = aiCaption || `Check out this ${vizMode === 'brain' ? 'neural network' : 'code tree'} visualization of ${repoData?.metadata?.repoName}! 🧠✨`
      const shareUrl = `https://codesoul.app/visualize?repo=${encodeURIComponent(repoData?.metadata?.repoName || '')}`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
      window.open(twitterUrl, '_blank')
      
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
    >
      {isSharing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Sharing...</span>
        </>
      ) : (
        <>
          <span>🐦</span>
          <span>Share to X</span>
        </>
      )}
    </button>
  )
}
