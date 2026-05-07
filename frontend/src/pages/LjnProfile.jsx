import React, { useState, useEffect } from 'react'
import { User, Lock, Save, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import ljnRequest from '../utils/ljnRequest'
import { ljnGetUser, ljnSetUser } from '../utils/ljnAuth'

export default function LjnProfile() {
  const [ljnUser, setLjnUser] = useState(null)
  const [ljnLoading, setLjnLoading] = useState(true)
  const [ljnNickname, setLjnNickname] = useState('')
  const [ljnSaving, setLjnSaving] = useState(false)
  const [ljnPwdForm, setLjnPwdForm] = useState({ ljnOldPassword: '', ljnNewPassword: '', ljnConfirmPassword: '' })
  const [ljnChangingPwd, setLjnChangingPwd] = useState(false)

  useEffect(() => {
    const ljnFetch = async () => {
      try {
        const ljnRes = await ljnRequest.get('/users/me')
        setLjnUser(ljnRes.data)
        setLjnNickname(ljnRes.data.ljnNickname || '')
      } catch (_) {} finally { setLjnLoading(false) }
    }
    ljnFetch()
  }, [])

  const ljnHandleSaveProfile = async () => {
    if (!ljnNickname.trim()) { toast.error('昵称不能为空'); return }
    setLjnSaving(true)
    try {
      await ljnRequest.put('/users/me', { ljnNickname })
      toast.success('个人信息更新成功')
      const ljnStored = ljnGetUser()
      if (ljnStored) {
        ljnStored.ljnNickname = ljnNickname
        ljnSetUser(ljnStored)
      }
      setLjnUser(prev => ({ ...prev, ljnNickname }))
    } catch (_) {} finally { setLjnSaving(false) }
  }

  const ljnHandleChangePwd = async () => {
    if (!ljnPwdForm.ljnOldPassword) { toast.error('请输入旧密码'); return }
    if (!ljnPwdForm.ljnNewPassword) { toast.error('请输入新密码'); return }
    if (ljnPwdForm.ljnNewPassword.length < 6 || ljnPwdForm.ljnNewPassword.length > 20) {
      toast.error('新密码长度必须在6-20之间'); return
    }
    if (ljnPwdForm.ljnNewPassword !== ljnPwdForm.ljnConfirmPassword) {
      toast.error('两次输入的密码不一致'); return
    }

    setLjnChangingPwd(true)
    try {
      await ljnRequest.put('/users/me/password', {
        ljnOldPassword: ljnPwdForm.ljnOldPassword,
        ljnNewPassword: ljnPwdForm.ljnNewPassword
      })
      toast.success('密码修改成功')
      setLjnPwdForm({ ljnOldPassword: '', ljnNewPassword: '', ljnConfirmPassword: '' })
    } catch (_) {} finally { setLjnChangingPwd(false) }
  }

  if (ljnLoading) return <div className="text-center py-20 text-ljnTextLight">加载中...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <User size={22} className="text-ljnPrimary" />
        <h2 className="text-xl font-bold text-ljnText">个人中心</h2>
      </div>

      {/* Profile Info */}
      <div className="ljn-card">
        <h3 className="text-base font-semibold text-ljnText mb-4 flex items-center gap-2">
          <User size={16} className="text-ljnPrimary" /> 基本信息
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ljnTextLight mb-1.5">用户名</label>
            <input type="text" value={ljnUser?.ljnUsername || ''} disabled
              className="ljn-input bg-gray-50 cursor-not-allowed text-ljnTextLight" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnTextLight mb-1.5">角色</label>
            <div className="ljn-input bg-gray-50 cursor-not-allowed text-ljnTextLight flex items-center gap-2">
              <Shield size={14} className={ljnUser?.ljnRole === 0 ? 'text-amber-500' : 'text-ljnSecondaryDark'} />
              {ljnUser?.ljnRole === 0 ? '系统管理员' : '普通用户'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">昵称</label>
            <input type="text" value={ljnNickname} onChange={(e) => setLjnNickname(e.target.value)}
              className="ljn-input" placeholder="请输入昵称" />
          </div>
          <div className="flex justify-end">
            <button onClick={ljnHandleSaveProfile} disabled={ljnSaving}
              className="ljn-btn-primary flex items-center gap-2 text-sm">
              <Save size={14} /> {ljnSaving ? '保存中...' : '保存修改'}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="ljn-card">
        <h3 className="text-base font-semibold text-ljnText mb-4 flex items-center gap-2">
          <Lock size={16} className="text-ljnPrimary" /> 修改密码
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">旧密码</label>
            <input type="password" value={ljnPwdForm.ljnOldPassword}
              onChange={(e) => setLjnPwdForm({ ...ljnPwdForm, ljnOldPassword: e.target.value })}
              className="ljn-input" placeholder="请输入旧密码" autoComplete="current-password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">新密码</label>
            <input type="password" value={ljnPwdForm.ljnNewPassword}
              onChange={(e) => setLjnPwdForm({ ...ljnPwdForm, ljnNewPassword: e.target.value })}
              className="ljn-input" placeholder="请输入新密码（6-20位）" autoComplete="new-password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">确认新密码</label>
            <input type="password" value={ljnPwdForm.ljnConfirmPassword}
              onChange={(e) => setLjnPwdForm({ ...ljnPwdForm, ljnConfirmPassword: e.target.value })}
              className="ljn-input" placeholder="请再次输入新密码" autoComplete="new-password" />
          </div>
          <div className="flex justify-end">
            <button onClick={ljnHandleChangePwd} disabled={ljnChangingPwd}
              className="ljn-btn-primary flex items-center gap-2 text-sm">
              <Lock size={14} /> {ljnChangingPwd ? '修改中...' : '修改密码'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
