import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function LjnPagination({ ljnCurrent, ljnTotal, ljnPageSize, ljnOnChange }) {
  const ljnTotalPages = Math.ceil(ljnTotal / ljnPageSize)
  if (ljnTotalPages <= 1) return null

  const ljnGetPages = () => {
    const ljnPages = []
    const ljnStart = Math.max(1, ljnCurrent - 2)
    const ljnEnd = Math.min(ljnTotalPages, ljnCurrent + 2)

    if (ljnStart > 1) { ljnPages.push(1); if (ljnStart > 2) ljnPages.push('...') }
    for (let i = ljnStart; i <= ljnEnd; i++) ljnPages.push(i)
    if (ljnEnd < ljnTotalPages) { if (ljnEnd < ljnTotalPages - 1) ljnPages.push('...'); ljnPages.push(ljnTotalPages) }

    return ljnPages
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-ljnTextLight">共 {ljnTotal} 条</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => ljnOnChange(ljnCurrent - 1)}
          disabled={ljnCurrent <= 1}
          className="p-1.5 rounded-lg hover:bg-ljnPrimaryLight/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {ljnGetPages().map((ljnPage, i) => (
          ljnPage === '...' ? (
            <span key={`dot-${i}`} className="px-2 text-ljnTextLight">...</span>
          ) : (
            <button
              key={ljnPage}
              onClick={() => ljnOnChange(ljnPage)}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-all
                ${ljnPage === ljnCurrent
                  ? 'bg-ljnPrimary text-white shadow-ljnSoft'
                  : 'text-ljnText hover:bg-ljnPrimaryLight/30'}`}
            >
              {ljnPage}
            </button>
          )
        ))}
        <button
          onClick={() => ljnOnChange(ljnCurrent + 1)}
          disabled={ljnCurrent >= ljnTotalPages}
          className="p-1.5 rounded-lg hover:bg-ljnPrimaryLight/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
