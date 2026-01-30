import { Header, Footer } from '@/components/common'

/**
 * MainLayout Component
 * Primary layout wrapping main content with header and footer
 * Props: children (ReactNode)
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
