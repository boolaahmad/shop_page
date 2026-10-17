import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingCart, Plus, Print, Search, CreditCard, Wallet, Banknote } from 'lucide-react'
import api from '../lib/api'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

export default function Sales() {
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amountReceived, setAmountReceived] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const queryClient = useQueryClient()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products')
      return res.data.products
    },
  })

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers')
      return res.data.customers
    },
    enabled: showCustomerSearch,
  })

  const createSale = useMutation({
    mutationFn: async (saleData) => {
      const res = await api.post('/sales', saleData)
      return res.data
    },
    onSuccess: () => {
      toast.success('تم إتمام البيع وإصدار الفاتورة بنجاح')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setCart([])
      setCustomer(null)
      setDiscount(0)
      setAmountReceived(0)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'فشل إتمام البيع'),
  })

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = Math.round((subtotal - discount) * 0.14 * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100
  const change = amountReceived - total

  const addToCart = (product) => {
    const existing = cart.find((item) => item.product_id === product.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product_id === product.id
            ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.unit_price }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, qty: 1, unit_price: product.sell_price, subtotal: product.sell_price }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product_id !== productId))
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('يرجى إضافة منتجات إلى سلة المشتريات')
      return
    }

    createSale.mutate({
      items: cart.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
        unit_price: item.unit_price,
      })),
      customer_id: customer?.id || null,
      discount,
      payment_method: paymentMethod,
      notes: 'فاتورة بيع عبر نظام بصمة',
    })
  }

  if (isLoading) return <div className="p-6">جاري تحميل المنتجات...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* لوحة المنتجات */}
      <div className="lg:col-span-5 space-y-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">اختيار المنتجات</h3>
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10 rtl:pl-3 ltl:pr-3 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث عن منتج..."
                dir="auto"
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">لا توجد منتجات مطابقة</div>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-primary-50 hover:border-primary-200 transition-colors cursor-pointer group`}
                  onClick={() => addToCart(p)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{p.name}</span>
                      {p.low_stock && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">منخفض</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{p.sku} • {p.unit}</div>
                  </div>
                  <div className="text-right text-sm font-bold text-primary-600">
                    {formatCurrency(p.sell_price)}
                  </div>
                  <Plus className="w-4 h-4 text-primary-600" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* سلة المشتريات */}
      <div className="lg:col-span-7 space-y-4">
        <div className="card h-[calc(100vh-4rem)] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary-600" /> سلة المشتريات
              {cart.length > 0 && (
                <span className="ml-2 rtl:ml-0 ltr:mr-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{cart.reduce((s, i) => s + i.qty, 0)} منتج</span>
              )}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-gray-300 mb-3">
                  <ShoppingCart className="w-12 h-12" />
                </div>
                <p className="text-sm">سلة المشتريات فارغة</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1 min-w-0 mr-3 rtl:mr-0 ltr:ml-3">
                    <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(item.qty)} {item.unit} × {formatCurrency(item.unit_price)}
                    </div>
                  </div>
                  <div className="text-right font-mono number-arabic text-sm font-bold">
                    {formatCurrency(item.subtotal)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المجموع الفرعي</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الخصم</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right rtl:text-left border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <span className="text-gray-400">ج.م.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ضريبة القيمة المضافة (14%)</span>
                <span className="font-medium text-gray-800">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="text-gray-900">الإجمالي النهائي</span>
                <span className="text-primary-700">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <label className="text-xs font-medium text-gray-600">طريقة الدفع</label>
              <div className="grid grid-cols-3 gap-2">
                {[['cash', 'نقدي', Banknote], ['wallet', 'محفظة إلكترونية', Wallet], ['card', 'بطاقة ائتمانية', CreditCard]]}.map(([value, label, Icon]) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
                      paymentMethod === value
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                )}
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 mb-1 block">المبلغ المستلم من العميل</label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                  className="input-field"
                  placeholder="0.00"
                />
                {amountReceived > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    المبلغ المسترد: <span className="font-bold text-green-600">{formatCurrency(Math.max(0, change))}</span>
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 py-3"
            >
              <Print className="w-4 h-4" /> إصدار الفاتورة وإتمام البيع
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}