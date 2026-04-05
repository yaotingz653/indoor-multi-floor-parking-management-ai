from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import ParkingSpot

@csrf_exempt  # 這是安全通行證，讓外部的 AI 鏡頭可以順利把資料傳進來
def update_spot_status(request):
    if request.method == 'POST':
        try:
            # 1. 讀取 AI 鏡頭傳過來的資料（JSON 格式）
            data = json.loads(request.body)
            spot_code = data.get('spot_code')       # 例如：'A1'
            license_plate = data.get('license_plate') # 例如：'ABC-1234'
            action = data.get('action')             # 動作：'enter'(進場) 或 'leave'(離場)

            # 2. 去資料庫找出對應的車位
            spot = ParkingSpot.objects.get(spot_code=spot_code)

            # 3. 根據動作更新車位狀態
            if action == 'enter':
                spot.status = 'occupied'
                spot.current_plate = license_plate
                message = f"成功！車輛 {license_plate} 已停入 {spot_code} 車位"
            elif action == 'leave':
                spot.status = 'available'
                spot.current_plate = None
                message = f"成功！{spot_code} 車位已清空"
            else:
                return JsonResponse({'status': 'error', 'message': '未知的動作'})

            # 4. 把修改好的結果「存檔」進真實資料庫！
            spot.save()

            # 5. 回傳成功訊息給 AI 鏡頭
            return JsonResponse({'status': 'success', 'message': message})

        except ParkingSpot.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': '在資料庫找不到這個車位！'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'發生錯誤：{str(e)}'}, status=400)

    return JsonResponse({'status': 'error', 'message': '請使用 POST 方法'})

def get_dashboard_data(request):
    # 這是我們從後端傳給前端的真實測試資料！
    return JsonResponse({
        "message": "🎉 老闆！前端和後端正式連線成功啦！",
        "status": "success"
    })

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ParkingSpot

@csrf_exempt
def manual_update_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            target_spot_code = data.get('spot_code')
            new_status = data.get('status') # 🌟 新增：讀取前端傳來的「目標狀態」

            if not target_spot_code:
                return JsonResponse({'status': 'error', 'message': '未提供車位編號'}, status=400, json_dumps_params={'ensure_ascii': False})
            if not new_status:
                return JsonResponse({'status': 'error', 'message': '未提供目標狀態 (status)'}, status=400, json_dumps_params={'ensure_ascii': False})

            # 去資料庫把那個車位找出來
            spot = ParkingSpot.objects.get(spot_code=target_spot_code)
            
            # 🌟 把原本寫死的 'occupied' 換成前端指定的 new_status
            spot.status = new_status
            spot.save()

            # 讓回傳訊息變聰明：自動判斷中文
            status_tw = "占用" if new_status == "occupied" else "空閒"

            return JsonResponse({
                'status': 'success',
                'message': f'✅ 成功！車位 {target_spot_code} 已更改為【{status_tw}】狀態。'
            }, json_dumps_params={'ensure_ascii': False})

        except ParkingSpot.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': f'找不到車位：{target_spot_code}'}, status=404, json_dumps_params={'ensure_ascii': False})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'發生錯誤：{str(e)}'}, status=500, json_dumps_params={'ensure_ascii': False})
            
    return JsonResponse({'status': 'error', 'message': '請使用 POST 方法呼叫此 API'}, status=405, json_dumps_params={'ensure_ascii': False})