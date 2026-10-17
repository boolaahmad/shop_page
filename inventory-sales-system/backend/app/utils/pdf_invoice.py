from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime


def generate_invoice_pdf(sale, store_info):
    """
    إنشاء ملف PDF لفاتورة مبيعات
    sale: كائن Sale من قاعدة البيانات
    store_info: قاموس يحتوي على معلومات المتجر (اسم، هاتف، عنوان، ضريبية)
    """
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # Kopf الفاتورة
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(width / 2, height - 40, store_info.get('store_name', 'بصمة للسوفت وير'))

    c.setFont('Helvetica', 10)
    c.drawCentredString(width / 2, height - 58, store_info.get('address', 'مصر'))
    c.drawCentredString(width / 2, height - 72, f"هاتف: {store_info.get('phone', '')}")

    c.setStrokeColor(colors.black)
    c.setLineWidth(1)
    c.line(40, height - 90, width - 40, height - 90)

    # بيانات الفاتورة
    c.setFont('Helvetica-Bold', 12)
    c.drawString(40, height - 110, 'فاتورة مبيعات')
    c.setFont('Helvetica', 10)
    c.drawString(40, height - 125, f"رقم الفاتورة: {sale.id}")
    c.drawString(40, height - 140, f"التاريخ: {sale.sale_date.strftime('%d/%m/%Y')}")
    c.drawString(40, height - 155, f"طريقة الدفع: {sale.payment_method}")

    if sale.customer:
        c.drawString(40, height - 170, f"العميل: {sale.customer.name}")
        if sale.customer.phone:
            c.drawString(40, height - 185, f"هاتف العميل: {sale.customer.phone}")

    c.line(40, height - 195, width - 40, height - 195)

    # جدول المنتجات
    y = height - 210
    c.setFont('Helvetica-Bold', 10)
    c.drawString(40, y, 'الصنف')
    c.drawString(200, y, 'الكمية')
    c.drawString(260, y, 'السعر الوحد.')
    c.drawString(360, y, 'الإجمالي')

    c.setFont('Helvetica', 10)
    y -= 20
    for item in sale.items:
        c.drawString(40, y, item.product.name)
        c.drawString(200, y, str(item.qty))
        c.drawString(260, y, f"{item.unit_price:.2f}")
        c.drawString(360, y, f"{item.subtotal:.2f}")
        y -= 20

    c.line(40, y + 5, width - 40, y + 5)

    # totals
    y -= 30
    c.setFont('Helvetica-Bold', 11)
    c.drawRightString(width - 40, y, f"المجموع الفرعي: {sale.subtotal:.2f}")
    y -= 20
    c.drawRightString(width - 40, y, f"الخصم: {sale.discount:.2f}")
    y -= 20
    c.drawRightString(width - 40, y, f"الضريبة (14%): {sale.tax:.2f}")
    y -= 20
    c.drawRightString(width - 40, y, f"الإجمالي النهائي: {sale.total:.2f}")

    c.line(40, y - 10, width - 40, y - 10)

    y -= 40
    c.setFont('Helvetica', 9)
    c.drawCentredString(width / 2, y, "شكراً لتعاملكم معنا - نظام بصمة للسوفت وير")
    c.drawCentredString(width / 2, y - 15, "هذا المستند صادر إلكترونياً عبر نظام إدارة المخزون والمبيعات")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer