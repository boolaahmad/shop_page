import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2, Edit3, Package, AlertTriangle } from 'lucide-react'
import api from '../lib/api'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

export default function Products() {
  const [form, setForm] = useState({ name: '', sku: '', buy_price: '', sell_price: '', stock_qty: '', min_stock: '5', unit: 'قطعة', category_id: '' })
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products')
      return res.data.products
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newProduct) => {
      const res = await api.post('/products', newProduct)
      return res.data
    },
    onSuccess: () => {
      toast.success('تم إضافة المنتج بنجاح')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      setForm({ name: '', sku: '', buy_price: '', sell_price: '', stock_qty: '', min_stock: '5', unit: 'قطعة', category_id: '' })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'فشل إضافة المنتج'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      ...form,
      buy_price: parseFloat(form.buy_price) || 0,
      sell_price: parseFloat(form.sell_price) || 0,
      stock_qty: parseFloat(form.stock_qty) || 0,
      min_stock: parseFloat(form.min_stock) || 5,
    })
  }

  if (isLoading) return <div className="p-6">جاري التحميل...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنتجات والمخزون</h1>
          <p className="text-gray-600">إدارة جميع أصناف المتجر ومتابعة الكميات المتوفرة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة منتج
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">إضافة منتج جديد</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">اسم المنتج</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثل: أرزة صنوبر 1 كجم"
                required
                dir="auto"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">الكود (SKU)</label>
              <input
                className="input-field"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="مثل: PRD-001"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">سعر الشراء</label>
              <input
                type="number"
                className="input-field"
                value={form.buy_price}
                onChange={(e) => setForm({ ...form, buy_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">سعر البيع</label>
              <input
                type="number"
                className="input-field"
                value={form.sell_price}
                onChange={(e) => setForm({ ...form, sell_price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">الكمية الأولية</label>
              <input
                type="number"
                className="input-field"
                value={form.stock_qty}
                onChange={(e) => setForm({ ...form, stock_qty: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">حد التنبيه</label>
              <input
                type="number"
                className="input-field"
                value={form.min_stock}
                onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">الوحدة</label>
              <select
                className="input-field"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                <option>قطعة</option>
                <option>كرتونة</option>
                <option>زجاجة</option>
                <option>كيس</option>
                <option>علبة</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button type="submit" className="btn-primary flex-1">حفظ المنتج</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكود</th>
              <th>سعر البيع</th>
              <th>المخزون</th>
              <th>الوحدة</th>
              <th className="text-center">الحالة</th>
              <th className="text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-medium text-gray-900">{p.name}</td>
                <td className="text-gray-600">{p.sku}</td>
                <td className="font-mono number-arabic">{formatCurrency(p.sell_price)}</td>
                <td className="font-medium">{p.stock_qty}</td>
                <td className="text-gray-600 text-sm">{p.unit}</td>
                <td className="text-center">
                  {p.low_stock ? (
                    <span className="badge badge-warning">منخفض</span>
                  ) : (
                    <span className="badge badge-success">متوفر</span>
                  )}
                </td>
                <td className="text-center">
                  <button className="text-gray-400 hover:text-primary-600" title="تعديل">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 ml-2 rtl:ml-0 ltr:mr-2" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  لا توجد منتجات مضافة بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}