import React, { useState, useEffect } from 'react';
import { Camera, Activity, Cpu, ShieldAlert, Video, Settings, Users, Car, Menu, Bell, Search, Zap, Target, Server, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// ======================================
// TypeScript Interfaces
// ======================================

interface DetectionLog {
  id: number;
  type: string;
  confidence: number;
  location: string;
  time: string;
  alert: boolean;
}

interface SystemStats {
  fps: string;
  gpuLoad: number;
  memoryUsage: string;
}

interface PerformanceData {
  time: string;
  fps: number;
}

interface SSEData {
  fps: string;
  gpuLoad: number;
  memoryUsage: string;
  newDetection?: DetectionLog;
}

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ size?: number }>;
  trend: string;
  color: string;
  bg: string;
}

interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

// ======================================
// Constants
// ======================================

const API_BASE_URL = 'http://localhost:5000';
const SSE_ENDPOINT = `${API_BASE_URL}/api/stream`;
const VIDEO_FEED_URL = `${API_BASE_URL}/video_feed`;
const MAX_LOGS = 50;

// ======================================
// Helper Functions
// ======================================

const generateInitialPerformanceData = (): PerformanceData[] => {
  const data: PerformanceData[] = [];
  for (let i = 0; i < 20; i++) {
    data.push({ time: `-${20 - i}s`, fps: 32 });
  }
  return data;
};

// ======================================
// Main App Component
// ======================================

