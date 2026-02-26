'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import Link from 'next/link'
import { premiumApps } from '@/lib/premium-apps-data'

export default function PremiumAppsAnnouncement() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    // Wait for page to fully load
    const handlePageLoad = () => {
      setPageLoaded(true)
    }

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      setPageLoaded(true)
    } else {
      window.addEventListener('load', handlePageLoad)
      return () => window.removeEventListener('load', handlePageLoad)
    }
  }, [])

  useEffect(() => {
    // Only show after page is fully loaded
    if (!pageLoaded) return

    // Check if user has already seen the premium apps announcement
    const hasSeenPremiumAppsAnnouncement = localStorage.getItem('hasSeenPremiumAppsAnnouncement')

    if (!hasSeenPremiumAppsAnnouncement) {
      // Wait for page to be completely loaded and interactive
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [pageLoaded])

  useEffect(() => {
    if (hasShown) {
      localStorage.setItem('hasSeenPremiumAppsAnnouncement', 'true')
    }
  }, [hasShown])

  const handleClose = () => {
    setIsOpen(false)
  }

  // Get 3 random recent apps to display
  const recentApps = premiumApps.slice(0, 3)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
          />

          {/* Star-shaped Popup - Bottom Right Corner */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-50 w-80"
          >
            {/* Rotating Star Background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Star className="w-96 h-96 text-hacker-green/10 fill-hacker-green/5" />
            </motion.div>

            {/* Content Card */}
            <div className="relative rounded-xl border border-hacker-green/50 overflow-hidden shadow-2xl shadow-hacker-green/20 bg-hacker-terminal/98 backdrop-blur-md p-4">
              {/* Animated background glow */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-hacker-green/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-hacker-green-dim hover:text-hacker-green transition-colors z-10"
                aria-label="Close announcement"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-3 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                  >
                    <Star className="w-5 h-5 text-hacker-green-bright fill-hacker-green-bright" />
                  </motion.div>
                  <h3 className="text-sm font-tech font-bold text-hacker-green-bright">
                    NEW RELEASES
                  </h3>
                </div>

                <p className="text-xs text-hacker-green-dim font-mono mb-3 line-clamp-2">
                  Check out our latest premium app releases
                </p>

                {/* Recent Apps Grid */}
                <div className="space-y-2 mb-3">
                  {recentApps.map((app) => (
                    <motion.div
                      key={app.id}
                      whileHover={{ x: 4 }}
                      className="p-2 rounded border border-hacker-green/20 bg-hacker-terminal/50 hover:border-hacker-green/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{app.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-tech text-hacker-green-bright truncate">
                            {app.name}
                          </p>
                          <p className="text-xs text-hacker-green-dim">
                            KSH {app.price}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/premium-apps" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-3 py-2 rounded text-xs font-tech font-bold text-hacker-terminal bg-gradient-to-r from-hacker-green to-emerald-400 hover:shadow-lg hover:shadow-hacker-green/40 transition-all"
                  >
                    Shop All →
                  </motion.button>
                </Link>

                {/* Footer */}
                <p className="text-center mt-2 text-xs text-hacker-green-dim font-mono">
                  KSH 100 • M-Pesa
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
