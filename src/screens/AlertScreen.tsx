import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  MessageSquare, 
  ChevronRight,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { mockData } from '../data/mockData';

/**
 * 警報頁 - Alerts (參考 image_2.png)
 */
const AlertScreen = ({ onIntervene }: { onIntervene: () => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // 模擬 API 請求
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleProcess = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      alert("警報已處理");
      setProcessingId(null);
    }, 1500);
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">載入中...</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* 異常事件卡片 */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">即時異常事件</h3>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">Critical Alert</span>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="relative aspect-[4/3] bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
              alt="Alert Snapshot" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#FF003D] text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
              <ShieldAlert size={14} /> 違規佔用警報
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-2xl font-black text-[#001B44] tracking-tight">B1 樓層 - 消防通道</h4>
                <p className="text-xs font-bold text-slate-400 mt-1">12:40 • 車牌 ABC-1234</p>
              </div>
              <button className="p-3 bg-[#F4F6FF] text-[#5842FF] rounded-2xl hover:bg-[#E8EBFF] transition-colors">
                <ExternalLink size={24} />
              </button>
            </div>
            
            <p className="text-base text-slate-500 font-medium leading-relaxed mb-8 mt-4">
              主顧樓地下停車場 A05 車位偵測到非預約車輛長時間佔用
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => handleProcess(data.latestAlert.id)}
                disabled={processingId === data.latestAlert.id}
                className="flex-[3] py-5 bg-[#5842FF] text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
              >
                {processingId === data.latestAlert.id ? "處理中..." : "確認並排除"}
              </button>
              <button className="flex-1 py-5 bg-[#F8F9FA] text-slate-400 rounded-[1.5rem] font-black text-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                忽略
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI 客服對話紀錄 */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI 客服對話紀錄</h3>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Chat</span>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
          <div className="space-y-6 mb-8">
            {data.chatLogs.map((chat: any, idx: number) => (
              <div key={idx} className={`flex flex-col ${chat.isAI ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400">{chat.user}</span>
                  <span className="text-[10px] text-slate-300">{chat.time}</span>
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${
                  chat.isAI 
                  ? 'bg-slate-50 text-slate-600 rounded-tl-none' 
                  : 'bg-indigo-50 text-indigo-700 rounded-tr-none'
                }`}>
                  {chat.message}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onIntervene}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <MessageSquare size={20} /> 介入人工對話
          </button>
        </div>
      </section>
    </div>
  );
};

export default AlertScreen;
