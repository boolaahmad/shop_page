from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Product, Category

bp = Blueprint('products', __name__)


@bp.route('', methods=['GET'])
@jwt_required()
def list_products():
    products = Product.query.filter_by(is_active=True).all()
    return jsonify({'products': [p.to_dict() for p in products]})


@bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({'product': product.to_dict()})


@bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json() or {}
    required = ['name', 'sku', 'sell_price', 'stock_qty']
    for field in required:
        if field not in data:
            return jsonify({'error': f'الحقل {field} مطلوب'}), 400

    if Product.query.filter_by(sku=data['sku']).first():
        return jsonify({'error': 'كود المنتج (SKU) مستخدم مسبقاً'}), 409

    product = Product(
        name=data['name'],
        sku=data['sku'],
        category_id=data.get('category_id'),
        buy_price=float(data.get('buy_price', 0)),
        sell_price=float(data.get('sell_price', 0)),
        stock_qty=float(data.get('stock_qty', 0)),
        min_stock=float(data.get('min_stock', 5)),
        unit=data.get('unit', 'قطعة'),
        image_url=data.get('image_url'),
        is_active=data.get('is_active', True)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'تم إضافة المنتج بنجاح', 'product': product.to_dict()}), 201


@bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json() or {}

    product.name = data.get('name', product.name)
    product.sku = data.get('sku', product.sku)
    product.category_id = data.get('category_id', product.category_id)
    product.buy_price = float(data.get('buy_price', product.buy_price))
    product.sell_price = float(data.get('sell_price', product.sell_price))
    product.stock_qty = float(data.get('stock_qty', product.stock_qty))
    product.min_stock = float(data.get('min_stock', product.min_stock))
    product.unit = data.get('unit', product.unit)
    product.image_url = data.get('image_url', product.image_url)
    product.is_active = data.get('is_active', product.is_active)

    db.session.commit()
    return jsonify({'message': 'تم تحديث المنتج بنجاح', 'product': product.to_dict()})


@bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    product.is_active = False
    db.session.commit()
    return jsonify({'message': 'تم تعطيل المنتج بنجاح'})


@bp.route('/low-stock', methods=['GET'])
@jwt_required()
def low_stock():
    products = Product.query.filter(Product.stock_qty <= Product.min_stock, Product.is_active == True).all()
    return jsonify({'low_stock_products': [p.to_dict() for p in products]})