import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar,
  TrendingUp,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    setActiveTab,
  } = useFinance();

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'budget_warning':
      case 'budget_overrun':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'bill_reminder':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'market_move':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.type === 'budget_warning' || n.type === 'budget_overrun') {
      setActiveTab('budget');
      onClose();
    } else if (n.type === 'bill_reminder') {
      setActiveTab('calendar');
      onClose();
    } else if (n.type === 'market_move') {
      setActiveTab('assets');
      onClose();
    }
  };

  return (
    <div
      id="notification-drawer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl relative max-h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 pr-8">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">Notification Alerts</h3>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-xs text-neutral-400">
              <Bell className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <span>No active notification alerts. You're all caught up!</span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  n.read
                    ? 'bg-neutral-850/40 border-neutral-800/60 text-neutral-400'
                    : 'bg-neutral-850 border-neutral-700/80 text-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-neutral-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-100">{n.title}</span>
                      <span className="text-[10px] text-neutral-500">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-neutral-500 font-mono">
              {notifications.filter((n) => !n.read).length} unread
            </span>
            <button
              onClick={clearAllNotifications}
              className="text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
