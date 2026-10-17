import { useQuery } from '@tanstack/react-query'
import { BarChart3, Clock, TrendingUp, FileText } from 'lucide-react'
import api from '../lib/api'
import { formatCurrency } from '../lib/utils'

export default function Reports() {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/reports/dashboard')
      return res.data
    },
  })

  const { data: daily = [], isLoading: dailyLoading } = useQuery({
    queryKey: ['daily-sales'],
    queryFn: async () => {
      const res = await api.get('/reports/daily?days=7')
      return res.data.daily_sales
    },
  })

  const { data: top = [], isLoading: topLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const res = await api.get('/reports/top-products?limit=5')
      return res.data.top_products
    },
  })

  if (dashboardLoading || dailyLoading || topLoading) {
    return <div className="p-6">جاري تحميل التقارير...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
        <p className="text-gray-600">متابعة أداء المبيعات والمنتجات الأكثر رواجاً</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-blue-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard?.total_sales || 0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="card bg-green-50 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">مبيعات اليوم</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard?.today_sales || 0)}</p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="card bg-purple-50 border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.total_products || 0}</p>
            </div>
            <Package className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="card bg-red-50 border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">منتجات منخفضة المخزون</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.low_stock_count || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">المبيعات اليومية (آخر 7 أيام)</h3>
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-64 flex items-end gap-2">
            {daily.map((day, i) => {
              const height = Math.max(10, (day.total / Math.max(...daily.map(d => d.total), 1)) * 200)
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                  <div
                    className="w-full bg-primary-600 rounded-t-sm"
                    style={{ height: `${height}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{day.date}</span>
                  <span className="text-xs font-bold text-primary-700">{formatCurrency(day.total)}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">أكثر المنتجات مبيعاً</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {top.length > 0 ? (
              top.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(item.total_qty)} وحدة • {formatCurrency(item.total_revenue)}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(item.total_revenue)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">لا توجد بيانات مبيعات بعد</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}