import { useState } from 'react'
import { Shield, Database, Globe, Clock, Info } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'الإعدادات العامة', icon: Shield },
    { id: 'store', label: 'بيانات المتجر', icon: Store },
    { id: 'tax', label: 'الضريبة والعملة', icon: Globe },
    { id: 'trial', label: 'فترة التجربة', icon: Clock },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-600">إدارة إعدادات نظام بصمة للسوفت وير</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">الإعدادات العامة للنظام</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم النظام المعروض</label>
                <input className="input-field" value="بصمة للسوفت وير" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">إصدار النظام</label>
                <input className="input-field" value="v1.0.0" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللغة الافتراضية</label>
                <select className="input-field">
                  <option>العربية (ar-EG)</option>
                  <option>English (en)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
                <select className="input-field">
                  <option>توقيت القاهرة (UTC+2)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">بيانات المتجر للفواتير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر</label>
                <input className="input-field" placeholder="اسم متجرك" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم التسجيل الضريبي</label>
                <input className="input-field" placeholder="مثل: 123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
                <input className="input-field" placeholder="01xxxxxxxxx" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <input className="input-field" placeholder="عنوان المتجر الكامل، محافظة، منطقة" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">إعدادات الضريبة والعملة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نسبة ضريبة القيمة المضافة (%)</label>
                <input className="input-field" value="14" />
                <p className="text-xs text-gray-500 mt-1">المعدل المطبق في مصر حالياً</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العملة الافتراضية</label>
                <select className="input-field">
                  <option>الجنيه المصري (EGP)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">الفاتورة الإلكترونية (ETA)</p>
                      <p className="text-sm text-gray-600">
                        للربط مع مصلحة الضرائب المصرية وإصدار فواتير إلكترونية معتمدة، يلزم تطوير وحدة إرسال فواتير بصيغة JSON/XML عبر واجهة ETA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trial' && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">فترة التجربة المجانية</h3>
            <div className="bg-green-50 border border-green-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">النظام في فترة التجربة المجانية</p>
                  <p className="text-sm text-green-700">المدة المتبقية: 60 يوماً</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">تاريخ البدء</p>
                  <p className="font-semibold text-gray-900">اليوم</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                  <p className="font-semibold text-gray-900">بعد 60 يوماً</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">
                  بعد انتهاء فترة التجربة، يمكن للعملاء الاستمرار باستخدام النظام عبر خطة اشتراك شهرية أو سنوية تحددها أنت.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}