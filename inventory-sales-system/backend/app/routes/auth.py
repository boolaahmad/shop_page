from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User

bp = Blueprint('auth', __name__)


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'اسم المستخدم وكلمة المرور مطلوبان'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'بيانات تسجيل الدخول غير صحيحة'}), 401

    if not user.is_active:
        return jsonify({'error': 'الحساب غير مفعل'}), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    })


@bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'المستخدم غير موجود'}), 404
    return jsonify({'user': user.to_dict()})


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'cashier')

    if not username or not email or not password:
        return jsonify({'error': 'جميع الحقول مطلوبة'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'اسم المستخدم مستخدم مسبقاً'}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'البريد الإلكتروني مستخدم مسبقاً'}), 409

    user = User(username=username, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'تم إنشاء الحساب بنجاح', 'user': user.to_dict()}), 201