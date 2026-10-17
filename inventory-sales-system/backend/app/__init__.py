from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_object='app.config'):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # تسجيل المسارات
    from app.routes import auth, products, sales, customers, reports
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(products.bp, url_prefix='/api/products')
    app.register_blueprint(sales.bp, url_prefix='/api/sales')
    app.register_blueprint(customers.bp, url_prefix='/api/customers')
    app.register_blueprint(reports.bp, url_prefix='/api/reports')

    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'ok',
            'store': app.config.get('STORE_NAME'),
            'currency': app.config.get('CURRENCY')
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'لم يتم العثور على الصفحة المطلوبة'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'خطأ داخلي في الخادم'}), 500

    return app