import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { BookOpen, Library, Tag, Users, User, LogOut, Menu, X, ChevronDown, Sparkles, BookMarked } from 'lucide-react'
import { ljnGetUser, ljnIsAdmin, ljnLogout, ljnIsLoggedIn } from '../utils/ljnAuth'
import ljnRequest from '../utils/ljnRequest'

export default function LjnLayout() {
  const [ljnSidebarOpen, setLjnSidebarOpen] = useState(true)
  const [ljnDropdownOpen, setLjnDropdownOpen] = useState(false)
  const [ljnUser, setLjnUser] = useState(ljnGetUser())
  const ljnNavigate = useNavigate()
  const ljnLocation = useLocation()
  const ljnDropdownRef = useRef(null)

  useEffect(() => {
    if (!ljnIsLoggedIn()) {
      ljnNavigate('/login')
    }
  }, [ljnNavigate])

  useEffect(() => {
    const ljnFetchUser = async () => {
      try {
        const ljnRes = await ljnRequest.get('/users/me')
        const ljnUpdated = {
          ljnUserId: ljnRes.data.ljnId,
          ljnUsername: ljnRes.data.ljnUsername,
          ljnNickname: ljnRes.data.ljnNickname,
          ljnRole: ljnRes.data.ljnRole
        }
        setLjnUser(ljnUpdated)
        localStorage.setItem('ljnUser', JSON.stringify(ljnUpdated))
      } catch (_) {}
    }
    if (ljnIsLoggedIn()) ljnFetchUser()
  }, [ljnLocation.pathname])

  useEffect(() => {
    const ljnHandleClick = (e) => {
      if (ljnDropdownRef.current && !ljnDropdownRef.current.contains(e.target)) {
        setLjnDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', ljnHandleClick)
    return () => document.removeEventListener('mousedown', ljnHandleClick)
  }, [])

  const ljnAdminMenus = [
    { ljnPath: '/admin/books', ljnLabel: '图书管理', ljnIcon: BookOpen },
    { ljnPath: '/admin/book-types', ljnLabel: '类型管理', ljnIcon: Tag },
    { ljnPath: '/admin/users', ljnLabel: '用户管理', ljnIcon: Users },
    { ljnPath: '/browse', ljnLabel: '图书浏览', ljnIcon: Library },
  ]

  const ljnUserMenus = [
    { ljnPath: '/browse', ljnLabel: '图书浏览', ljnIcon: Library },
  ]

  const ljnMenus = ljnIsAdmin() ? ljnAdminMenus : ljnUserMenus

  return (
    <div className="min-h-screen bg-ljnBg flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-ljnBorder/50 
                          shadow-ljnSoft transition-transform duration-300 flex flex-col
                          ${ljnSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:min-w-0 lg:overflow-hidden'}`}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-ljnBorder/50">
          <div className="w-9 h-9 bg-gradient-to-br from-ljnPrimary to-pink-400 rounded-xl flex items-center justify-center">
            <BookMarked size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-ljnText text-sm">LJN 图书管理</h1>
            <p className="text-xs text-ljnTextLight">Library System</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ljnMenus.map((ljnItem) => {
            const ljnActive = ljnLocation.pathname === ljnItem.ljnPath
            const LjnIcon = ljnItem.ljnIcon
            return (
              <Link
                key={ljnItem.ljnPath}
                to={ljnItem.ljnPath}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-ljn text-sm font-medium transition-all duration-200
                  ${ljnActive
                    ? 'bg-gradient-to-r from-ljnPrimary/10 to-ljnPrimaryLight/30 text-ljnPrimaryDark border border-ljnPrimary/20'
                    : 'text-ljnTextLight hover:bg-ljnPrimaryLight/20 hover:text-ljnText'}`}
              >
                <LjnIcon size={18} />
                <span>{ljnItem.ljnLabel}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-ljnBorder/50">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-ljnTextLight">
            <Sparkles size={12} className="text-ljnPrimary" />
            <span>{ljnIsAdmin() ? '管理员模式' : '普通用户'}</span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {ljnSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setLjnSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-ljnBorder/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <button
            onClick={() => setLjnSidebarOpen(!ljnSidebarOpen)}
            className="p-2 rounded-lg hover:bg-ljnPrimaryLight/30 text-ljnTextLight hover:text-ljnText transition-colors"
          >
            {ljnSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="relative" ref={ljnDropdownRef}>
            <button
              onClick={() => setLjnDropdownOpen(!ljnDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-ljn hover:bg-ljnPrimaryLight/20 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-ljnPrimary to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {(ljnUser?.ljnNickname || ljnUser?.ljnUsername || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-ljnText hidden sm:block">
                {ljnUser?.ljnNickname || ljnUser?.ljnUsername || '用户'}
              </span>
              <ChevronDown size={14} className={`text-ljnTextLight transition-transform ${ljnDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {ljnDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-ljn shadow-xl border border-ljnBorder/50 py-1 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-ljnText hover:bg-ljnPrimaryLight/20 transition-colors"
                  onClick={() => setLjnDropdownOpen(false)}
                >
                  <User size={16} className="text-ljnPrimary" />
                  个人中心
                </Link>
                <hr className="my-1 border-ljnBorder/50" />
                <button
                  onClick={ljnLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ljnDanger hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
