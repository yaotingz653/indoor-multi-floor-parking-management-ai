from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Floor, AnomalyEvent, ParkingRecord

/**
 * Django REST Framework Views 範例
 * 用於對接前端管理者 App
 */

class DashboardDataView(APIView):
    """
    GET /api/dashboard/
    回傳完整儀表板數據，包含系統狀態、樓層資訊與最新警報
    """
    def get(self, request):
        # 1. 取得樓層數據
        floors = Floor.objects.all()
        floor_list = []
        for f in floors:
            floor_list.append({
                "id": f.id,
                "floorName": f.level_name,
                "availableSpots": f.remaining_spots,
                "totalSpots": f.total_spots,
                "totalRevenue": float(f.current_revenue),
                "statusLabel": "BUSY" if f.remaining_spots < 5 else "NORMAL"
            })
            
        # 2. 取得最新一筆未處理警報
        latest_alert = AnomalyEvent.objects.filter(status='pending').order_by('-created_at').first()
        alert_data = None
        if latest_alert:
            alert_data = {
                "id": latest_alert.id,
                "type": latest_alert.event_type,
                "title": latest_alert.get_event_type_display(),
                "message": latest_alert.description,
                "time": latest_alert.created_at.strftime("%H:%M"),
                "snapshotUrl": latest_alert.snapshot_url,
                "status": latest_alert.status
            }
            
        # 3. 組合回傳結構 (對應前端 mockData.js)
        return Response({
            "systemStatus": {
                "isConnected": True,
                "lastSync": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
                "managerName": request.user.get_full_name() or "管理員",
                "managerRole": "Senior Facility Manager"
            },
            "floors": floor_list,
            "latestAlert": alert_data,
            "chatLogs": [] # 這裡可串接即時客服資料庫
        })

class RemoteControlView(APIView):
    """
    POST /api/gate/control/
    執行遠端控制指令
    """
    def post(self, request):
        action = request.data.get("action") # e.g., "open_gate"
        floor_id = request.data.get("floor_id")
        
        if action == "open_gate":
            # 執行硬體控制邏輯 (例如發送 MQTT 指令)
            # hardware_service.open_gate(floor_id)
            
            # 記錄操作日誌
            # Log.objects.create(user=request.user, action="遠端開啟閘門", target=floor_id)
            
            return Response({
                "status": "success",
                "message": f"已成功發送開門指令至 {floor_id}"
            })
            
        return Response({
            "status": "error",
            "message": "無效的指令"
        }, status=status.HTTP_400_BAD_REQUEST)
