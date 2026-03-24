import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search,
  ChevronRight,
  Radio,
  TrendingUp,
  X,
  Clock,
  ShieldAlert,
  Timer,
  Navigation,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mockData } from '../data/mockData';

/**
 * 樓層詳細數據 Modal
 */
const FloorDetailModal = ({ isOpen, onClose, floor, onAction }: { isOpen: boolean, onClose: () => void, floor: any, onAction: (msg: string) => void }) => {
  if (!floor) return null;

  const trendData = mockData.trends.map(t => ({
    time: t.time,
    occupancy: (t as any)[floor.id]
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[120] flex flex-col h-[85vh] shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${floor.color}`} />
                <div>
                  <h3 className="text-xl font-black text-slate-900">{floor.floorName} 詳細數據</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Analytics</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {/* 核心指標 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">尖峰時段</span>
                  </div>
                  <p className="text-lg font-black text-slate-900">12:00 - 14:00</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Timer size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">平均停放</span>
                  </div>
                  <p className="text-lg font-black text-slate-900">2.4 小時</p>
                </div>
              </div>

              {/* 佔用趨勢圖 */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">今日佔用率趨勢 (%)</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={floor.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={floor.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}}
                      />
                      <YAxis 
                        hide 
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="occupancy" 
                        stroke={floor.color} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorOccupancy)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* 預約按鈕 */}
              <section>
                <button 
                  onClick={() => onAction(`已預約 ${floor.floorName} 車位`)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                >
                  <Calendar size={20} /> 立即預約車位
                </button>
              </section>

              {/* 最近異常 */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">本樓層最近異常</h4>
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                        <ShieldAlert size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">違規佔用偵測</p>
                        <p className="text-[10px] text-slate-400 font-medium">區域 A-{10+i} • 1小時前</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-slate-200"
              >
                關閉視窗
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * 首頁 - Providence University Map Dashboard
 */
const HomeScreen = ({ onAction }: { onAction: (msg: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleBroadcast = () => {
    onAction("已發送全校緊急廣播警告");
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">載入中...</div>;

  const filteredFloors = data?.floors.filter((floor: any) => 
    floor.floorName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 pb-10">
      {/* 搜尋與標籤 */}
      <section className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋建築物或停車場..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['任垣樓', '主顧樓', '至善樓', '方濟樓', '體育館'].map((tag) => (
            <button 
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                searchQuery === tag 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 快速控制 */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">系統控制</h3>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleBroadcast}
            className="bg-slate-900 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all w-full"
          >
            <div className="p-3 bg-white/5 rounded-2xl">
              <Radio size={24} className="text-slate-400" />
            </div>
            <span className="text-sm font-black text-white">全校緊急廣播</span>
          </button>
        </div>
      </section>

      {/* 停車場即時數據 */}
      <section className="space-y-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">停車場即時數據</h3>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            校園系統運作中
          </span>
        </div>
        
        <div className="space-y-4">
          {filteredFloors.length > 0 ? (
            filteredFloors.map((floor: any) => (
              <div key={floor.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${floor.color}`} />
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-100">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">{floor.floorName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Campus Parking Facility</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    floor.statusLabel === 'BUSY' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {floor.statusLabel}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">剩餘車位</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{floor.availableSpots}</span>
                      <span className="text-xs font-bold text-slate-400">/ {floor.totalSpots}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">狀態</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-slate-900">運作正常</span>
                      <TrendingUp size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedFloor(floor)}
                  className="w-full mt-6 py-3 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:text-slate-600 transition-colors border border-slate-100"
                >
                  查看詳細數據 <ChevronRight size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-bold">找不到符合的停車場</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-indigo-600 text-sm font-black uppercase tracking-widest"
              >
                重設搜尋
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 詳細數據 Modal */}
      <FloorDetailModal 
        isOpen={!!selectedFloor} 
        onClose={() => setSelectedFloor(null)} 
        floor={selectedFloor} 
        onAction={onAction}
      />
    </div>
  );
};

export default HomeScreen;
