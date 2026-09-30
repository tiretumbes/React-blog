import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useBlog } from '../context/BlogContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { author } = useBlog()
  return author ? children : <Navigate to="/login" replace />
}