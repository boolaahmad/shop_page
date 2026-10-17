from app import create_app, db
from app.models import User, Category, Product, Customer, Setting
from datetime import datetime, timedelta
import os

app = create_app(os.environ.get('FLASK_CONFIG') or 'default')


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Category=Category, Product=Product,
                Customer=Customer, Setting=Setting)


@app.cli.command('init-db')
def init_db_command():
    """إنشاء قاعدة البيانات وإضافة بيانات أولية"""
    db.create_all()

    # إضافة مستخدم افتراضي (مدير)
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@basma-software.com',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)

    # إضافة تصنيفات افتراضية
    default_categories = [
        'أدوات منزلية',
        'مواد غذائية',
        'مشروبات',
        'أدوات مكتبية',
        'إلكترونيات',
        'أدوات صحية'
    ]
    for cat_name in default_categories:
        if not Category.query.filter_by(name=cat_name).first():
            db.session.add(Category(name=cat_name))

    # إضافة إعدادات المتجر
    if not Setting.query.first():
        setting = Setting(
            store_name=app.config.get('STORE_NAME', 'بصمة للسوفت وير'),
            tax_rate=app.config.get('TAX_RATE', 0.14),
            currency=app.config.get('CURRENCY', 'EGP'),
            trial_end_date=datetime.utcnow() + timedelta(days=app.config.get('TRIAL_DAYS', 60))
        )
        db.session.add(setting)

    db.session.commit()
    print('تم إنشاء قاعدة البيانات والبيانات الأولية بنجاح!')
    print('بيانات الدخول الافتراضية: admin / admin123')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=app.config.get('DEBUG', True))