export default function App() {
  // ======================================
  // State Management
  // ======================================
  const [perfData, setPerfData] = useState<PerformanceData[]>(generateInitialPerformanceData());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [logs, setLogs] = useState<DetectionLog[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    fps: '32.0',
    gpuLoad: 78,
    memoryUsage: '4.2'
  });

  // ======================================
  // API Functions
  // ======================================

  const fetchLogs = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const triggerDetection = async (type: string, alert = false): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          location: 'Manual Trigger', 
          alert 
        })
      });
    } catch (err) {
      console.error('Failed to trigger:', err);
    }
  };

  const clearLogs = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/logs`, { method: 'DELETE' });
      setLogs([]);
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  // ======================================
  // Effects
  // ======================================

  // Fetch initial logs
  useEffect(() => {
    fetchLogs();
  }, []);

  // Connect to SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource(SSE_ENDPOINT);

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data: SSEData = JSON.parse(event.data);
        
        // Update system stats
        setSystemStats({
          fps: data.fps,
          gpuLoad: data.gpuLoad,
          memoryUsage: data.memoryUsage
        });

        // Update chart data
        setPerfData(prev => {
          const newData = [...prev.slice(1)];
          newData.push({ time: 'Now', fps: parseFloat(data.fps) });
          return newData;
        });

        // Add new detection log if exists
        if (data.newDetection) {
          setLogs(prev => [data.newDetection!, ...prev].slice(0, MAX_LOGS));
        }
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // ======================================
  // Computed Values
  // ======================================
  const totalDetections = logs.length;
  const recentAlerts = logs.filter(l => l.alert).length;

  // ======================================
  // Navigation Items
  // ======================================
  const navItems: NavItem[] = [
    { id: 'dashboard', icon: Activity, label: 'Live Dashboard' },
    { id: 'cameras', icon: Video, label: 'Camera Feeds' },
    { id: 'events', icon: Bell, label: 'Event Logs' },
    { id: 'nodes', icon: Server, label: 'Edge Nodes' },
    { id: 'settings', icon: Settings, label: 'System Config' },
  ];

  // ======================================
  // Render
  // ======================================

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-emerald-500/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight">Edge-AI</h1>
            <p className="text-xs text-gray-500 font-mono">v2.4.1-YOLOv8</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-emerald-400' : ''} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">System Status</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TensorRT</span>
                <span className="text-emerald-400 font-mono">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GPU Load</span>
                <span className="text-white font-mono">{systemStats.gpuLoad}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Demo Controls</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => triggerDetection('Person')}
                className="px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 transition-colors"
              >
                + Person
              </button>
              <button 
                onClick={() => triggerDetection('Vehicle', true)}
                className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20 transition-colors"
              >
                + Alert
              </button>
            </div>
            <button 
              onClick={clearLogs}
              className="w-full mt-2 px-2 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold rounded-lg border border-white/10 transition-colors"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#111111]/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Live Monitoring</h2>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Target size={14} /> YOLOv8 Optimized
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-white placeholder-gray-500 w-64"
              />
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
              <Bell size={16} />
              {recentAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111111]"></span>
              )}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Project Overview Banner */}
            <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold text-white mb-2">Edge-AI Smart Security</h3>
              <p className="text-gray-400 max-w-3xl text-sm leading-relaxed">
                Hệ thống phát hiện và theo dõi đối tượng (người, xe cộ) thời gian thực. 
                Sử dụng <span className="text-emerald-400 font-medium">YOLOv8</span> tối ưu cho thiết bị biên, 
                xử lý luồng video qua <span className="text-blue-400 font-medium">OpenCV</span>, và tăng tốc bằng <span className="text-purple-400 font-medium">TensorRT</span>.
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Processing Speed" 
                value={systemStats.fps} 
                unit="FPS" 
                icon={Zap} 
                trend="Live" 
                color="text-emerald-400"
                bg="bg-emerald-400/10"
              />
              <MetricCard 
                title="Model Accuracy" 
                value="0.92" 
                unit="mAP" 
                icon={Target} 
                trend="Stable" 
                color="text-blue-400"
                bg="bg-blue-400/10"
              />
              <MetricCard 
                title="Active Streams" 
                value="4" 
                unit="/ 4" 
                icon={Camera} 
                trend="100%" 
                color="text-purple-400"
                bg="bg-purple-400/10"
              />
              <MetricCard 
                title="Total Detections" 
                value={totalDetections.toString()} 
                unit="Recent" 
                icon={Users} 
                trend="Syncing" 
                color="text-orange-400"
                bg="bg-orange-400/10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Feed */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-white">Cam 01 - Main Gate</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono text-gray-400 uppercase tracking-wider">1080p</span>
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">{systemStats.fps} FPS</span>
                    </div>
                  </div>
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {/* Real Live Video Feed from YOLO Backend */}
                    <img 
                      src={VIDEO_FEED_URL}
                      alt="Live Edge-AI Stream" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const parent = target.parentElement;
                        if (parent) {
                          target.style.display = 'none';
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'text-xs text-gray-500 font-mono flex flex-col items-center';
                          errorDiv.innerHTML = `
                            <div class="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mb-2"></div>
                            <p>Waiting for video feed from AI Node...</p>
                            <p class="text-gray-600 mt-1">Make sure Python server is running on port 5000</p>
                          `;
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />

                    {/* Overlay Stats */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-emerald-400 border border-white/10">
                          YOLOv8n-seg
                        </div>
                        <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-blue-400 border border-white/10">
                          TensorRT FP16
                        </div>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-emerald-400" />
                          <span className="text-xs font-mono text-white">2</span>
                        </div>
                        <div className="w-px h-3 bg-white/20"></div>
                        <div className="flex items-center gap-1.5">
                          <Car size={12} className="text-blue-400" />
                          <span className="text-xs font-mono text-white">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-white">Real-time FPS Performance</h4>
                    <span className="text-xs text-gray-500">Last 20 seconds</span>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perfData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} domain={[20, 40]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                          itemStyle={{ color: '#10b981' }}
                        />
                        <Area type="monotone" dataKey="fps" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFps)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* System Specs */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-sm font-semibold text-white mb-4">Edge Node Specs</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400">
                        <Cpu size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">NVIDIA Jetson Orin</span>
                          <span className="text-emerald-400 font-mono">{systemStats.gpuLoad}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${systemStats.gpuLoad}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400">
                        <Activity size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Memory Usage</span>
                          <span className="text-blue-400 font-mono">{systemStats.memoryUsage}/8GB</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(parseFloat(systemStats.memoryUsage) / 8) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Events */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl flex flex-col h-[calc(100%-12rem)]">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-white">Detection Logs</h4>
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Live Sync</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {logs.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm py-8">Waiting for detections...</div>
                    ) : (
                      logs.map(log => (
                        <div key={log.id} className={`p-3 rounded-xl flex items-start gap-3 transition-colors ${log.alert ? 'bg-red-500/10 border border-red-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
                          <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${log.alert ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-400'}`}>
                            {log.alert ? <AlertTriangle size={12} /> : (log.type === 'Person' ? <Users size={12} /> : <Car size={12} />)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <span className={`text-sm font-medium ${log.alert ? 'text-red-400' : 'text-gray-200'}`}>
                                {log.type} Detected
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="truncate">{log.location}</span>
                              <span>•</span>
                              <span className="font-mono text-emerald-400/80">conf: {log.confidence}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ======================================
// Metric Card Component
// ======================================

function MetricCard({ title, value, unit, icon: Icon, trend, color, bg }: MetricCardProps) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-md">
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 w-full ${bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  );
}

