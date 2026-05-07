import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function LjnConfirm({ ljnOpen, ljnOnClose, ljnOnConfirm, ljnTitle, ljnMessage, ljnLoading }) {
  if (!ljnOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={ljnOnClose} />
      <div className="relative max-w-sm w-full mx-4 bg-white rounded-ljnLg shadow-xl p-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-ljnDanger/10 rounded-full">
            <AlertTriangle size={20} className="text-ljnDanger" />
          </div>
          <h3 className="text-lg font-semibold text-ljnText">{ljnTitle || '确认操作'}</h3>
        </div>
        <p className="text-ljnTextLight mb-6 ml-11">{ljnMessage || '确定要执行此操作吗？'}</p>
        <div className="flex justify-end gap-3">
          <button onClick={ljnOnClose} className="ljn-btn-outline text-sm" disabled={ljnLoading}>取消</button>
          <button onClick={ljnOnConfirm} className="ljn-btn-danger text-sm" disabled={ljnLoading}>
            {ljnLoading ? '处理中...' : '确定'}
          </button>
        </div>
      </div>
    </div>
  )
}
