
// 1. components/layout/AppLayout.tsx
// Reusable layout with sidebar for all authenticated pages
// ============================================

'use client'

import { useState, ReactNode } from 'react'
import { redirect, usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Zap, History, BookOpen, CreditCard, User, LogOut, 
  Menu, X, Sparkles, ChevronRight
} from 'lucide-react'

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const menuItems = [
    { id: 'workspace', path: '/workspace', icon: <Zap className="w-5 h-5 text-white" />, label: 'Workspace' },
    { id: 'history', path: '/dashboard', icon: <History className="w-5 h-5 text-white" />, label: 'Email History' },
    { id: 'documentation', path: '/documentation', icon: <BookOpen className="w-5 h-5 text-white" />, label: 'Documentation' },
    { id: 'pricing', path: '/pricing', icon: <CreditCard className="w-5 h-5 text-white" />, label: 'Pricing' },
    { id: 'profile', path: '/profile', icon: <User className="w-5 h-5 text-white" />, label: 'Profile' },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-100 flex">
      {/* Desktop Sidebar */}
        <aside
            className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex flex-col h-screen bg-gray-400 border-r border-slate-200 transition-all duration-300 ${
                sidebarOpen ? 'w-64' : 'w-20'
            }`}
        >


        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 " />  
              
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold bg-black bg-clip-text text-transparent">
                ReachOutAI
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 ">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-slate-100 hover:bg-slate-500'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="mt-auto p-4 border-t border-slate-200 space-y-1">
          {sidebarOpen && session?.user && (
            <div onClick={()=>(redirect("/profile"))} className="px-4 py-2 mb-2 flex flex-col items-center bg-gradient-to-br  to-gray-600 rounded-lg text-white text-center">
                
                <img
                    
                  src={session.user.image || '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mb-2"
                />
              <p className="text-1.5xl font-extrabold  truncate">{session.user.name}</p>
              <p className="text-xs text-white truncate">{session.user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 text-slate-500 hover:text-slate-700"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ReachOutAI
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 text-amber-50 bg-white">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(item.path)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium text-black">{item.label}</span>
                  </button>
                )
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 pt-16 lg:pt-0 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
        >
        {children}
      </main>
    </div>
  )
}