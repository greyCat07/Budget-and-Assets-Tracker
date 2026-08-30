import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Repeat,
  DollarSign,
  AlertTriangle,
  Zap,
  TrendingDown,
  Trash2,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ScheduledBill, CategoryName } from '../types';

interface BillCalendarViewProps {
  onOpenAddBill: () => void;
}

export const BillCalendarView: React.FC<BillCalendarViewProps> = ({ onOpenAddBill }) => {
  const {
    scheduledBills,
    toggleBillPaid,
    deleteScheduledBill,
    accounts,
    formatCurrency,
    totalLiquidCash,
  } = useFinance();

  const today = new Date();
  const currentDay = today.getDate();
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  // Month day count
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Map bills by due day
  const billsByDay: Record<number, ScheduledBill[]> = {};
  for (const bill of scheduledBills) {
    if (!billsByDay[bill.dueDay]) {
      billsByDay[bill.dueDay] = [];
    }
    billsByDay[bill.dueDay].push(bill);
  }

  // Calculate remaining bills total
  const unpaidBillsTotal = scheduledBills
    .filter((b) => !b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0);

  const selectedDayBills = billsByDay[selectedDay] || [];

  return (
    <div id="bill-calendar-view" className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            Scheduled Bills Calendar
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Automated due date scheduling, payroll alignment & cashflow liquidity buffer
          </p>
        </div>

        <button
          id="btn-add-scheduled-bill"
          onClick={onOpenAddBill}
          className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-xs font-bold text-neutral-950 flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Scheduled Bill</span>
        </button>
      </div>

      {/* Cashflow Forecast KPI Card */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
          Automated Cashflow Forecast ({monthName})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Liquid Cash Available</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5 block">
              {formatCurrency(totalLiquidCash, true)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Pending Unpaid Bills</span>
            <span className="text-base sm:text-lg font-bold text-rose-400 font-mono mt-0.5 block">
              -{formatCurrency(unpaidBillsTotal)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Projected Free Buffer</span>
            <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5 block">
              {formatCurrency(totalLiquidCash - unpaidBillsTotal, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols on lg): Calendar Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-neutral-100">{monthName} Calendar</span>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Payday (1st & 15th)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Bill Due
                </span>
              </div>
            </div>

            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <span key={d} className="text-[11px] font-bold text-neutral-400 py-1">
                  {d}
                </span>
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday = day === currentDay;
                const isSelected = day === selectedDay;
                const isPayday = day === 1 || day === 15;
                const dayBills = billsByDay[day] || [];
                const hasUnpaid = dayBills.some((b) => !b.isPaid);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 min-h-[50px] ${
                      isSelected
                        ? 'bg-purple-500 text-neutral-950 font-bold shadow-lg shadow-purple-500/20 scale-105'
                        : isToday
                        ? 'bg-neutral-800 border border-purple-400 text-neutral-100'
                        : 'bg-neutral-850/50 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-mono">{day}</span>

                    {/* Indicators */}
                    <div className="flex items-center gap-1 mt-1">
                      {isPayday && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-neutral-950' : 'bg-emerald-400'
                          }`}
                        />
                      )}
                      {dayBills.length > 0 && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected
                              ? 'bg-neutral-950'
                              : hasUnpaid
                              ? 'bg-purple-400'
                              : 'bg-neutral-500'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols on lg): Selected Day & Full Bills List */}
        <div className="lg:col-span-5 space-y-5">
          {/* Selected Day Bills */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">
                Day {selectedDay}th Bills
              </h3>
              <span className="text-xs text-neutral-400 font-mono">
                {selectedDayBills.length} due
              </span>
            </div>

            {selectedDayBills.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400">
                No bills scheduled on day {selectedDay}.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayBills.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-100">{b.title}</div>
                      <span className="text-[10px] text-neutral-400">
                        {b.category} • {b.autoPay ? 'Auto-Pay' : 'Manual'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-100">
                        {formatCurrency(b.amount)}
                      </span>
                      <button
                        onClick={() => toggleBillPaid(b.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          b.isPaid
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {b.isPaid ? 'Paid' : 'Mark Paid'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Scheduled Bills List */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">
                All Scheduled Bills ({scheduledBills.length})
              </h3>
              <span className="text-xs text-neutral-400">Monthly breakdown</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {scheduledBills.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                      {b.dueDay}th
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-100">{b.title}</div>
                      <span className="text-[10px] text-neutral-400">
                        {b.category} • {b.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-neutral-200">
                      {formatCurrency(b.amount)}
                    </span>
                    <button
                      onClick={() => toggleBillPaid(b.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        b.isPaid
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {b.isPaid ? 'Paid' : 'Pay'}
                    </button>
                    <button
                      onClick={() => deleteScheduledBill(b.id)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
