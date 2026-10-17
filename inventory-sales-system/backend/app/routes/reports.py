from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Sale, Product
from sqlalchemy import func, extract
from datetime import datetime, timedelta

bp = Blueprint('reports', __name__)


@bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    total_sales = db.session.query(func.coalesce(func.sum(Sale.total), 0)).scalar() or 0
    today = datetime.utcnow().date()
    today_sales = db.session.query(func.coalesce(func.sum(Sale.total), 0)).filter(
        func.date(Sale.sale_date) == today
    ).scalar() or 0

    low_stock_count = Product.query.filter(
        Product.stock_qty <= Product.min_stock,
        Product.is_active == True
    ).count()

    total_products = Product.query.filter_by(is_active=True).count()

    return jsonify({
        'total_sales': round(total_sales, 2),
        'today_sales': round(today_sales, 2),
        'total_products': total_products,
        'low_stock_count': low_stock_count
    })


@bp.route('/daily', methods=['GET'])
@jwt_required()
def daily_sales():
    days = int(request.args.get('days', 7))
    start_date = datetime.utcnow() - timedelta(days=days)

    results = db.session.query(
        func.date(Sale.sale_date).label('date'),
        func.coalesce(func.sum(Sale.total), 0).label('total')
    ).filter(Sale.sale_date >= start_date).group_by(func.date(Sale.sale_date)).order_by(func.date(Sale.sale_date)).all()

    return jsonify({'daily_sales': [{'date': str(r[0]), 'total': round(float(r[1]), 2)} for r in results]})


@bp.route('/top-products', methods=['GET'])
@jwt_required()
def top_products():
    limit = int(request.args.get('limit', 10))
    results = db.session.query(
        Product.name,
        func.coalesce(func.sum(SaleItem.qty), 0).label('total_qty'),
        func.coalesce(func.sum(SaleItem.subtotal), 0).label('total_revenue')
    ).join(SaleItem, Product.id == SaleItem.product_id).join(Sale, Sale.id == SaleItem.sale_id).group_by(Product.id, Product.name).order_by(func.sum(SaleItem.qty).desc()).limit(limit).all()

    return jsonify({
        'top_products': [
            {
                'name': r[0],
                'total_qty': round(float(r[1]), 2),
                'total_revenue': round(float(r[2]), 2)
            } for r in results
        ]
    })