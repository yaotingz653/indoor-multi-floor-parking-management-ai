from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command

def release_spots():
    # 這裡就是在呼叫你剛剛寫好的 auto_release 保全指令！
    call_command('auto_release')

def start():
    scheduler = BackgroundScheduler()
    # 設定鬧鐘：每隔 1 分鐘，就自動執行一次 release_spots
    scheduler.add_job(release_spots, 'interval', minutes=15)
    scheduler.start()