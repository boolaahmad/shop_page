import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Users, Edit3, Trash2, Phone } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Customers() {
  const [form, setForm] = useState({ name: '', phone: '', address: '', balance: '0' })
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers')
      return res.data.customers
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newCustomer) => {
      const res = await api.post('/customers', newCustomer)
      return res.data
    },
    onSuccess: () => {
      toast.success('تم إضافة العميل بنجاح')
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setShowForm(false)
      setForm({ name: '', phone: '', address: '', balance: '0' })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'فشل إضافة العميل'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      ...form,
      balance: parseFloat(form.balance) || 0,
    })
  }

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  )

  if (isLoading) return <div className="p-6">جاري التحميل...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-600">بيانات العملاء ومتابعة الأرصدة والمدفوعات</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة عميل
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">إضافة عميل جديد</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">اسم العميل</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثل: أحمد محمد علي"
                required
                dir="auto"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute left-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="input-field pl-10 rtl:pl-3 ltl:pr-3 pr-10"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  dir="auto"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">العنوان</label>
              <input
                className="input-field"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="العنوان completo"
                dir="auto"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">الرصيد الافتتاحي (ج.م.)</label>
              <input
                type="number"
                className="input-field"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button type="submit" className="btn-primary flex-1">حفظ العميل</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 rtl:right-0 ltr:left-0 z-10 flex items-center">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="input-field pl-10 rtl:pl-3 ltl:pr-3 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث عن عميل..."
          dir="auto"
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>اسم العميل</th>
              <th>الهاتف</th>
              <th>الرصيد (ج.م.)</th>
              <th className="text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-medium text-gray-900">{c.name}</td>
                <td className="text-gray-600 text-sm">{c.phone || 'غير محدد'}</td>
                <td className={c.balance > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                  {c.balance >= 0 ? 'مدين بـ ' : 'دائن بـ '} {Math.abs(c.balance).toFixed(2)}
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
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  لا توجد عملاء مضافة بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}