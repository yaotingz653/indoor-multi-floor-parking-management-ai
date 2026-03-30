import React, { useState } from 'react';
import { Car, Info, X, Clock, MapPin, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockData } from '../data/mockData';

const SpotMonitoringScreen = () => {
  const [activeFloor, setActiveFloor] = useState('providence_underground');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  const stats = [
    { label: '總格位', value: 20, color: 'text-slate-900' },
    { label: '空位', value: mockData.floors.find(f => f.id === activeFloor)?.availableSpots || 0, color: 'text-emerald-500' },
    { label: '佔用', value: 20 - (mockData.floors.find(f => f.id === activeFloor)?.availableSpots || 0), color: 'text-rose-500' },
    { label: '率', value: `${Math.round(((20 - (mockData.floors.find(f => f.id === activeFloor)?.availableSpots || 0)) / 20) * 100)}%`, color: 'text-indigo-600' },
  ];

  // Map spots based on parkingRecords
  const spots = Array.from({ length: 20 }, (_, i) => {
    const spotId = `${activeFloor}-${String(i + 1).padStart(2, '0')}`;
    const record = (mockData as any).parkingRecords.find((r: any) => r.spotId === spotId && r.status === 'parked');
    
    return {
      id: spotId,
      status: record ? 'occupied' : 'free',
      plate: record ? record.plate : 'FREE',
      updated: record ? record.entryTime.split(' ')[1].substring(0, 5) : '---',
      record: record
    };
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-center items-center">
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto no-scrollbar">
          {mockData.floors.map(floor => (
            <button
              key={floor.id}
              onClick={() => setActiveFloor(floor.id)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                activeFloor === floor.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {floor.floorName.replace('停車場', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Spots Grid - Mobile 3 columns */}
      <div className="grid grid-cols-3 gap-3">
        {spots.map((spot) => (
          <motion.div 
            key={spot.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => spot.status === 'occupied' && setSelectedSpot(spot)}
            className={`bg-white border rounded-2xl p-3 flex flex-col items-center justify-center transition-all shadow-sm cursor-pointer ${
              spot.status === 'occupied' 
              ? 'border-rose-100 bg-rose-50/30' 
              : 'border-emerald-100 bg-emerald-50/30'
            }`}
          >
            <span className="text-[8px] font-bold text-slate-400 mb-2">{spot.id.split('-')[1]}</span>
            <Car size={20} className={spot.status === 'occupied' ? 'text-rose-500' : 'text-emerald-500 opacity-20'} />
            <p className={`text-[10px] font-black mt-2 ${spot.status === 'occupied' ? 'text-slate-900' : 'text-emerald-600'}`}>
              {spot.plate}
            </p>
            <p className="text-[6px] font-bold text-slate-400 mt-1 uppercase">{spot.updated}</p>
          </motion.div>
        ))}
      </div>

      {/* Spot Detail Modal */}
      <AnimatePresence>
        {selectedSpot && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpot(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[120] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">車位詳細資訊</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI LPR Recognition Record</p>
                </div>
                <button onClick={() => setSelectedSpot(null)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl">
                    <Hash size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">辨識車牌</p>
                    <p className="text-xl font-black text-slate-900">{selectedSpot.plate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <MapPin size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">位置</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{selectedSpot.id}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">入場時間</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{selectedSpot.updated}</p>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-emerald-700">AI 辨識狀態：準確</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">99.8% Conf.</span>
                </div>

                <button 
                  onClick={() => setSelectedSpot(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-slate-200 mt-4"
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpotMonitoringScreen;
