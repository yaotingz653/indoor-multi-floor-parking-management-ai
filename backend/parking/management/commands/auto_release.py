from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from parking.models import ParkingSpot

class Command(BaseCommand):
    help = '巡邏停車場，自動釋放預約超過 15 分鐘的車位'

    def handle(self, *args, **kwargs):
        # 1. 取得現在的時間
        now = timezone.now()
        
        # 2. 算出一條「15 分鐘前」的死線 (Deadline)
        deadline = now - timedelta(minutes=15)
        
        # 3. 從資料庫抓出：狀態是 'reserved' (預約) 且 預約時間比死線還早 (超時) 的車位
        expired_spots = ParkingSpot.objects.filter(status='reserved', reserved_at__lt=deadline)
        
        count = 0
        for spot in expired_spots:
            # 4. 對這些超時的車位開鍘：改回空位、清空車牌、清空時間
            spot.status = 'available'
            spot.current_plate = None
            spot.reserved_at = None
            spot.save()
            count += 1
            self.stdout.write(self.style.SUCCESS(f"已自動釋放車位：{spot.spot_code}"))

        if count == 0:
            self.stdout.write("目前沒有超時的預約車位。")
        else:
            self.stdout.write(self.style.SUCCESS(f"巡邏完畢！共釋放了 {count} 個車位。"))