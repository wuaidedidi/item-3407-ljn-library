import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function LjnModal({ ljnTitle, ljnOpen, ljnOnClose, ljnWidth = 'max-w-lg', children }) {
  useEffect(() => {
    if (ljnOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [ljnOpen])

  if (!ljnOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={ljnOnClose} />
      <div className={`relative ${ljnWidth} w-full mx-4 bg-white rounded-ljnLg shadow-xl 
                        animate-[fadeIn_0.2s_ease-out] max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-ljnBorder/50">
          <h3 className="text-lg font-semibold text-ljnText">{ljnTitle}</h3>
          <button
            onClick={ljnOnClose}
            className="p-1.5 rounded-lg text-ljnTextLight hover:text-ljnText hover:bg-ljnPrimaryLight/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
