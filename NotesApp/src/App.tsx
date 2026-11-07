import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Editor } from '../pages/Editor'
import { Layout } from '../components/Layout'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id?" element={<Editor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}