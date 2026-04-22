import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  Settings as SettingsIcon,
  Bell,
  Smartphone,
  Clock,
  Monitor,
  ListTodo,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

import { mockData } from './data/mockData';

// 導入頁面組件
import HomeScreen from './screens/HomeScreen';
import AlertScreen from './screens/AlertScreen';
import MonitoringScreen from './screens/MonitoringScreen';
import SettingsScreen from './screens/SettingsScreen';
import SpotMonitoringScreen from './screens/SpotMonitoringScreen';
import LoginScreen from './screens/LoginScreen';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * 全局 Toast 組件
 */
const Toast = ({ message, visible }: { message: string, visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
      >
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        <span className="text-sm font-bold">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * 對話介入 Modal
 */
const ChatModal = ({ isOpen, onClose, chatHistory }: { isOpen: boolean, onClose: () => void, chatHistory: any[] }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages(chatHistory);
    }
  }, [isOpen, chatHistory]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      user: "管理員",
      message: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `你現在是一個專業的停車場客服機器人。
        背景：這是一個三層樓的智慧停車場。
        對話歷史：${messages.map(m => `${m.user}: ${m.message}`).join('\n')}
        用戶剛才說：${inputValue}
        請以親切、專業的語氣回覆。`,
      });

      const aiMsg = {
        id: Date.now() + 1,
        user: "AI 語音客服",
        message: response.text || "抱歉，我現在無法處理您的請求。",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[120] flex flex-col h-[80vh] shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900">人工介入對話</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chatting with ABC-1234</p>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
              {messages.map((chat: any, idx: number) => (
                <div key={idx} className={`flex flex-col ${chat.isAI ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1 px-2">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{chat.user}</span>
                    <span className="text-[8px] text-slate-300">{chat.time}</span>
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                    chat.isAI 
                    ? 'bg-white text-slate-600 rounded-tl-none border border-slate-100' 
                    : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}>
                    {chat.message}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 px-4">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div className="flex justify-center py-4">
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                  人工模式已啟動
                </span>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="輸入訊息..."
                  className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  <Smartphone size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

const MobileHeader = ({ time, title, managerInfo, onNotificationClick }: { time: Date, title: string, managerInfo?: any, onNotificationClick: () => void }) => (
  <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-50">
    <div className="flex justify-between items-center">
      <div>
        {managerInfo ? (
          <>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{managerInfo.managerName}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{managerInfo.managerRole}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unmanned Facility Control</p>
          </>
        )}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onNotificationClick}
          className="p-3 bg-slate-50 text-slate-500 rounded-2xl relative border border-slate-100 hover:bg-slate-100 transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Smartphone size={24} />
        </div>
      </div>
    </div>
    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      {time.toLocaleTimeString('zh-TW')} • 系統連線正常
    </div>
  </div>
);

/**
 * 通知中心 Modal
 */
const NotificationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const notifications = [
    { id: 1, title: '違規佔用警報', message: 'B1 樓層消防通道偵測到異常佔用', time: '12:40', type: 'alert' },
    { id: 2, title: '系統更新', message: 'AI 辨識引擎已更新至 v2.4.1', time: '10:15', type: 'info' },
    { id: 3, title: '預約提醒', message: '修院停車場 A12 車位預約將於 30 分鐘後開始', time: '09:30', type: 'info' },
  ];

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-[120] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">通知中心</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${n.type === 'alert' ? 'text-rose-500' : 'text-indigo-600'}`}>
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                全部標記為已讀
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [time, setTime] = useState(new Date());
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const managerInfo = {
    managerName: mockData.systemStatus.managerName,
    managerRole: mockData.systemStatus.managerRole
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2000);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return 'Manager Pro';
      case 'monitoring': return '即時監控';
      case 'spots': return '車位監測';
      case 'logs': return '警報紀錄';
      case 'settings': return '系統設定';
      default: return 'Manager Pro';
    }
  };

  return (
    <div className="h-screen bg-[#FDFDFD] max-w-md mx-auto shadow-2xl flex flex-col font-sans border-x border-slate-100 relative overflow-hidden text-slate-900">
      {/* 頂部 Header */}
      <MobileHeader 
        time={time} 
        title={getTitle()} 
        managerInfo={activeTab === 'home' ? managerInfo : undefined} 
        onNotificationClick={() => setIsNotificationOpen(true)}
      />

      {/* 內容區域 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'home' && <HomeScreen onAction={showToast} />}
          {activeTab === 'monitoring' && <MonitoringScreen />}
          {activeTab === 'spots' && <SpotMonitoringScreen />}
          {activeTab === 'logs' && <AlertScreen onIntervene={() => setIsChatModalOpen(true)} />}
          {activeTab === 'settings' && <SettingsScreen onLogout={() => setIsLoggedIn(false)} />}
        </motion.div>
      </div>

      {/* 底部導航欄 */}
      <nav className="h-24 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 z-50 sticky bottom-0">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">首頁</span>
        </button>
        <button 
          onClick={() => setActiveTab('monitoring')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'monitoring' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Monitor size={24} />
          <span className="text-[10px] font-bold">監控</span>
        </button>
        <button 
          onClick={() => setActiveTab('spots')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'spots' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Activity size={24} />
          <span className="text-[10px] font-bold">車位</span>
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'logs' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ShieldAlert size={24} />
          <span className="text-[10px] font-bold">紀錄</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <SettingsIcon size={24} />
          <span className="text-[10px] font-bold">設定</span>
        </button>
      </nav>

      {/* 全局組件 */}
      <Toast message={toast.message} visible={toast.visible} />
      <ChatModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
        chatHistory={mockData.chatLogs}
      />
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
}
