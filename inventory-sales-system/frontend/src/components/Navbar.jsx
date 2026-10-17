import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Sun, Moon, User, Search } from 'lucide-react'

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 rtl:border-r-0 ltr:border-l-0">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 rtl:hidden ltr:block">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 hidden sm:block">لوحة التحكم</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="البحث..."
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-48"
              dir="rtl"
            />
          </div>

          <div className="relative group">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                مستخدم
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">الحساب</span>
            </button>

            {userMenuOpen && (
              <div className="absolute rtl:right-0 ltr:left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 mb-2">
                  admin@basma-software.com
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => navigate('/settings')}>
                  الإعدادات
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={() => navigate('/login')}>
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}