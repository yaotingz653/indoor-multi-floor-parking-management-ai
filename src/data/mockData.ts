/**
 * 模擬後端回傳的 JSON 數據結構
 * 符合 Django API 預期回傳格式
 */
export const mockData = {
  systemStatus: {
    isConnected: true,
    lastSync: "2024-02-23 12:45:30",
    managerName: "王小明",
    managerRole: "Senior Facility Manager"
  },
  floors: [
    {
      id: "providence_underground",
      floorName: "主顧樓地下停車場",
      availableSpots: 8,
      totalSpots: 20,
      totalRevenue: 1200,
      statusLabel: "NORMAL",
      color: "#4f46e5"
    },
    {
      id: "providence_outdoor",
      floorName: "主顧樓室外停車場",
      availableSpots: 12,
      totalSpots: 20,
      totalRevenue: 800,
      statusLabel: "AVAILABLE",
      color: "#10b981"
    },
    {
      id: "gym_indoor",
      floorName: "體育館室內停車場",
      availableSpots: 5,
      totalSpots: 20,
      totalRevenue: 1500,
      statusLabel: "BUSY",
      color: "#f59e0b"
    }
  ],
  buildings: [
    { id: 'anthony', name: '任垣樓', enName: 'Anthony Kuo Hall', x: 750, y: 700 },
    { id: 'providence', name: '主顧樓', enName: 'Providence Hall', x: 650, y: 200 },
    { id: 'zhishan', name: '至善樓', enName: 'Zhi Shan Hall', x: 350, y: 650 },
    { id: 'st_francis', name: '方濟樓', enName: 'St. Francis Hall', x: 450, y: 180 },
    { id: 'luking', name: '蓋夏圖書館', enName: 'Luking Library', x: 680, y: 500 },
    { id: 'stadium', name: '綜合運動場', enName: 'Stadium', x: 350, y: 850 },
    { id: 'convent', name: '修院', enName: 'Providence Convent', x: 400, y: 350 },
    { id: 'bishop', name: '文興樓', enName: 'Bishop Kupfer Hall', x: 540, y: 500 },
    { id: 'siyuan', name: '思源樓', enName: 'Si Yuan Hall', x: 560, y: 360 },
    { id: 'st_peter', name: '伯鐸樓', enName: 'St. Peter Hall', x: 710, y: 620 },
  ],
  parkingLots: [
    { id: 'p_providence_outdoor', name: '主顧樓室外', x: 610, y: 160, floorId: 'providence_outdoor' },
    { id: 'p_providence_indoor', name: '主顧樓室內', x: 680, y: 160, floorId: 'providence_underground' },
    { id: 'p_gym', name: '體育館', x: 300, y: 800, floorId: 'gym_indoor' },
  ],
  paths: [
    { from: 'st_francis', to: 'providence' },
    { from: 'providence', to: 'siyuan' },
    { from: 'siyuan', to: 'bishop' },
    { from: 'bishop', to: 'luking' },
    { from: 'luking', to: 'st_peter' },
    { from: 'st_peter', to: 'anthony' },
    { from: 'bishop', to: 'zhishan' },
    { from: 'zhishan', to: 'stadium' },
    { from: 'providence', to: 'p_providence_outdoor' },
    { from: 'providence', to: 'p_providence_indoor' },
  ],
  trends: [
    { time: "08:00", providence_underground: 40, providence_outdoor: 20, gym_indoor: 10 },
    { time: "10:00", providence_underground: 85, providence_outdoor: 45, gym_indoor: 25 },
    { time: "12:00", providence_underground: 95, providence_outdoor: 70, gym_indoor: 40 },
    { time: "14:00", providence_underground: 90, providence_outdoor: 85, gym_indoor: 55 },
    { time: "16:00", providence_underground: 70, providence_outdoor: 60, gym_indoor: 45 },
    { time: "18:00", providence_underground: 50, providence_outdoor: 40, gym_indoor: 30 },
    { time: "20:00", providence_underground: 30, providence_outdoor: 20, gym_indoor: 15 },
  ],
  latestAlert: {
    id: "AL-992",
    type: "violation",
    title: "違規佔用警報",
    message: "主顧樓地下停車場 A05 車位偵測到非預約車輛長時間佔用",
    time: "12:40",
    snapshotUrl: "https://picsum.photos/seed/violation/400/300",
    status: "pending"
  },
  parkingRecords: [
    { id: "REC-001", floorId: "providence_underground", spotId: "providence_underground-01", plate: "ABC-1234", entryTime: "2024-02-23 08:30:00", exitTime: null, status: "parked" },
    { id: "REC-002", floorId: "providence_underground", spotId: "providence_underground-02", plate: "XYZ-5678", entryTime: "2024-02-23 09:15:00", exitTime: null, status: "parked" },
    { id: "REC-003", floorId: "providence_outdoor", spotId: "providence_outdoor-05", plate: "KFC-9999", entryTime: "2024-02-23 10:00:00", exitTime: "2024-02-23 12:00:00", status: "completed" },
    { id: "REC-004", floorId: "gym_indoor", spotId: "gym_indoor-05", plate: "LPR-8888", entryTime: "2024-02-23 11:30:00", exitTime: null, status: "parked" },
  ],
  chatLogs: [
    {
      id: 1,
      user: "車主 ABC-1234",
      message: "你好，我已經繳費了但是閘門沒有開啟。",
      time: "12:30",
      isAI: false
    },
    {
      id: 2,
      user: "AI 語音客服",
      message: "正在為您查詢繳費紀錄，請稍候... 系統顯示您的車牌為 ABC-1234，確有繳費紀錄。請稍候，我將嘗試為您遠端開啟閘門。",
      time: "12:31",
      isAI: true
    }
  ]
};
