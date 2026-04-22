from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Floor, AnomalyEvent
from .serializers import FloorDashboardSerializer # 假設已定義序列化器

class DashboardAPIView(APIView):
    """
    GET /api/dashboard/
    App 首頁取得各樓層即時車位與營收數據
    """
    def get(self, request):
        floors = Floor.objects.all()
        data = []
        total_revenue = 0
        
        for floor in floors:
            floor_data = {
                "floor": floor.level_name,
                "total_spots": floor.total_spots,
                "remaining_spots": floor.remaining_spots,
                "revenue": floor.current_revenue,
                "status": "normal" if floor.remaining_spots > 5 else "busy"
            }
            data.append(floor_data)
            total_revenue += floor.current_revenue
            
        return Response({
            "total_revenue": total_revenue,
            "floors": data,
            "last_updated": timezone.now()
        })

class GateControlAPIView(APIView):
    """
    POST /api/gate/open/
    管理者遠端開門指令
    """
    def post(self, request):
        gate_id = request.data.get("gate_id")
        reason = request.data.get("reason", "管理者遠端開啟")
        
        if not gate_id:
            return Response({"error": "Missing gate_id"}, status=status.HTTP_400_BAD_REQUEST)
            
        # 這裡實作發送 MQTT 指令或與硬體控制服務對接的邏輯
        # send_mqtt_command(topic=f"gate/{gate_id}/control", payload="OPEN")
        
        # 記錄操作日誌
        print(f"Gate {gate_id} opened by manager. Reason: {reason}")
        
        return Response({
            "status": "success",
            "message": f"Gate {gate_id} command sent successfully",
            "timestamp": timezone.now()
        })

class AnomalyAlertAPIView(APIView):
    """
    GET /api/alerts/
    取得未處理的異常事件清單
    """
    def get(self, request):
        alerts = AnomalyEvent.objects.filter(status='pending').order_by('-created_at')
        # 這裡可以使用 Serializer 轉換資料
        return Response({
            "alerts": [
                {
                    "id": a.id,
                    "type": a.event_type,
                    "floor": a.floor.level_name,
                    "msg": a.description,
                    "img": a.snapshot_url,
                    "time": a.created_at
                } for a in alerts
            ]
        })
