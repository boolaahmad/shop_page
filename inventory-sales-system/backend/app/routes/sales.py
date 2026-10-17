from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Sale, SaleItem, Product, Customer
from datetime import datetime

bp = Blueprint('sales', __name__)


@bp.route('', methods=['GET'])
@jwt_required()
def list_sales():
    sales = Sale.query.order_by(Sale.sale_date.desc()).all()
    return jsonify({'sales': [s.to_dict() for s in sales]})


@bp.route('/<int:sale_id>', methods=['GET'])
@jwt_required()
def get_sale(sale_id):
    sale = Sale.query.get_or_404(sale_id)
    return jsonify({'sale': sale.to_dict()})


@bp.route('', methods=['POST'])
@jwt_required()
def create_sale():
    data = request.get_json() or {}
    user_id = get_jwt_identity()

    items = data.get('items', [])
    if not items or len(items) == 0:
        return jsonify({'error': 'يجب إضافة منتج واحد على الأقل للفاتورة'}), 400

    subtotal = 0
    sale_items = []

    for item in items:
        product = Product.query.get(item.get('product_id'))
        if not product or not product.is_active:
            return jsonify({'error': f"المنتج {item.get('product_id')} غير موجود أو غير نشط"}), 400

        qty = float(item.get('qty', 0))
        if qty <= 0:
            return jsonify({'error': 'الكمية يجب أن تكون أكبر من صفر'}), 400

        if product.stock_qty < qty:
            return jsonify({'error': f"غير كافي من المخزون للمنتج: {product.name}"}), 400

        unit_price = float(item.get('unit_price', product.sell_price))
        item_subtotal = qty * unit_price
        subtotal += item_subtotal

        sale_items.append({
            'product': product,
            'qty': qty,
            'unit_price': unit_price,
            'subtotal': item_subtotal
        })

    discount = float(data.get('discount', 0))
    tax_rate = float(data.get('tax_rate', 0.14))
    tax = round((subtotal - discount) * tax_rate, 2)
    total = round(subtotal - discount + tax, 2)

    sale = Sale(
        customer_id=data.get('customer_id'),
        user_id=int(user_id),
        subtotal=subtotal,
        discount=discount,
        tax=tax,
        total=total,
        payment_method=data.get('payment_method', 'cash'),
        notes=data.get('notes')
    )
    db.session.add(sale)
    db.session.flush()

    for si in sale_items:
        product = si['product']
        product.stock_qty -= si['qty']
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=product.id,
            qty=si['qty'],
            unit_price=si['unit_price'],
            subtotal=si['subtotal']
        )
        db.session.add(sale_item)

    db.session.commit()
    return jsonify({'message': 'تم إتمام البيع بنجاح', 'sale': sale.to_dict()}), 201


@bp.route('/<int:sale_id>', methods=['DELETE'])
@jwt_required()
def delete_sale(sale_id):
    sale = Sale.query.get_or_404(sale_id)
    db.session.delete(sale)
    db.session.commit()
    return jsonify({'message': 'تم حذف الفاتورة بنجاح'})