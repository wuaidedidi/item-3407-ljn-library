import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LjnLogin from './pages/LjnLogin'
import LjnLayout from './pages/LjnLayout'
import LjnBookManage from './pages/LjnBookManage'
import LjnBookTypeManage from './pages/LjnBookTypeManage'
import LjnUserManage from './pages/LjnUserManage'
import LjnBrowse from './pages/LjnBrowse'
import LjnProfile from './pages/LjnProfile'
import { ljnIsLoggedIn, ljnIsAdmin } from './utils/ljnAuth'

function LjnPrivateRoute({ children }) {
  if (!ljnIsLoggedIn()) return <Navigate to="/login" replace />
  return children
}

function LjnAdminRoute({ children }) {
  if (!ljnIsLoggedIn()) return <Navigate to="/login" replace />
  if (!ljnIsAdmin()) return <Navigate to="/browse" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#4a3347',
            boxShadow: '0 4px 20px rgba(232, 160, 191, 0.25)',
            border: '1px solid #f0dce6',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#7ecda0', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef8b8b', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LjnLogin />} />
        <Route path="/" element={<LjnPrivateRoute><LjnLayout /></LjnPrivateRoute>}>
          <Route index element={<Navigate to="/browse" replace />} />
          <Route path="browse" element={<LjnBrowse />} />
          <Route path="profile" element={<LjnProfile />} />
          <Route path="admin/books" element={<LjnAdminRoute><LjnBookManage /></LjnAdminRoute>} />
          <Route path="admin/book-types" element={<LjnAdminRoute><LjnBookTypeManage /></LjnAdminRoute>} />
          <Route path="admin/users" element={<LjnAdminRoute><LjnUserManage /></LjnAdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
