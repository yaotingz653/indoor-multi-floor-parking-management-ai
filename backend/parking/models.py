from django.db import models
from django.utils import timezone

class Floor(models.Model):
    """
    樓層表 (Floor): 管理 B1, B2, B3 樓層基本資訊與營收統計
    """
    level_name = models.CharField(max_length=10, verbose_name="樓層名稱") # 如 B1
    total_spots = models.IntegerField(verbose_name="總車位數")
    current_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="今日累計營收")
    
    def __str__(self):
        return self.level_name

    @property
    def remaining_spots(self):
        return self.total_spots - self.spots.filter(status='occupied').count()

class ParkingSpot(models.Model):
    def __str__(self):
        return f"{self.floor} - {self.spot_code} 車位"
    """
    車位表 (Parking Spot): 記錄具體車位狀態與 AI 偵測結果
    """
    STATUS_CHOICES = [
        ('available', '空閒'),
        ('occupied', '佔用'),
        ('reserved', '預約'),
        ('faulty', '故障'),
        ('violation', '違規佔用'),
    ]
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name='spots')
    spot_code = models.CharField(max_length=20, verbose_name="車格編號") # 如 B1-A01
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    last_detection_image = models.URLField(null=True, blank=True, verbose_name="最後偵測截圖")
    updated_at = models.DateTimeField(auto_now=True)
    current_plate = models.CharField(max_length=20, null=True, blank=True, verbose_name="目前停放/預約車牌")
    reserved_at = models.DateTimeField(null=True, blank=True, verbose_name="預約時間")
class ParkingRecord(models.Model):
    """
    進出與車輛特徵紀錄 (Parking Record): 記錄車牌、車色、車型等 AI 辨識特徵
    """
    license_plate = models.CharField(max_length=20, verbose_name="車牌號碼")
    vehicle_color = models.CharField(max_length=20, null=True, blank=True, verbose_name="車色")
    vehicle_type = models.CharField(max_length=50, null=True, blank=True, verbose_name="車型")
    entry_time = models.DateTimeField(default=timezone.now)
    exit_time = models.DateTimeField(null=True, blank=True)
    entry_gate_id = models.CharField(max_length=50, verbose_name="進場閘門ID")
    is_paid = models.BooleanField(default=False)
    total_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

class AnomalyEvent(models.Model):
    """
    異常事件表 (Anomaly Event): 記錄 AI 偵測到的異常（違規、煙霧、跌倒、斷線）
    """
    EVENT_TYPES = [
        ('violation', '違規佔用'),
        ('smoke', '煙霧偵測'),
        ('fall', '人員跌倒'),
        ('offline', '設備斷線'),
        ('blacklist', '黑名單車輛'),
    ]
    STATUS_CHOICES = [
        ('pending', '待處理'),
        ('processing', '處理中'),
        ('resolved', '已解決'),
        ('ignored', '已忽略'),
    ]
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    description = models.TextField(verbose_name="事件描述")
    snapshot_url = models.URLField(verbose_name="現場截圖路徑")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
