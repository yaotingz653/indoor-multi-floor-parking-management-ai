import React from 'react';
import { Search, MoreVertical } from 'lucide-react';

const EventLogsScreen = () => {
  const logs = [
    { time: '下午2:51:34', plate: 'ABC-1234', reason: '違規停放於消防通道', floor: 'B1 樓層', status: '待審核' },
    { time: '下午2:47:34', plate: 'TPE-6094', reason: '違規停放於消防通道', floor: 'B1 樓層', status: '待審核' },
    { time: '下午2:15:34', plate: 'ABC-1234', reason: '違規停放於消防通道', floor: 'B1 樓層', status: '待審核' },
    { time: '下午2:11:34', plate: 'TPE-4031', reason: '違規停放於消防通道', floor: 'B1 樓層', status: '待審核' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">事件紀錄日誌</h2>
        <p className="text-slate-500 text-[10px] font-medium mt-1 uppercase tracking-widest">AI Anomaly Recognition Logs</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input 
          type="text" 
          placeholder="搜尋車牌或原因..."
          className="w-full bg-[#161B22] border border-[#30363D] rounded-2xl py-3 pl-12 pr-4 text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {['全部', '待審核', '已通知', '已排除'].map((tab, i) => (
          <button 
            key={tab}
            className={`whitespace-nowrap pb-2 text-[10px] font-black uppercase tracking-widest transition-all px-1 ${
              i === 0 ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-[2rem] p-6 shadow-sm group active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-xl text-xs font-black text-white">
                  {log.plate}
                </span>
                <span className="text-[10px] font-bold text-slate-500">{log.time}</span>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <p className="text-sm font-bold text-white mb-2">{log.reason}</p>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.floor}</p>
              <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                {log.status}
              </span>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">確認</button>
              <button className="flex-1 py-2.5 bg-[#0D1117] text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-[#30363D]">忽略</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLogsScreen;
