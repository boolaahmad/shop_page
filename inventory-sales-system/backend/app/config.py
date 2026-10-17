import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-me'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret-change-me'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///inventory.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # إعدادات المتجر
    STORE_NAME = os.environ.get('STORE_NAME', 'بصمة للسوفت وير')
    CURRENCY = os.environ.get('CURRENCY', 'EGP')
    TAX_RATE = float(os.environ.get('TAX_RATE', 0.14))  # ضريبة القيمة المضافة المصرية
    TRIAL_DAYS = int(os.environ.get('TRIAL_DAYS', 60))  # 기간 التجربة المجانية


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}