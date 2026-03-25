from django.apps import AppConfig
import os

class ParkingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'parking'

    def ready(self):
        # 確保只在主執行緒啟動一次鬧鐘（避免開發伺服器重複啟動）
        if os.environ.get('RUN_MAIN'):
            from . import updater
            updater.start()
