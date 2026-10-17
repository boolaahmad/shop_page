import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DollarSign, Package, ShoppingCart, Users, AlertCircle, Clock } from 'lucide-react'
import api from '../lib/api'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

const statCards = [
  { title: 'إجمالي المبيعات', value: '0.00', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'مبيعات اليوم', value: '0.00', icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50' },
  { title: 'إجمالي المنتجات', value: '0', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  { title: 'منخفض المخزون', value: '0', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(statCards)

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/reports/dashboard')
      return res.data
    },
  })

  useEffect(() => {
    if (dashboard) {
      setStats([
        { ...statCards[0], value: formatCurrency(dashboard.total_sales) },
        { ...statCards[1], value: formatCurrency(dashboard.today_sales) },
        { ...statCards[2], value: dashboard.total_products },
        { ...statCards[3], value: dashboard.low_stock_count },
      ])
    }
  }, [dashboard])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-2">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500">جاري تحميل البيانات...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بعودتك إلى نظام بصمة للسوفت وير</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, i) => (
          <div key={i} className={`${card.bg} p-6 rounded-xl border border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 text-left rtl:text-right bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
              <span>إضافة منتج جديد</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-left rtl:text-right bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
              <span>فاتورة بيع جديدة</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-left rtl:text-right bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
              <span>إضافة عميل جديد</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">تنبيهات المخزون</h3>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">منتجات ناقصة المخزون</span>
            </div>
            <p className="text-sm text-red-600 mb-3">يوجد {stats[3]?.value || '0'} منتجاً وصلت кreshold المخزون الأدنى. يرجى إعادة التوريد.</p>
            <button className="text-sm text-primary-600 hover:underline">عرض المنتجات الناقصة</button>
          </div>
        </div>
      </div>
    </div>
  )
}