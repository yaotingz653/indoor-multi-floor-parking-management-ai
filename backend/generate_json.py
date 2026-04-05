import json

# 設定陣列大小
rows = 24  # 長度 (y)
cols = 23  # 寬度 (x)

grid = []
spot_count = 0

# 迴圈生成 24x23 的格子
for y in range(rows):
    row_data = []
    # y 軸對應英文字母排數 (0=A排, 1=B排 ... 23=X排)
    row_char = chr(65 + y) 
    
    for x in range(cols):
        # 簡單模擬一下：假設每 5 欄就會有一條直的車道 (為了避開全是車位)
        if x % 5 == 4:
            cell = { "x": x, "y": y, "type": "road", "id": None, "status": None }
        else:
            # 建立有效車位，例如 A-01, A-02
            spot_id = f"{row_char}-{x+1:02d}"
            cell = { "x": x, "y": y, "type": "spot", "id": spot_id, "status": "empty" }
            spot_count += 1
            
        row_data.append(cell)
    grid.append(row_data)

# 組合出跟組員 B 一模一樣的 JSON 格式
data = {
    "lotId": "Motor-Lot-01",
    "dimensions": {
        "length": rows,
        "width": cols
    },
    "description": f"自動生成的 24x23 陣列，總計 {spot_count} 個車位",
    "grid": grid
}

# 寫入成 JSON 檔案
with open('parking-map.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ 魔法施放完畢！成功生成 parking-map.json 檔案！")
print(f"總共 {rows * cols} 個格子，其中有 {spot_count} 個有效車位。")