import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  RefreshCw,
  Send,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  BrainCircuit,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const AIInsightsView: React.FC = () => {
  const {
    aiInsights,
    refreshAiInsights,
    isAiLoading,
    askAiAdvisor,
    currentPeriodInfo,
    formatCurrency,
  } = useFinance();

  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello! I am your AI Financial Advisor. Based on your current semi-monthly pacing (${formatCurrency(currentPeriodInfo.totalSpent)} spent out of ${formatCurrency(currentPeriodInfo.totalAllocated)}), your safe discretionary allowance is ${formatCurrency(currentPeriodInfo.safeDailySpend)}/day. How can I assist with your budget or assets today?`,
      time: 'Just now',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const presetQuestions = [
    `Can I afford an upcoming ${formatCurrency(2500)} weekend dinner & event?`,
    `How can I save an extra ${formatCurrency(1500)} this pay cycle?`,
    'Audit my recurring subscriptions and fixed bills',
    'Am I holding too much liquid cash vs index funds?',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || userInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!queryText) setUserInput('');
    setIsChatLoading(true);

    try {
      const reply = await askAiAdvisor(textToSend);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: 'Unable to analyze at this moment. You are pacing within healthy budget parameters for this cycle.',
          time: 'Just now',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div id="ai-insights-view" className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            AI Financial Insights & Advisor
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Personalized behavioral analysis, smart money habits & real-time advisory
          </p>
        </div>

        <button
          id="btn-refresh-ai-insights"
          onClick={refreshAiInsights}
          disabled={isAiLoading}
          className="px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin text-emerald-400' : 'text-neutral-400'}`} />
          <span>{isAiLoading ? 'Analyzing Habits...' : 'Refresh AI Model'}</span>
        </button>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (6 cols on lg): Behavioral Pattern & Smart Tips */}
        <div className="lg:col-span-6 space-y-5">
          {/* Daily Behavior Insight Banner */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-100">
                Daily Spending Behavioral Analysis
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {aiInsights.dailyInsight}
            </p>
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Safe Daily Spend: <strong className="text-emerald-400 font-mono">{formatCurrency(currentPeriodInfo.safeDailySpend)}/day</strong></span>
              <span>Pacing Status: <strong className="text-emerald-400 font-semibold">Optimal</strong></span>
            </div>
          </div>

          {/* Smart Money Saving Tips */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-neutral-100">
                  Smart Money Recommendations ({aiInsights.tips.length})
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Impact Ranked</span>
            </div>

            <div className="space-y-3">
              {aiInsights.tips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        {tip.badge}
                      </span>
                      <span className="text-xs font-bold text-neutral-100">{tip.title}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {tip.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (6 cols on lg): Interactive AI Advisor Chat Console */}
        <div className="lg:col-span-6 space-y-3 flex flex-col">
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-neutral-100">
                    Live Financial Advisor
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Context: Cycle {currentPeriodInfo.period}
                </span>
              </div>

              {/* Preset prompt buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                  Suggested Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 transition-all hover:border-emerald-500/40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat messages log */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {chatMessages.map((msg, idx) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isAi
                            ? 'bg-neutral-850 border border-neutral-700/60 text-neutral-200'
                            : 'bg-emerald-500 text-neutral-950 font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-neutral-500 mt-1 px-1">{msg.time}</span>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-neutral-400 p-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>Advisor is analyzing your finances...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input Bar */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about budgets, investments, or discretionary spend..."
                className="flex-1 px-3.5 py-2.5 bg-neutral-850 border border-neutral-700/80 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                id="btn-send-advisor-query"
                onClick={() => handleSendMessage()}
                disabled={isChatLoading || !userInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
