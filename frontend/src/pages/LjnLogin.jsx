import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, User, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import ljnRequest from '../utils/ljnRequest'
import { ljnSetToken, ljnSetUser } from '../utils/ljnAuth'

export default function LjnLogin() {
  const [ljnIsRegister, setLjnIsRegister] = useState(false)
  const [ljnShowPwd, setLjnShowPwd] = useState(false)
  const [ljnLoading, setLjnLoading] = useState(false)
  const [ljnForm, setLjnForm] = useState({ ljnUsername: '', ljnPassword: '', ljnNickname: '' })
  const ljnNavigate = useNavigate()

  const ljnHandleChange = (e) => {
    setLjnForm({ ...ljnForm, [e.target.name]: e.target.value })
  }

  const ljnHandleSubmit = async (e) => {
    e.preventDefault()
    if (!ljnForm.ljnUsername.trim()) { toast.error('请输入用户名'); return }
    if (!ljnForm.ljnPassword.trim()) { toast.error('请输入密码'); return }

    if (ljnIsRegister) {
      if (ljnForm.ljnUsername.length < 3 || ljnForm.ljnUsername.length > 20) {
        toast.error('用户名长度必须在3-20之间'); return
      }
      if (ljnForm.ljnPassword.length < 6 || ljnForm.ljnPassword.length > 20) {
        toast.error('密码长度必须在6-20之间'); return
      }
    }

    setLjnLoading(true)
    try {
      if (ljnIsRegister) {
        await ljnRequest.post('/auth/register', ljnForm)
        toast.success('注册成功，请登录')
        setLjnIsRegister(false)
        setLjnForm({ ljnUsername: ljnForm.ljnUsername, ljnPassword: '', ljnNickname: '' })
      } else {
        const ljnRes = await ljnRequest.post('/auth/login', ljnForm)
        ljnSetToken(ljnRes.data.ljnToken)
        ljnSetUser({
          ljnUserId: ljnRes.data.ljnUserId,
          ljnUsername: ljnRes.data.ljnUsername,
          ljnNickname: ljnRes.data.ljnNickname,
          ljnRole: ljnRes.data.ljnRole
        })
        toast.success('登录成功')
        ljnNavigate(ljnRes.data.ljnRole === 0 ? '/admin/books' : '/browse')
      }
    } catch (_) {
      // error handled by interceptor
    } finally {
      setLjnLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-rose-200/25 rounded-full blur-2xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ljnPrimary to-pink-400 rounded-2xl shadow-ljnHover mb-4">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ljnText flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-ljnPrimary" />
            LJN 图书管理系统
            <Sparkles size={20} className="text-ljnPrimary" />
          </h1>
          <p className="text-ljnTextLight mt-1 text-sm">知识的花园，为你绽放</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
          <h2 className="text-xl font-semibold text-ljnText mb-6 text-center">
            {ljnIsRegister ? '创建新账号' : '欢迎回来'}
          </h2>

          <form onSubmit={ljnHandleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ljnPrimary" />
              <input
                type="text"
                name="ljnUsername"
                value={ljnForm.ljnUsername}
                onChange={ljnHandleChange}
                placeholder="请输入用户名"
                className="ljn-input pl-10"
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ljnPrimary" />
              <input
                type={ljnShowPwd ? 'text' : 'password'}
                name="ljnPassword"
                value={ljnForm.ljnPassword}
                onChange={ljnHandleChange}
                placeholder="请输入密码"
                className="ljn-input pl-10 pr-10"
                autoComplete={ljnIsRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setLjnShowPwd(!ljnShowPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ljnTextLight hover:text-ljnPrimary transition-colors"
              >
                {ljnShowPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {ljnIsRegister && (
              <div className="relative">
                <Sparkles size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ljnPrimary" />
                <input
                  type="text"
                  name="ljnNickname"
                  value={ljnForm.ljnNickname}
                  onChange={ljnHandleChange}
                  placeholder="昵称（可选）"
                  className="ljn-input pl-10"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={ljnLoading}
              className="w-full ljn-btn-primary py-3 text-base font-semibold mt-2"
            >
              {ljnLoading ? '请稍候...' : (ljnIsRegister ? '注册' : '登录')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setLjnIsRegister(!ljnIsRegister)
                setLjnForm({ ljnUsername: '', ljnPassword: '', ljnNickname: '' })
              }}
              className="text-sm text-ljnPrimary hover:text-ljnPrimaryDark transition-colors"
            >
              {ljnIsRegister ? '已有账号？返回登录' : '还没有账号？立即注册'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-ljnTextLight/60 mt-6">
          LJN Library Management System &copy; 2024
        </p>
      </div>
    </div>
  )
}
