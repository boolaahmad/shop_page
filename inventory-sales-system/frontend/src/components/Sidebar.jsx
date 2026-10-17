import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const menuItems = [
  { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/products', label: 'المنتجات والمخزون', icon: Package },
  { to: '/sales', label: 'نقطة البيع (POS)', icon: ShoppingCart },
  { to: '/customers', label: 'العملاء', icon: Users },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
]

export default function Sidebar({ isCollapsed = false, onToggle }) {
  return (
    <aside className="fixed inset-y-0 rtl:right-0 ltr:left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 rtl:border-r-0 ltr:border-l-0 transform transition-transform duration-300 ease-in-out flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
            <span className="text-lg font-bold">ب</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">بصمة للسوفت وير</h1>
            <p className="text-xs text-gray-500">إدارة المخزون والمبيعات</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}