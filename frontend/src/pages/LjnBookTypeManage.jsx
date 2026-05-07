import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Search, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import ljnRequest from '../utils/ljnRequest'
import LjnModal from '../components/LjnModal'
import LjnConfirm from '../components/LjnConfirm'
import LjnPagination from '../components/LjnPagination'

export default function LjnBookTypeManage() {
  const [ljnTypes, setLjnTypes] = useState([])
  const [ljnTotal, setLjnTotal] = useState(0)
  const [ljnPageNum, setLjnPageNum] = useState(1)
  const [ljnPageSize] = useState(10)
  const [ljnKeyword, setLjnKeyword] = useState('')
  const [ljnLoading, setLjnLoading] = useState(false)
  const [ljnModalOpen, setLjnModalOpen] = useState(false)
  const [ljnEditItem, setLjnEditItem] = useState(null)
  const [ljnForm, setLjnForm] = useState({ ljnTypeName: '', ljnDescription: '', ljnSortOrder: 0 })
  const [ljnSubmitting, setLjnSubmitting] = useState(false)
  const [ljnConfirmOpen, setLjnConfirmOpen] = useState(false)
  const [ljnDeleteId, setLjnDeleteId] = useState(null)
  const [ljnDeleting, setLjnDeleting] = useState(false)

  const ljnFetchTypes = useCallback(async () => {
    setLjnLoading(true)
    try {
      const ljnRes = await ljnRequest.get('/book-types', {
        params: { ljnPageNum, ljnPageSize, ljnKeyword: ljnKeyword || undefined }
      })
      setLjnTypes(ljnRes.data.ljnRecords || [])
      setLjnTotal(ljnRes.data.ljnTotal || 0)
    } catch (_) {} finally { setLjnLoading(false) }
  }, [ljnPageNum, ljnPageSize, ljnKeyword])

  useEffect(() => { ljnFetchTypes() }, [ljnFetchTypes])

  const ljnOpenAdd = () => {
    setLjnEditItem(null)
    setLjnForm({ ljnTypeName: '', ljnDescription: '', ljnSortOrder: 0 })
    setLjnModalOpen(true)
  }

  const ljnOpenEdit = (item) => {
    setLjnEditItem(item)
    setLjnForm({
      ljnTypeName: item.ljnTypeName,
      ljnDescription: item.ljnDescription || '',
      ljnSortOrder: item.ljnSortOrder || 0
    })
    setLjnModalOpen(true)
  }

  const ljnHandleSubmit = async () => {
    if (!ljnForm.ljnTypeName.trim()) { toast.error('请输入类型名称'); return }
    setLjnSubmitting(true)
    try {
      if (ljnEditItem) {
        await ljnRequest.put(`/book-types/${ljnEditItem.ljnId}`, ljnForm)
        toast.success('类型更新成功')
      } else {
        await ljnRequest.post('/book-types', ljnForm)
        toast.success('类型添加成功')
      }
      setLjnModalOpen(false)
      ljnFetchTypes()
    } catch (_) {} finally { setLjnSubmitting(false) }
  }

  const ljnHandleDelete = async () => {
    setLjnDeleting(true)
    try {
      await ljnRequest.delete(`/book-types/${ljnDeleteId}`)
      toast.success('类型删除成功')
      setLjnConfirmOpen(false)
      if (ljnTypes.length === 1 && ljnPageNum > 1) {
        setLjnPageNum(ljnPageNum - 1)
      } else {
        ljnFetchTypes()
      }
    } catch (_) {} finally { setLjnDeleting(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={22} className="text-ljnPrimary" />
          <h2 className="text-xl font-bold text-ljnText">图书类型管理</h2>
        </div>
        <button onClick={ljnOpenAdd} className="ljn-btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> 添加类型
        </button>
      </div>

      {/* Search */}
      <div className="ljn-card">
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ljnTextLight" />
            <input
              type="text"
              value={ljnKeyword}
              onChange={(e) => { setLjnKeyword(e.target.value); setLjnPageNum(1) }}
              placeholder="搜索类型名称..."
              className="ljn-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ljn-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ljnBorder/50">
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">类型名称</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">描述</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">排序</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">操作</th>
            </tr>
          </thead>
          <tbody>
            {ljnLoading ? (
              <tr><td colSpan="5" className="text-center py-12 text-ljnTextLight">加载中...</td></tr>
            ) : ljnTypes.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-ljnTextLight">暂无数据</td></tr>
            ) : ljnTypes.map((item) => (
              <tr key={item.ljnId} className="border-b border-ljnBorder/30 hover:bg-ljnPrimaryLight/10 transition-colors">
                <td className="py-3 px-4">{item.ljnId}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ljnPrimaryLight/30 text-ljnPrimaryDark rounded-full text-xs font-medium">
                    <Tag size={12} /> {item.ljnTypeName}
                  </span>
                </td>
                <td className="py-3 px-4 text-ljnTextLight max-w-xs truncate">{item.ljnDescription || '-'}</td>
                <td className="py-3 px-4">{item.ljnSortOrder}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => ljnOpenEdit(item)} className="p-1.5 rounded-lg text-ljnSecondaryDark hover:bg-ljnSecondary/20 transition-colors" title="编辑">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => { setLjnDeleteId(item.ljnId); setLjnConfirmOpen(true) }} className="p-1.5 rounded-lg text-ljnDanger hover:bg-red-50 transition-colors" title="删除">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <LjnPagination ljnCurrent={ljnPageNum} ljnTotal={ljnTotal} ljnPageSize={ljnPageSize} ljnOnChange={setLjnPageNum} />
      </div>

      {/* Modal */}
      <LjnModal ljnTitle={ljnEditItem ? '编辑图书类型' : '添加图书类型'} ljnOpen={ljnModalOpen} ljnOnClose={() => setLjnModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">类型名称 <span className="text-ljnDanger">*</span></label>
            <input type="text" value={ljnForm.ljnTypeName} onChange={(e) => setLjnForm({ ...ljnForm, ljnTypeName: e.target.value })} className="ljn-input" placeholder="请输入类型名称" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">描述</label>
            <textarea value={ljnForm.ljnDescription} onChange={(e) => setLjnForm({ ...ljnForm, ljnDescription: e.target.value })} className="ljn-input min-h-[80px] resize-y" placeholder="请输入类型描述" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">排序</label>
            <input type="number" value={ljnForm.ljnSortOrder} onChange={(e) => setLjnForm({ ...ljnForm, ljnSortOrder: parseInt(e.target.value) || 0 })} className="ljn-input" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setLjnModalOpen(false)} className="ljn-btn-outline text-sm">取消</button>
            <button onClick={ljnHandleSubmit} disabled={ljnSubmitting} className="ljn-btn-primary text-sm">
              {ljnSubmitting ? '提交中...' : '确定'}
            </button>
          </div>
        </div>
      </LjnModal>

      <LjnConfirm ljnOpen={ljnConfirmOpen} ljnOnClose={() => setLjnConfirmOpen(false)} ljnOnConfirm={ljnHandleDelete}
        ljnTitle="删除确认" ljnMessage="确定要删除该图书类型吗？删除后不可恢复。" ljnLoading={ljnDeleting} />
    </div>
  )
}
