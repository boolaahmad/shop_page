from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Customer

bp = Blueprint('customers', __name__)


@bp.route('', methods=['GET'])
@jwt_required()
def list_customers():
    customers = Customer.query.all()
    return jsonify({'customers': [c.to_dict() for c in customers]})


@bp.route('/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    return jsonify({'customer': customer.to_dict()})


@bp.route('', methods=['POST'])
@jwt_required()
def create_customer():
    data = request.get_json() or {}
    if not data.get('name'):
        return jsonify({'error': 'اسم العميل مطلوب'}), 400

    customer = Customer(
        name=data['name'],
        phone=data.get('phone'),
        address=data.get('address'),
        balance=float(data.get('balance', 0))
    )
    db.session.add(customer)
    db.session.commit()
    return jsonify({'message': 'تم إضافة العميل بنجاح', 'customer': customer.to_dict()}), 201


@bp.route('/<int:customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json() or {}

    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.address = data.get('address', customer.address)
    customer.balance = float(data.get('balance', customer.balance))

    db.session.commit()
    return jsonify({'message': 'تم تحديث بيانات العميل بنجاح', 'customer': customer.to_dict()})


@bp.route('/<int:customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'تم حذف العميل بنجاح'})