import React, { useState } from 'react';
import { 
  LogOut, 
  ChevronRight, 
  Shield, 
  Bell, 
  Smartphone, 
  Cpu, 
  Camera,
  Info,
  MessageSquare,
  Radio
} from 'lucide-react';

const SettingsScreen = ({ onLogout }: { onLogout: () => void }) => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    vibration: true,
    autoConfirm: true,
    blacklistDetection: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: '系統通知',
      items: [
        { icon: Bell, label: '推播通知', value: settings.pushNotifications ? '開啟' : '關閉', color: 'text-indigo-500', key: 'pushNotifications' },
        { icon: Smartphone, label: '震動回饋', value: settings.vibration ? '開啟' : '關閉', color: 'text-emerald-500', key: 'vibration' },
      ]
    },
    {
      title: 'AI 辨識邏輯',
      items: [
        { icon: Cpu, label: '自動確認異常', value: settings.autoConfirm ? '開啟' : '關閉', color: 'text-amber-500', key: 'autoConfirm' },
        { icon: Shield, label: '黑名單偵測', value: settings.blacklistDetection ? '開啟' : '關閉', color: 'text-rose-500', key: 'blacklistDetection' },
      ]
    },
    {
      title: 'AI 客服設定',
      items: [
        { icon: MessageSquare, label: '專門聊天機器人', value: 'Gemini 3.0 Flash', color: 'text-indigo-500', key: null },
        { icon: Radio, label: '語音回覆模式', value: '開啟', color: 'text-emerald-500', key: null },
      ]
    },
    {
      title: '硬體管理',
      items: [
        { icon: Camera, label: '攝影機狀態', value: '3 台在線', color: 'text-indigo-500', key: null },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">系統偏好設定</h2>
        <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest">Global System Configuration</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm">
        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 overflow-hidden">
          <img src="https://picsum.photos/seed/admin/200/200" alt="Admin" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-900">王小明</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">系統管理員 • ID: #9527</p>
        </div>
        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100">
          <Info size={20} />
        </button>
      </div>

      {/* Settings Sections */}
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{section.title}</h3>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            {section.items.map((item, i) => (
              <div 
                key={i}
                onClick={() => item.key && toggleSetting(item.key as any)}
                className={`flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer ${
                  i !== section.items.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 bg-slate-50 rounded-xl border border-slate-100 ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${item.value === '開啟' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {item.value}
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-full bg-rose-50 border border-rose-100 py-5 rounded-[2rem] flex items-center justify-center gap-3 text-rose-600 font-black uppercase tracking-widest active:scale-95 transition-all"
      >
        <LogOut size={20} /> 登出系統
      </button>

      <p className="text-center text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-10">
        Parking Guardian v2.4.0 • Build 20240222
      </p>
    </div>
  );
};

export default SettingsScreen;
