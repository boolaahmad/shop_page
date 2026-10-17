from app.models import Product
from app import db


def deduct_stock(product_id, qty):
    """خصم كمية من المخزون بعد البيع"""
    product = Product.query.get(product_id)
    if not product:
        return False, 'المنتج غير موجود'
    if product.stock_qty < qty:
        return False, 'الكمية غير كافية في المخزون'
    product.stock_qty -= qty
    db.session.commit()
    return True, product.to_dict()


def add_stock(product_id, qty):
    """إضافة كمية إلى المخزون (إدخال بضاعة جديدة)"""
    product = Product.query.get(product_id)
    if not product:
        return False, 'المنتج غير موجود'
    product.stock_qty += qty
    db.session.commit()
    return True, product.to_dict()


def get_low_stock_products():
    """إرجاع المنتجات التي وصلت لحد المخزون الأدنى"""
    return Product.query.filter(
        Product.stock_qty <= Product.min_stock,
        Product.is_active == True
    ).all()