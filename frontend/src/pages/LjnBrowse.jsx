import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, BookOpen, Image, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import ljnRequest from '../utils/ljnRequest'
import LjnPagination from '../components/LjnPagination'
import LjnModal from '../components/LjnModal'

const LJN_BASE_URL = window.location.origin

export default function LjnBrowse() {
  const [ljnBooks, setLjnBooks] = useState([])
  const [ljnTotal, setLjnTotal] = useState(0)
  const [ljnPageNum, setLjnPageNum] = useState(1)
  const [ljnPageSize] = useState(12)
  const [ljnTypes, setLjnTypes] = useState([])
  const [ljnLoading, setLjnLoading] = useState(false)
  const [ljnAdvanced, setLjnAdvanced] = useState(false)
  const [ljnDetailOpen, setLjnDetailOpen] = useState(false)
  const [ljnDetailBook, setLjnDetailBook] = useState(null)

  const [ljnQuery, setLjnQuery] = useState({
    ljnBookCode: '', ljnBookName: '', ljnTypeId: '', ljnPriceMin: '', ljnPriceMax: ''
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

  const ljnGetTypeName = (typeId) => {
    const ljnType = ljnTypes.find(t => t.ljnId === typeId)
    return ljnType ? ljnType.ljnTypeName : '未分类'
  }

  const ljnOpenDetail = (book) => {
    setLjnDetailBook(book)
    setLjnDetailOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen size={22} className="text-ljnPrimary" />
        <h2 className="text-xl font-bold text-ljnText">图书浏览</h2>
        <span className="text-sm text-ljnTextLight ml-2">共 {ljnTotal} 本</span>
      </div>

      {/* Search */}
      <div className="ljn-card space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ljnTextLight" />
              <input type="text" value={ljnQuery.ljnBookName}
                onChange={(e) => setLjnQuery({ ...ljnQuery, ljnBookName: e.target.value })}
                placeholder="搜索图书名称..." className="ljn-input pl-10" />
            </div>
          </div>
          <div className="min-w-[150px]">
            <select value={ljnQuery.ljnTypeId}
              onChange={(e) => setLjnQuery({ ...ljnQuery, ljnTypeId: e.target.value })}
              className="ljn-select">
              <option value="">全部类型</option>
              {ljnTypes.map(t => <option key={t.ljnId} value={t.ljnId}>{t.ljnTypeName}</option>)}
            </select>
          </div>
          <button onClick={() => setLjnAdvanced(!ljnAdvanced)}
            className="ljn-btn-outline text-sm flex items-center gap-1.5">
            <Filter size={14} />
            {ljnAdvanced ? '收起' : '高级搜索'}
            {ljnAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => setLjnPageNum(1)} className="ljn-btn-primary text-sm">搜索</button>
          <button onClick={ljnResetQuery} className="ljn-btn-outline text-sm">重置</button>
        </div>

        {ljnAdvanced && (
          <div className="flex flex-wrap gap-3 pt-3 border-t border-ljnBorder/30">
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
                placeholder="¥ 最低" className="ljn-input text-sm" min="0" />
            </div>
            <div className="min-w-[120px]">
              <label className="block text-xs font-medium text-ljnTextLight mb-1">最高价格</label>
              <input type="number" value={ljnQuery.ljnPriceMax}
                onChange={(e) => setLjnQuery({ ...ljnQuery, ljnPriceMax: e.target.value })}
                placeholder="¥ 最高" className="ljn-input text-sm" min="0" />
            </div>
          </div>
        )}
      </div>

      {/* Book Grid */}
      {ljnLoading ? (
        <div className="text-center py-20 text-ljnTextLight">加载中...</div>
      ) : ljnBooks.length === 0 ? (
        <div className="text-center py-20 text-ljnTextLight">
          <BookOpen size={48} className="mx-auto mb-4 text-ljnPrimary/30" />
          <p>暂无图书数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ljnBooks.map((item) => (
            <div key={item.ljnId}
              onClick={() => ljnOpenDetail(item)}
              className="ljn-card p-0 overflow-hidden cursor-pointer group hover:shadow-ljnHover transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-[5/7] bg-gradient-to-br from-ljnPrimaryLight/40 to-ljnSecondary/20 flex items-center justify-center overflow-hidden">
                {item.ljnCoverImage ? (
                  <img src={`${LJN_BASE_URL}${item.ljnCoverImage}`} alt={item.ljnBookName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-ljnPrimary/40">
                    <Image size={40} />
                    <span className="text-xs">暂无封面</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-ljnText mb-1.5 truncate group-hover:text-ljnPrimary transition-colors">
                  {item.ljnBookName}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ljnPrimaryLight/30 text-ljnPrimaryDark rounded-full text-xs">
                    <Tag size={10} /> {item.ljnTypeName || ljnGetTypeName(item.ljnTypeId)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ljnPrimaryDark font-bold text-lg">¥{parseFloat(item.ljnPrice).toFixed(2)}</span>
                  <span className="text-xs text-ljnTextLight">{item.ljnAuthor || '未知作者'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LjnPagination ljnCurrent={ljnPageNum} ljnTotal={ljnTotal} ljnPageSize={ljnPageSize} ljnOnChange={setLjnPageNum} />

      {/* Detail Modal */}
      <LjnModal ljnTitle="图书详情" ljnOpen={ljnDetailOpen} ljnOnClose={() => setLjnDetailOpen(false)} ljnWidth="max-w-2xl">
        {ljnDetailBook && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 flex-shrink-0">
              <div className="h-64 bg-gradient-to-br from-ljnPrimaryLight/40 to-ljnSecondary/20 rounded-ljn overflow-hidden flex items-center justify-center">
                {ljnDetailBook.ljnCoverImage ? (
                  <img src={`${LJN_BASE_URL}${ljnDetailBook.ljnCoverImage}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Image size={48} className="text-ljnPrimary/30" />
                )}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-ljnText">{ljnDetailBook.ljnBookName}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-ljnTextLight">编号：</span>
                  <span className="font-medium">{ljnDetailBook.ljnBookCode || '-'}</span>
                </div>
                <div>
                  <span className="text-ljnTextLight">类型：</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ljnPrimaryLight/30 text-ljnPrimaryDark rounded-full text-xs font-medium">
                    {ljnDetailBook.ljnTypeName || ljnGetTypeName(ljnDetailBook.ljnTypeId)}
                  </span>
                </div>
                <div>
                  <span className="text-ljnTextLight">价格：</span>
                  <span className="font-bold text-ljnPrimaryDark text-lg">¥{parseFloat(ljnDetailBook.ljnPrice).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-ljnTextLight">作者：</span>
                  <span className="font-medium">{ljnDetailBook.ljnAuthor || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-ljnTextLight">出版社：</span>
                  <span className="font-medium">{ljnDetailBook.ljnPublisher || '-'}</span>
                </div>
              </div>
              {ljnDetailBook.ljnDescription && (
                <div>
                  <p className="text-sm text-ljnTextLight mb-1">简介：</p>
                  <p className="text-sm text-ljnText leading-relaxed bg-ljnBg rounded-ljn p-3">
                    {ljnDetailBook.ljnDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </LjnModal>
    </div>
  )
}
