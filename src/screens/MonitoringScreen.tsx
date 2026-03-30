import React, { useState, useEffect } from 'react';
import { Wifi, Loader2, X, Maximize2, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MonitoringScreen = () => {
  const [selectedCam, setSelectedCam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tick, setTick] = useState(0);

  // Simulate live feed by updating a "tick" every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cameras = [
    { id: 'providence_underground', name: '主顧樓地下停車場 - 入口', shortName: '主顧樓地下', seed: 'main-cam', type: 'MAIN' },
    { id: 'providence_outdoor', name: '主顧樓室外停車場 - 全景', shortName: '主顧樓室外', seed: 'cam2', type: 'SUB' },
    { id: 'gym_indoor', name: '體育館室內停車場 - 監控', shortName: '體育館', seed: 'cam3', type: 'SUB' },
  ];

  const currentCam = cameras[activeTab];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">即時監控監測</h2>
          <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest">Monitoring 3 Camera Sources</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Running</span>
        </div>
      </div>

      {/* Adjustable Tab Selector */}
      <div className="bg-slate-50/50 p-1.5 rounded-3xl border border-slate-100 flex gap-1">
        {cameras.map((cam, index) => (
          <button
            key={cam.id}
            onClick={() => setActiveTab(index)}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === index 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02] border-2 border-slate-900' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
          >
            {cam.shortName}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Main Stream (Adjustable based on activeTab) */}
        <motion.div 
          key={currentCam.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelectedCam(currentCam)}
          className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl relative group cursor-pointer"
        >
          <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
            <img 
              key={`main-${tick}`}
              src={`https://picsum.photos/seed/${currentCam.seed}-${tick}/800/600`} 
              alt="Main Stream" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">{currentCam.name}</span>
            </div>
            
            <div className="absolute top-4 right-4 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">MJPEG LIVE</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                <Maximize2 size={24} className="text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Streams (The ones not selected) */}
        <div className="grid grid-cols-2 gap-4">
          {cameras.filter((_, idx) => idx !== activeTab).map((cam) => (
            <div 
              key={cam.id} 
              onClick={() => setSelectedCam(cam)}
              className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm transition-all cursor-pointer hover:border-slate-300 group"
            >
              <div className="relative aspect-video bg-slate-900">
                <img 
                  key={`${cam.id}-${tick}`}
                  src={`https://picsum.photos/seed/${cam.seed}-${tick}/600/400`} 
                  alt={cam.name} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-700"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <Wifi size={10} className="text-emerald-400" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-widest truncate max-w-[80px]">{cam.shortName}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Live Modal */}
      <AnimatePresence>
        {selectedCam && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCam(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 z-[160] flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="w-full max-w-2xl bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl pointer-events-auto">
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    <h3 className="text-white font-black uppercase tracking-widest text-sm">{selectedCam.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedCam(null)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img 
                    key={`modal-${selectedCam.id}-${tick}`}
                    src={`https://picsum.photos/seed/${selectedCam.seed}-${tick}/1280/720`} 
                    alt="Live Stream" 
                    className="w-full h-full object-contain"
                  />
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                  
                  <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Radio size={12} className="text-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE 1080P</span>
                  </div>

                  <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 space-y-1">
                    <p>CAM_ID: {selectedCam.id.toUpperCase()}</p>
                    <p>TIMESTAMP: {new Date().toISOString()}</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">FPS</p>
                      <p className="text-white font-mono text-xs">{(29 + Math.random()).toFixed(1)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">BITRATE</p>
                      <p className="text-white font-mono text-xs">{(4 + Math.random()).toFixed(1)} Mbps</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                    錄影存檔
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonitoringScreen;
