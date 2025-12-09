import { useState } from 'react';
import { Send, Database, Zap, DollarSign, Activity, Sparkles, TrendingUp, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, cacheHits: 0, savedTime: 0 });
  const [latencyHistory, setLatencyHistory] = useState([]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const start = Date.now();

    try {
      const res = await fetch('https://semantic-backend-gk7q.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      
      const duration = Date.now() - start;
      const isCache = data.source === 'cache';

      const newEntry = {
        question: query,
        answer: data.answer,
        source: data.source,
        latency: duration,
        timestamp: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newEntry, ...prev]);
      setMetrics((prev) => ({
        total: prev.total + 1,
        cacheHits: prev.cacheHits + (isCache ? 1 : 0),
        savedTime: prev.savedTime + (isCache ? 2.0 : 0)
      }));
      setLatencyHistory((prev) => [...prev, { 
        time: prev.length + 1, 
        latency: duration, 
        type: isCache ? 'cache' : 'api' 
      }].slice(-10));

    } catch (err) {
      console.error(err);
      alert("Backend error! Make sure 'node server.js' is running on port 3000.");
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const chartData = [
    { name: 'API Calls', value: metrics.total - metrics.cacheHits, color: '#f43f5e' },
    { name: 'Cache Hits', value: metrics.cacheHits, color: '#10b981' },
  ];

  const cacheHitRate = metrics.total === 0 ? 0 : Math.round((metrics.cacheHits / metrics.total) * 100);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Semantic Cache Engine
              </h1>
              <p className="text-slate-400 text-sm mt-1">AI-Powered Cost Optimization & Latency Reduction System</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-medium text-slate-300 border border-slate-700/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Gemini 2.5 Flash
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-medium text-slate-300 border border-slate-700/50 flex items-center gap-2">
              <Database size={12} className="text-blue-400" />
              Upstash Vector DB
            </div>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard 
            icon={<Target className="text-blue-400" />} 
            label="Total Queries" 
            value={metrics.total.toString()}
            trend="+12%"
            gradient="from-blue-500/10 to-blue-600/5"
          />
          <StatCard 
            icon={<TrendingUp className="text-green-400" />} 
            label="Cache Hit Rate" 
            value={`${cacheHitRate}%`}
            trend={cacheHitRate > 50 ? "Excellent" : "Growing"}
            gradient="from-green-500/10 to-green-600/5"
          />
          <StatCard 
            icon={<Clock className="text-yellow-400" />} 
            label="Time Saved" 
            value={`${metrics.savedTime.toFixed(1)}s`}
            trend="98% faster"
            gradient="from-yellow-500/10 to-yellow-600/5"
          />
          <StatCard 
            icon={<DollarSign className="text-emerald-400" />} 
            label="Cost Savings" 
            value={`$${(metrics.cacheHits * 0.002).toFixed(4)}`}
            trend="Real-time"
            gradient="from-emerald-500/10 to-emerald-600/5"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chat Interface */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl h-[600px]"
          >
            <div className="p-4 bg-linear-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-blue-400 animate-pulse"/>
                <span className="text-slate-200">Live Query Interface</span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full">
                {history.length} queries
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth custom-scrollbar">
              <AnimatePresence>
                {history.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-slate-500"
                  >
                    <div className="relative">
                      <Database className="w-20 h-20 mb-4 opacity-20" />
                      <Sparkles className="w-8 h-8 absolute top-0 right-0 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-lg font-medium mb-2">Ready to optimize your queries</p>
                    <p className="text-sm text-slate-600">Ask a question to see the magic happen!</p>
                  </motion.div>
                )}
                {history.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-linear-to-br from-blue-600/30 to-blue-700/20 backdrop-blur-sm text-blue-100 px-5 py-3 rounded-2xl rounded-tr-sm text-sm border border-blue-500/30 max-w-[85%] shadow-lg">
                        {item.question}
                      </div>
                    </div>

                    {/* AI Answer */}
                    <div className={`p-4 rounded-2xl border backdrop-blur-sm ${
                      item.source === 'cache' 
                        ? 'bg-linear-to-br from-green-900/20 to-green-800/10 border-green-500/30' 
                        : 'bg-linear-to-br from-rose-900/20 to-rose-800/10 border-rose-500/30'
                    } max-w-[90%] shadow-xl`}>
                      <div className="flex justify-between items-start mb-3">
                        <Badge source={item.source} latency={item.latency} />
                        <span className="text-xs text-slate-500 font-medium">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 flex gap-3">
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAsk(e)}
                disabled={loading}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-800/50 backdrop-blur-sm text-white px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50 placeholder-slate-500 transition-all"
              />
              <button 
                onClick={handleAsk}
                disabled={loading}
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? <Activity className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </motion.div>

          {/* Analytics Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Performance Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-300">
                <Activity size={16} className="text-purple-400" /> 
                Query Distribution
              </h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155', 
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Latency Trend */}
            {latencyHistory.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-300">
                  <TrendingUp size={16} className="text-blue-400" /> 
                  Latency Trend
                </h3>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={latencyHistory}>
                      <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="time" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155', 
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="latency" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorLatency)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-linear-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/20 shadow-2xl">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Zap className="text-blue-400" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Smart Caching</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Semantic similarity detection with vector embeddings provides intelligent query matching
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <p className="text-xs text-slate-400 text-center">
                  <span className="text-green-400 font-bold text-sm">98% faster</span> response time with cached results
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ icon, label, value, trend, gradient }) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`bg-linear-to-br ${gradient} backdrop-blur-xl p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4 hover:border-slate-600/50 transition-all shadow-xl hover:shadow-2xl cursor-pointer`}
  >
    <div className="p-3 bg-slate-900/50 rounded-xl shadow-lg">{icon}</div>
    <div className="flex-1">
      <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-100 mb-1">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{trend}</p>
    </div>
  </motion.div>
);

const Badge = ({ source, latency }) => {
  const isCache = source === 'cache';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-lg ${
      isCache 
        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    }`}>
      {isCache ? <Zap size={12} /> : <Database size={12} />}
      <span>{isCache ? 'CACHE HIT' : 'API CALL'}</span>
      <span className="opacity-60">• {latency}ms</span>
    </div>
  );
};

export default App;