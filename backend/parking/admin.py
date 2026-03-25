from django.contrib import admin
# 把 models.py 裡的所有重要資料表都引入
from .models import Floor, ParkingSpot, ParkingRecord, AnomalyEvent

# 註冊這些資料表，讓它們在後台顯示
admin.site.register(Floor)
admin.site.register(ParkingSpot)
admin.site.register(ParkingRecord)
admin.site.register(AnomalyEvent)
