import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Search, BookOpen, Filter, X, Upload, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import ljnRequest from '../utils/ljnRequest'
import LjnModal from '../components/LjnModal'
import LjnConfirm from '../components/LjnConfirm'
import LjnPagination from '../components/LjnPagination'

const LJN_BASE_URL = window.location.origin

export default function LjnBookManage() {
  const [ljnBooks, setLjnBooks] = useState([])
  const [ljnTotal, setLjnTotal] = useState(0)
  const [ljnPageNum, setLjnPageNum] = useState(1)
  const [ljnPageSize] = useState(10)
  const [ljnTypes, setLjnTypes] = useState([])
  const [ljnLoading, setLjnLoading] = useState(false)
  const [ljnModalOpen, setLjnModalOpen] = useState(false)
  const [ljnEditItem, setLjnEditItem] = useState(null)
  const [ljnSubmitting, setLjnSubmitting] = useState(false)
  const [ljnConfirmOpen, setLjnConfirmOpen] = useState(false)
  const [ljnDeleteId, setLjnDeleteId] = useState(null)
  const [ljnDeleting, setLjnDeleting] = useState(false)
  const [ljnAdvanced, setLjnAdvanced] = useState(false)
  const [ljnUploading, setLjnUploading] = useState(false)

  const [ljnQuery, setLjnQuery] = useState({
    ljnBookCode: '', ljnBookName: '', ljnTypeId: '', ljnPriceMin: '', ljnPriceMax: ''
  })

  const [ljnForm, setLjnForm] = useState({
    ljnBookCode: '', ljnBookName: '', ljnTypeId: '', ljnPrice: '',
    ljnCoverImage: '', ljnAuthor: '', ljnPublisher: '', ljnDescription: ''
  })

  const ljnFetchTypes = async () => {
    try {
      const ljnRes = await ljnRequest.get('/book-types/all')
      setLjnTypes(ljnRes.data || [])
    } catch (_) {}
  }

  const ljnFetchBooks = useCallback(async () => {
    setLjnLoading(true)
    try {
      const ljnParams = { ljnPageNum, ljnPageSize }
      if (ljnQuery.ljnBookCode) ljnParams.ljnBookCode = ljnQuery.ljnBookCode
      if (ljnQuery.ljnBookName) ljnParams.ljnBookName = ljnQuery.ljnBookName
      if (ljnQuery.ljnTypeId) ljnParams.ljnTypeId = ljnQuery.ljnTypeId
      if (ljnQuery.ljnPriceMin) ljnParams.ljnPriceMin = ljnQuery.ljnPriceMin
      if (ljnQuery.ljnPriceMax) ljnParams.ljnPriceMax = ljnQuery.ljnPriceMax

      const ljnRes = await ljnRequest.get('/books', { params: ljnParams })
      setLjnBooks(ljnRes.data.ljnRecords || [])
      setLjnTotal(ljnRes.data.ljnTotal || 0)
    } catch (_) {} finally { setLjnLoading(false) }
  }, [ljnPageNum, ljnPageSize, ljnQuery])

  useEffect(() => { ljnFetchTypes() }, [])
  useEffect(() => { ljnFetchBooks() }, [ljnFetchBooks])

  const ljnResetQuery = () => {
    setLjnQuery({ ljnBookCode: '', ljnBookName: '', ljnTypeId: '', ljnPriceMin: '', ljnPriceMax: '' })
    setLjnPageNum(1)
  }

  const ljnOpenAdd = () => {
    setLjnEditItem(null)
    setLjnForm({ ljnBookCode: '', ljnBookName: '', ljnTypeId: '', ljnPrice: '', ljnCoverImage: '', ljnAuthor: '', ljnPublisher: '', ljnDescription: '' })
    setLjnModalOpen(true)
  }

  const ljnOpenEdit = (item) => {
    setLjnEditItem(item)
    setLjnForm({
      ljnBookCode: item.ljnBookCode || '',
      ljnBookName: item.ljnBookName || '',
      ljnTypeId: item.ljnTypeId || '',
      ljnPrice: item.ljnPrice || '',
      ljnCoverImage: item.ljnCoverImage || '',
      ljnAuthor: item.ljnAuthor || '',
      ljnPublisher: item.ljnPublisher || '',
      ljnDescription: item.ljnDescription || ''
    })
    setLjnModalOpen(true)
  }

  const ljnHandleUpload = async (e) => {
    const ljnFile = e.target.files[0]
    if (!ljnFile) return
    const ljnFormData = new FormData()
    ljnFormData.append('file', ljnFile)
    setLjnUploading(true)
    try {
      const ljnRes = await ljnRequest.post('/upload/image', ljnFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setLjnForm(prev => ({ ...prev, ljnCoverImage: ljnRes.data.ljnUrl }))
      toast.success('图片上传成功')
    } catch (_) {} finally { setLjnUploading(false) }
  }

  const ljnHandleSubmit = async () => {
    if (!ljnForm.ljnBookName.trim()) { toast.error('请输入图书名称'); return }
    if (!ljnForm.ljnTypeId) { toast.error('请选择图书类型'); return }
    if (!ljnForm.ljnPrice || parseFloat(ljnForm.ljnPrice) < 0) { toast.error('请输入有效的图书价格'); return }

    setLjnSubmitting(true)
    try {
      const ljnData = { ...ljnForm, ljnPrice: parseFloat(ljnForm.ljnPrice), ljnTypeId: parseInt(ljnForm.ljnTypeId) }
      if (ljnEditItem) {
        await ljnRequest.put(`/books/${ljnEditItem.ljnId}`, ljnData)
        toast.success('图书更新成功')
      } else {
        await ljnRequest.post('/books', ljnData)
        toast.success('图书添加成功')
      }
      setLjnModalOpen(false)
      ljnFetchBooks()
    } catch (_) {} finally { setLjnSubmitting(false) }
  }

  const ljnHandleDelete = async () => {
    setLjnDeleting(true)
    try {
      await ljnRequest.delete(`/books/${ljnDeleteId}`)
      toast.success('图书删除成功')
      setLjnConfirmOpen(false)
      if (ljnBooks.length === 1 && ljnPageNum > 1) {
        setLjnPageNum(ljnPageNum - 1)
      } else {
        ljnFetchBooks()
      }
    } catch (_) {} finally { setLjnDeleting(false) }
  }

  const ljnGetTypeName = (typeId) => {
    const ljnType = ljnTypes.find(t => t.ljnId === typeId)
    return ljnType ? ljnType.ljnTypeName : '-'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={22} className="text-ljnPrimary" />
          <h2 className="text-xl font-bold text-ljnText">图书管理</h2>
        </div>
        <button onClick={ljnOpenAdd} className="ljn-btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> 添加图书
        </button>
      </div>

      {/* Search */}
      <div className="ljn-card space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ljnTextLight mb-1">图书名称</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ljnTextLight" />
              <input type="text" value={ljnQuery.ljnBookName}
                onChange={(e) => setLjnQuery({ ...ljnQuery, ljnBookName: e.target.value })}
                placeholder="搜索图书名称" className="ljn-input pl-9 text-sm" />
            </div>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-ljnTextLight mb-1">图书类型</label>
            <select value={ljnQuery.ljnTypeId}
              onChange={(e) => setLjnQuery({ ...ljnQuery, ljnTypeId: e.target.value })}
              className="ljn-select text-sm">
              <option value="">全部类型</option>
              {ljnTypes.map(t => <option key={t.ljnId} value={t.ljnId}>{t.ljnTypeName}</option>)}
            </select>
          </div>
          <button onClick={() => setLjnAdvanced(!ljnAdvanced)}
            className="ljn-btn-outline text-sm flex items-center gap-1.5 h-[42px]">
            <Filter size={14} /> {ljnAdvanced ? '收起' : '高级搜索'}
          </button>
          <button onClick={() => setLjnPageNum(1)} className="ljn-btn-primary text-sm h-[42px]">搜索</button>
          <button onClick={ljnResetQuery} className="ljn-btn-outline text-sm h-[42px]">重置</button>
        </div>

        {ljnAdvanced && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-ljnBorder/30">
            <div className="min-w-[150px]">
              <label className="block text-xs font-medium text-ljnTextLight mb-1">图书编号</label>
              <input type="text" value={ljnQuery.ljnBookCode}
                onChange={(e) => setLjnQuery({ ...ljnQuery, ljnBookCode: e.target.value })}
                placeholder="图书编号" className="ljn-input text-sm" />
            </div>
            <div className="min-w-[120px]">
              <label className="block text-xs font-medium text-ljnTextLight mb-1">最低价格</label>
              <input type="number" value={ljnQuery.ljnPriceMin}
                onChange={(e) => setLjnQuery({ ...ljnQuery, ljnPriceMin: e.target.value })}
                placeholder="最低价" className="ljn-input text-sm" min="0" />
            </div>
            <div className="min-w-[120px]">
              <label className="block text-xs font-medium text-ljnTextLight mb-1">最高价格</label>
              <input type="number" value={ljnQuery.ljnPriceMax}
                onChange={(e) => setLjnQuery({ ...ljnQuery, ljnPriceMax: e.target.value })}
                placeholder="最高价" className="ljn-input text-sm" min="0" />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="ljn-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ljnBorder/50">
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">编号</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">封面</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">图书名称</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">类型</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">价格</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">作者</th>
              <th className="text-left py-3 px-4 font-semibold text-ljnTextLight">操作</th>
            </tr>
          </thead>
          <tbody>
            {ljnLoading ? (
              <tr><td colSpan="7" className="text-center py-12 text-ljnTextLight">加载中...</td></tr>
            ) : ljnBooks.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-12 text-ljnTextLight">暂无数据</td></tr>
            ) : ljnBooks.map((item) => (
              <tr key={item.ljnId} className="border-b border-ljnBorder/30 hover:bg-ljnPrimaryLight/10 transition-colors">
                <td className="py-3 px-4 text-xs text-ljnTextLight">{item.ljnBookCode || '-'}</td>
                <td className="py-3 px-4">
                  {item.ljnCoverImage ? (
                    <img src={`${LJN_BASE_URL}${item.ljnCoverImage}`} alt="" className="w-10 h-14 object-cover rounded-lg border border-ljnBorder/50" />
                  ) : (
                    <div className="w-10 h-14 bg-ljnPrimaryLight/30 rounded-lg flex items-center justify-center">
                      <Image size={16} className="text-ljnPrimary/50" />
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{item.ljnBookName}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-ljnSecondary/20 text-ljnSecondaryDark rounded-full text-xs">
                    {item.ljnTypeName || ljnGetTypeName(item.ljnTypeId)}
                  </span>
                </td>
                <td className="py-3 px-4 text-ljnPrimaryDark font-medium">¥{parseFloat(item.ljnPrice).toFixed(2)}</td>
                <td className="py-3 px-4 text-ljnTextLight">{item.ljnAuthor || '-'}</td>
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

      {/* Add/Edit Modal */}
      <LjnModal ljnTitle={ljnEditItem ? '编辑图书' : '添加图书'} ljnOpen={ljnModalOpen} ljnOnClose={() => setLjnModalOpen(false)} ljnWidth="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">图书编号</label>
            <input type="text" value={ljnForm.ljnBookCode} onChange={(e) => setLjnForm({ ...ljnForm, ljnBookCode: e.target.value })} className="ljn-input" placeholder="如: LJN-BK-013" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">图书名称 <span className="text-ljnDanger">*</span></label>
            <input type="text" value={ljnForm.ljnBookName} onChange={(e) => setLjnForm({ ...ljnForm, ljnBookName: e.target.value })} className="ljn-input" placeholder="请输入图书名称" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">图书类型 <span className="text-ljnDanger">*</span></label>
            <select value={ljnForm.ljnTypeId} onChange={(e) => setLjnForm({ ...ljnForm, ljnTypeId: e.target.value })} className="ljn-select">
              <option value="">请选择类型</option>
              {ljnTypes.map(t => <option key={t.ljnId} value={t.ljnId}>{t.ljnTypeName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">价格 <span className="text-ljnDanger">*</span></label>
            <input type="number" value={ljnForm.ljnPrice} onChange={(e) => setLjnForm({ ...ljnForm, ljnPrice: e.target.value })} className="ljn-input" placeholder="0.00" min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">作者</label>
            <input type="text" value={ljnForm.ljnAuthor} onChange={(e) => setLjnForm({ ...ljnForm, ljnAuthor: e.target.value })} className="ljn-input" placeholder="请输入作者" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ljnText mb-1.5">出版社</label>
            <input type="text" value={ljnForm.ljnPublisher} onChange={(e) => setLjnForm({ ...ljnForm, ljnPublisher: e.target.value })} className="ljn-input" placeholder="请输入出版社" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ljnText mb-1.5">封面图片</label>
            <div className="flex items-center gap-3">
              {ljnForm.ljnCoverImage && (
                <img src={`${LJN_BASE_URL}${ljnForm.ljnCoverImage}`} alt="" className="w-16 h-20 object-cover rounded-lg border border-ljnBorder" />
              )}
              <label className="ljn-btn-outline text-sm cursor-pointer flex items-center gap-1.5">
                <Upload size={14} /> {ljnUploading ? '上传中...' : '上传图片'}
                <input type="file" accept="image/*" onChange={ljnHandleUpload} className="hidden" disabled={ljnUploading} />
              </label>
              {ljnForm.ljnCoverImage && (
                <button onClick={() => setLjnForm({ ...ljnForm, ljnCoverImage: '' })} className="text-xs text-ljnDanger hover:underline">移除</button>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ljnText mb-1.5">图书描述</label>
            <textarea value={ljnForm.ljnDescription} onChange={(e) => setLjnForm({ ...ljnForm, ljnDescription: e.target.value })} className="ljn-input min-h-[80px] resize-y" placeholder="请输入图书描述" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-ljnBorder/30">
          <button onClick={() => setLjnModalOpen(false)} className="ljn-btn-outline text-sm">取消</button>
          <button onClick={ljnHandleSubmit} disabled={ljnSubmitting} className="ljn-btn-primary text-sm">
            {ljnSubmitting ? '提交中...' : '确定'}
          </button>
        </div>
      </LjnModal>

      <LjnConfirm ljnOpen={ljnConfirmOpen} ljnOnClose={() => setLjnConfirmOpen(false)} ljnOnConfirm={ljnHandleDelete}
        ljnTitle="删除确认" ljnMessage="确定要删除该图书吗？删除后不可恢复。" ljnLoading={ljnDeleting} />
    </div>
  )
}
