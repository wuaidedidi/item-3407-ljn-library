import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Search, Users, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'
import ljnRequest from '../utils/ljnRequest'
import { ljnGetUser } from '../utils/ljnAuth'
import LjnModal from '../components/LjnModal'
import LjnConfirm from '../components/LjnConfirm'
import LjnPagination from '../components/LjnPagination'

export default function LjnUserManage() {
  const [ljnUsers, setLjnUsers] = useState([])
  const [ljnTotal, setLjnTotal] = useState(0)
  const [ljnPageNum, setLjnPageNum] = useState(1)
  const [ljnPageSize] = useState(10)
  const [ljnKeyword, setLjnKeyword] = useState('')
  const [ljnLoading, setLjnLoading] = useState(false)
  const [ljnModalOpen, setLjnModalOpen] = useState(false)
  const [ljnEditItem, setLjnEditItem] = useState(null)
  const [ljnSubmitting, setLjnSubmitting] = useState(false)
  const [ljnConfirmOpen, setLjnConfirmOpen] = useState(false)
  const [ljnDeleteId, setLjnDeleteId] = useState(null)
  const [ljnDeleting, setLjnDeleting] = useState(false)
  const ljnCurrentUser = ljnGetUser()

  const [ljnForm, setLjnForm] = useState({
    ljnUsername: '', ljnPassword: '', ljnNickname: '', ljnRole: 1, ljnStatus: 1
  })

  const ljnFetchUsers = useCallback(async () => {
    setLjnLoading(true)
    try {
      const ljnRes = await ljnRequest.get('/users', {
        params: { ljnPageNum, ljnPageSize, ljnKeyword: ljnKeyword || undefined }
      })
      setLjnUsers(ljnRes.data.ljnRecords || [])
      setLjnTotal(ljnRes.data.ljnTotal || 0)
    } catch (_) {} finally { setLjnLoading(false) }
  }, [ljnPageNum, ljnPageSize, ljnKeyword])

  useEffect(() => { ljnFetchUsers() }, [ljnFetchUsers])

  const ljnOpenAdd = () => {
    setLjnEditItem(null)
    setLjnForm({ ljnUsername: '', ljnPassword: '', ljnNickname: '', ljnRole: 1, ljnStatus: 1 })
    setLjnModalOpen(true)
  }

  const ljnOpenEdit = (item) => {
    setLjnEditItem(item)
    setLjnForm({
      ljnUsername: item.ljnUsername,
      ljnPassword: '',
      ljnNickname: item.ljnNickname || '',
      ljnRole: item.ljnRole,
      ljnStatus: item.ljnStatus
    })
    setLjnModalOpen(true)
  }

  const ljnHandleSubmit = async () => {
    if (!ljnForm.ljnUsername.trim()) { toast.error('请输入用户名'); return }
    if (!ljnEditItem && !ljnForm.ljnPassword.trim()) { toast.error('请输入密码'); return }
    if (!ljnEditItem && (ljnForm.ljnPassword.length < 6 || ljnForm.ljnPassword.length > 20)) {
      toast.error('密码长度必须在6-20之间'); return
    }
    if (ljnForm.ljnUsername.length < 3 || ljnForm.ljnUsername.length > 20) {
      toast.error('用户名长度必须在3-20之间'); return
    }
    if (ljnForm.ljnPassword && (ljnForm.ljnPassword.length < 6 || ljnForm.ljnPassword.length > 20)) {
      toast.error('密码长度必须在6-20之间'); return
    }

    setLjnSubmitting(true)
    try {
      if (ljnEditItem) {
        const ljnData = { ...ljnForm }
        if (!ljnData.ljnPassword) delete ljnData.ljnPassword
        await ljnRequest.put(`/users/${ljnEditItem.ljnId}`, ljnData)
        toast.success('用户信息更新成功')
      } else {
        await ljnRequest.post('/auth/register', {
          ljnUsername: ljnForm.ljnUsername,
          ljnPassword: ljnForm.ljnPassword,
          ljnNickname: ljnForm.ljnNickname
        })
        toast.success('用户添加成功')
      }
      setLjnModalOpen(false)
      ljnFetchUsers()
    } catch (_) {} finally { setLjnSubmitting(false) }
  }

  const ljnHandleDelete = async () => {
    setLjnDeleting(true)
    try {
      await ljnRequest.delete(`/users/${ljnDeleteId}`)
      toast.success('用户删除成功')
      setLjnConfirmOpen(false)
      if (ljnUsers.length === 1 && ljnPageNum > 1) {
        setLjnPageNum(ljnPageNum - 1)
      } else {
        ljnFetchUsers()
      }
    } catch (_) {} finally { setLjnDeleting(false) }
  }

  const ljnIsSelf = (item) => item.ljnId === ljnCurrentUser?.ljnUserId

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={22} className="text-ljnPrimary" />
          <h2 className="text-xl font-bold text-ljnText">用户管理</h2>
        </div>
        <button onClick={ljnOpenAdd} className="ljn-btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> 添加用户
        </button>
      </div>

      {/* Search */}
      <div className="ljn-card">
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ljnTextLight" />
            <input type="text" value={ljnKeyword}
              onChange={(e) => { setLjnKeyword(e.target.value); setLjnPageNum(1) }}
              placeholder="搜索用户名或昵称..." className="ljn-input pl-10" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ljn-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ljnBorder/50">
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">用户名</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">昵称</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">角色</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">状态</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">操作</th>
            </tr>
          </thead>
          <tbody>
            {ljnLoading ? (
              <tr><td colSpan="6" className="text-center py-12 text-ljnTextLight">加载中...</td></tr>
            ) : ljnUsers.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12 text-ljnTextLight">暂无数据</td></tr>
            ) : ljnUsers.map((item) => (
              <tr key={item.ljnId} className="border-b border-ljnBorder/30 hover:bg-ljnPrimaryLight/10 transition-colors">
                <td className="py-3 px-4">{item.ljnId}</td>
                <td className="py-3 px-4 font-medium">
                  <div className="flex items-center gap-2">
                    {item.ljnUsername}
                    {ljnIsSelf(item) && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-ljnPrimary/10 text-ljnPrimary rounded-full">我</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-ljnTextLight">{item.ljnNickname || '-'}</td>
                <td className="py-3 px-4">
                  {item.ljnRole === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      <Shield size={11} /> 管理员
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ljnSecondary/20 text-ljnSecondaryDark rounded-full text-xs font-medium">
                      <User size={11} /> 普通用户
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.ljnStatus === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                    {item.ljnStatus === 1 ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => ljnOpenEdit(item)} className="p-1.5 rounded-lg text-ljnSecondaryDark hover:bg-ljnSecondary/20 transition-colors" title="编辑">
                      <Edit2 size={15} />
                    </button>
                    {!ljnIsSelf(item) && (
                      <button onClick={() => { setLjnDeleteId(item.ljnId); setLjnConfirmOpen(true) }} className="p-1.5 rounded-lg text-ljnDanger hover:bg-red-50 transition-colors" title="删除">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <LjnPagination ljnCurrent={ljnPageNum} ljnTotal={ljnTotal} ljnPageSize={ljnPageSize} ljnOnChange={setLjnPageNum} />
      </div>

      {/* Modal */}
      <LjnModal ljnTitle={ljnEditItem ? '编辑用户' : '添加用户'} ljnOpen={ljnModalOpen} ljnOnClose={() => setLjnModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">用户名 <span className="text-ljnDanger">*</span></label>
            <input type="text" value={ljnForm.ljnUsername}
              onChange={(e) => setLjnForm({ ...ljnForm, ljnUsername: e.target.value })}
              className="ljn-input" placeholder="请输入用户名（3-20位）" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">
              密码 {!ljnEditItem && <span className="text-ljnDanger">*</span>}
              {ljnEditItem && <span className="text-xs text-ljnTextLight ml-1">（留空则不修改）</span>}
            </label>
            <input type="password" value={ljnForm.ljnPassword}
              onChange={(e) => setLjnForm({ ...ljnForm, ljnPassword: e.target.value })}
              className="ljn-input" placeholder={ljnEditItem ? '留空不修改密码' : '请输入密码（6-20位）'} autoComplete="new-password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">昵称</label>
            <input type="text" value={ljnForm.ljnNickname}
              onChange={(e) => setLjnForm({ ...ljnForm, ljnNickname: e.target.value })}
              className="ljn-input" placeholder="请输入昵称" />
          </div>
          {ljnEditItem && (
            <>
              <div>
                <label className="block text-sm font-medium text-ljnText mb-1.5">角色</label>
                {ljnIsSelf(ljnEditItem) ? (
                  <div className="ljn-input bg-gray-50 cursor-not-allowed text-ljnTextLight">管理员（不可修改自己的角色）</div>
                ) : (
                  <select value={ljnForm.ljnRole}
                    onChange={(e) => setLjnForm({ ...ljnForm, ljnRole: parseInt(e.target.value) })}
                    className="ljn-select">
                    <option value={0}>管理员</option>
                    <option value={1}>普通用户</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-ljnText mb-1.5">状态</label>
                {ljnIsSelf(ljnEditItem) ? (
                  <div className="ljn-input bg-gray-50 cursor-not-allowed text-ljnTextLight">启用（不可禁用自己的账号）</div>
                ) : (
                  <select value={ljnForm.ljnStatus}
                    onChange={(e) => setLjnForm({ ...ljnForm, ljnStatus: parseInt(e.target.value) })}
                    className="ljn-select">
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                )}
              </div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setLjnModalOpen(false)} className="ljn-btn-outline text-sm">取消</button>
            <button onClick={ljnHandleSubmit} disabled={ljnSubmitting} className="ljn-btn-primary text-sm">
              {ljnSubmitting ? '提交中...' : '确定'}
            </button>
          </div>
        </div>
      </LjnModal>

      <LjnConfirm ljnOpen={ljnConfirmOpen} ljnOnClose={() => setLjnConfirmOpen(false)} ljnOnConfirm={ljnHandleDelete}
        ljnTitle="删除确认" ljnMessage="确定要删除该用户吗？删除后不可恢复。" ljnLoading={ljnDeleting} />
    </div>
  )
}
