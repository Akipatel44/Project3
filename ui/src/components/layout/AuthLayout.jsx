/**
 * AuthLayout Component
 * Layout for authentication pages (login, register)
 * Typically centered, minimal header
 * Props: children (ReactNode)
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
