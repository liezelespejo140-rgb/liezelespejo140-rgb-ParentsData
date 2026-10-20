import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Mail,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface AdminNotificationsViewProps {
  onOpenBroadcastModal: () => void;
}

export const AdminNotificationsView: React.FC<AdminNotificationsViewProps> = ({
  onOpenBroadcastModal,
}) => {
  const { notifications, dispatchNotification, isPushActive, togglePushNotifications } = useApp();

  const [filterChannel, setFilterChannel] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterChannel !== 'all' && n.channel !== filterChannel) return false;
    return true;
  });

  const totalDelivered = notifications.reduce((sum, n) => sum + n.recipientCount, 0);

  // Quick test broadcast
  const triggerTestAlert = () => {
    dispatchNotification({
      title: 'Automated Test: ISAT U Push & Email Dispatch',
      body: 'Testing real-time notification delivery pipeline. Parents receive immediate audio notification and lockscreen banner updates.',
      channel: 'both',
      targetScope: 'all',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Automated Notification & Broadcast Dispatch Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time delivery log of push alerts, PTA memorandums, and email updates dispatched to ISAT U parents
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerTestAlert}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            Trigger Test Push
          </button>
          <button
            onClick={onOpenBroadcastModal}
            className="px-4 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Send className="w-4 h-4 text-amber-400" />
            Compose Broadcast
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-blue-700" /> Total Dispatches Sent
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {notifications.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Automated & Manual Memos
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" /> Total Parent Receptions
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {totalDelivered.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-0.5">
            Delivered across channels
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-amber-500" /> Web Push Subscriptions
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {isPushActive ? 'Active' : 'Standby'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Audio chime & lockscreen enabled
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-600" /> Average Open Rate
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            88.4%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Parent interaction response
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'both', 'push', 'email'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap capitalize ${
                filterChannel === ch
                  ? 'bg-[#0b2545] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {ch === 'all' ? 'All Channels' : ch === 'both' ? 'Push & Email' : ch}
            </button>
          ))}
        </div>

        <button
          onClick={togglePushNotifications}
          className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
        >
          <Radio className="w-3.5 h-3.5" />
          {isPushActive ? 'Push Notifications Enabled' : 'Enable Push Notifications'}
        </button>
      </div>

      {/* Notification Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject / Message</th>
                <th className="py-3 px-3 text-center">Channel</th>
                <th className="py-3 px-4">Target Scope</th>
                <th className="py-3 px-3 text-center">Recipients</th>
                <th className="py-3 px-3 text-center">Delivery Time</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotifs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No dispatches logged in this category.
                  </td>
                </tr>
              ) : (
                filteredNotifs.map((notif) => (
                  <tr key={notif.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 text-xs">{notif.title}</div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {notif.body}
                      </p>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {notif.channel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-700">
                      <div className="capitalize font-semibold text-slate-800">
                        {notif.targetScope === 'all'
                          ? 'All Parents'
                          : notif.targetScope === 'college'
                          ? `${notif.targetFilter} Parents`
                          : notif.targetScope === 'guidance_cases'
                          ? 'Guidance Follow-up Parents'
                          : 'Direct Parent'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center tabular-nums font-semibold text-slate-800">
                      {notif.recipientCount}
                    </td>

                    <td className="py-3 px-3 text-center tabular-nums text-slate-500 text-[11px]">
                      {notif.sentAt}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {notif.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
