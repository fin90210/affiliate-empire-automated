
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname
          })
        })
      } catch (error) {
        console.error('Analytics tracking error:', error)
      }
    }

    // Track page view after a short delay
    const timer = setTimeout(trackPageView, 1000)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
