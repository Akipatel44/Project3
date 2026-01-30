import { Navbar } from '@/components/layout'
import { Footer } from '@/components/common'

/**
 * MainLayout Component
 * Primary layout wrapping main content with navbar and footer
 * Props: children (ReactNode)
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
