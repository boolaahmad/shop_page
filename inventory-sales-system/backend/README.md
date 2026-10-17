# نظام إدارة المخزون والمبيعات - الواجهة الخلفية (Backend)

نظام ويب لإدارة المخزون والمبيعات موجه للسوق المصري، يدعم اللغة العربية، الفاتورة الإلكترونية، والجنيه المصري.

## تقنيات التشغيل
- Python 3.11 + Flask
- Flask-SQLAlchemy (قاعدة بيانات)
- Flask-JWT-Extended (التحقق من الهوية)
- Flask-Migrate (إدارة النسخات)
- Flask-CORS
- ReportLab (طباعة الفواتير PDF)

## التشغيل السريع (التطوير)

```bash
# الدخول للمجلد
cd backend

# إنشاء البيئة الافتراضية
python -m venv venv
source venv/bin/activate  # ويندوز: venv\Scripts\activate

# تثبيت المتطلبات
pip install -r requirements.txt

# نسخ متغيرات البيئة
cp .env.example .env

# إنشاء قاعدة البيانات والبيانات الأولية
flask init-db

# تشغيل الخادم
flask run --host=0.0.0.0 --port=5000
```

## التشغيل عبر Docker

```bash
cd ..
docker-compose up --build
```

## نقاط نهاية API رئيسية

| المسار | الطريقة | الوصف |
|--------|--------|-------|
| `/api/health` | GET | فحص حالة الخادم |
| `/api/auth/login` | POST | تسجيل الدخول |
| `/api/auth/me` | GET | بيانات المستخدم الحالي |
| `/api/auth/register` | POST | إنشاء مستخدم جديد |
| `/api/products` | GET/POST | إدارة المنتجات |
| `/api/products/low-stock` | GET | produtos ناقصة المخزون |
| `/api/sales` | GET/POST | إدارة المبيعات والفواتير |
| `/api/customers` | GET/POST | إدارة العملاء |
| `/api/reports/dashboard` | GET | لوحة التحكم الإحصائية |
| `/api/reports/daily` | GET | المبيعات اليومية |
| `/api/reports/top-products` | GET | أكثر المنتجات مبيعاً |

## بيانات الدخول الافتراضية
- اسم المستخدم: `admin`
- كلمة المرور: `admin123`
- الصلاحية: `admin`

## ملاحظات للسوق المصري
- العملة افتراضياً: الجنيه المصري (EGP)
- ضريبة القيمة المضافة: 14% (قابلة للتعديل من `.env`)
- فترة التجربة المجانية: 60 يوماً (قابلة للتعديل)
-支持 الفاتورة印اعة PDF محلياً؛ للربط بمصلحة الضرائب المصرية (ETA) يحتاج تطوير وحدة إرسال فواتير إلكترونية JSON/XML.