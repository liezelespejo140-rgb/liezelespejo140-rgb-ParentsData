import React, { useState } from 'react';
import { useApp, detectPhilippineCarrier } from '../../context/AppContext';
import {
  Smartphone,
  Send,
  MessageSquare,
  Radio,
  CheckCircle2,
  Clock,
  Users,
  Filter,
  Sparkles,
  Layers,
  Phone,
  Signal,
  Wifi,
  BatteryCharging,
  Info
} from 'lucide-react';

interface SMSNotificationViewProps {
  onOpenBroadcastModal?: () => void;
}

export const SMSNotificationView: React.FC<SMSNotificationViewProps> = () => {
  const { parents, notifications, dispatchNotification, students, currentUser } = useApp();

  const [senderId] = useState('ISATU-PAR');
  const [smsTitle, setSmsTitle] = useState('ISAT U PAR: Annual QF-PAR-01 Verification');
  const [smsBody, setSmsBody] = useState(
    'ISAT U PAR: Dear Parent/Guardian, please ensure your QF-PAR-01 data form and return slip are verified for AY 2025-2026. For inquiries, visit your campus PAR office.'
  );
  const [targetScope, setTargetScope] = useState<
    'all' | 'college' | 'campus' | 'income_bracket' | 'unemployed_cohort' | 'single_parent'
  >('all');
  const [targetFilter, setTargetFilter] = useState('CICT');
  const [singleParentId, setSingleParentId] = useState(parents[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Character counter
  const charLength = smsBody.length;
  const smsSegments = Math.ceil(charLength / 160) || 1;

  // Telco carrier calculation for parents
  const carrierStats = React.useMemo(() => {
    let smart = 0;
    let globe = 0;
    let dito = 0;
    let other = 0;

    parents.filter((p) => !p.isArchived).forEach((p) => {
      const c = detectPhilippineCarrier(p.contactNumber);
      if (c === 'SMART') smart++;
      else if (c === 'GLOBE') globe++;
      else if (c === 'DITO') dito++;
      else other++;
    });

    return { smart, globe, dito, other, total: smart + globe + dito + other };
  }, [parents]);

  // Templates
  const handleSelectTemplate = (template: { title: string; body: string }) => {
    setSmsTitle(template.title);
    setSmsBody(template.body);
  };

  const templates = [
    {
      label: 'QF-PAR-01 Intake Notice',
      title: 'ISAT U PAR: QF-PAR-01 Digital Intake Advisory',
      body: 'ISAT U PAR: Greetings! Please complete your digital QF-PAR-01 Parent Data Form and submit your Return Slip to your respective campus guidance office.',
    },
    {
      label: 'Return Slip Reminder',
      title: 'ISAT U PAR: Return Slip Verification Reminder',
      body: 'ISAT U PAR: Gentle reminder to present your QF-PAR-01 Return Slip at the Student Services Center for official semester clearance verification.',
    },
    {
      label: 'Needs Assessment Invite (QP-PAR 02)',
      title: 'ISAT U PAR: Parent Livelihood Seminar Invitation',
      body: 'ISAT U PAR: You are invited to the upcoming Livelihood & Skills Training Workshop (QP-PAR 02). Registration is free. Reply to reserve your slot.',
    },
    {
      label: 'PTA Assembly Notice',
      title: 'ISAT U PAR: General Assembly Notification',
      body: 'ISAT U PAR: Notice of Mid-Year General Parents-Teachers Association Assembly this coming Friday, 8:30 AM at the University Multi-Purpose Gym.',
    },
    {
      label: 'Guidance Dialogue',
      title: 'ISAT U PAR: Urgent Guidance Consultation Notice',
      body: 'ISAT U PAR: Confidential Advisory: Please coordinate with your student counselor for a routine moral values and academic progress advisement dialogue.',
    },
  ];

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsBody.trim()) {
      alert('Please enter SMS message text.');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      dispatchNotification({
        title: smsTitle.trim(),
        body: smsBody.trim(),
        channel: 'sms',
        targetScope,
        targetFilter:
          targetScope === 'college' || targetScope === 'campus' || targetScope === 'income_bracket'
            ? targetFilter
            : targetScope === 'single_parent'
            ? singleParentId
            : undefined,
        smsSenderId: senderId,
      });

      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    }, 700);
  };

  // Recent SMS dispatches
  const smsDispatches = notifications.filter(
    (n) => n.channel === 'sms' || n.type === 'sms_broadcast' || n.smsCarrierBreakdown
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
                  SMS Notification Engine
                </span>
                <span className="text-[11px] text-slate-500">
                  Philippine Telco Carrier Routing (Smart · Globe · DITO)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                ISAT U Parents SMS Broadcast & Carrier Gateway
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                Automated short messaging service configured with university Alpha-Numeric Sender ID <strong>{senderId}</strong> for urgent parent advisories, QF-PAR-01 submission notices, and event calls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Active SMS Sender ID
              </div>
              <div className="text-sm font-extrabold text-[#0b2545] font-mono tracking-wider">
                {senderId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telco Network Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              SMART / TNT
            </span>
            <Signal className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {carrierStats.smart}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            0918, 0919, 0920, 0939, 0998
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              GLOBE / TM
            </span>
            <Signal className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {carrierStats.globe}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            0917, 0915, 0905, 0927, 0977
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              DITO Telco
            </span>
            <Signal className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {carrierStats.dito}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            0991, 0992, 0993, 0994
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Total Verified Mobiles
            </span>
            <Phone className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {carrierStats.total}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            100% Delivery Reach
          </div>
        </div>
      </div>

      {/* Main Composer & Mobile Phone Simulator Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: SMS Composer Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Compose Official SMS Dispatch
            </h3>
            <span className="text-[11px] text-slate-500">
              Sender: <strong className="text-slate-800">{senderId}</strong>
            </span>
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Quick University SMS Templates:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTemplate(t)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium text-left"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendSMS} className="space-y-4 text-xs">
            {/* Title / Internal Tag */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Internal Advisory Reference Title:
              </label>
              <input
                type="text"
                required
                value={smsTitle}
                onChange={(e) => setSmsTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Target Audience Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Audience Filter:
                </label>
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900"
                >
                  <option value="all">All Enrolled ISAT U Parents ({carrierStats.total})</option>
                  <option value="campus">Filter by Campus</option>
                  <option value="college">Filter by College (Iloilo City)</option>
                  <option value="income_bracket">Filter by Income Bracket</option>
                  <option value="unemployed_cohort">Unemployed / 4Ps Cohort Only</option>
                  <option value="single_parent">Direct SMS to Single Parent</option>
                </select>
              </div>

              {/* Dynamic Target Detail */}
              {targetScope === 'campus' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Campus:</label>
                  <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900"
                  >
                    <option value="Iloilo City">Iloilo City Main Campus</option>
                    <option value="Barotac Nuevo">Barotac Nuevo Campus</option>
                    <option value="Dumangas">Dumangas Campus</option>
                    <option value="Leon">Leon Campus</option>
                    <option value="Miag-ao">Miag-ao Campus</option>
                  </select>
                </div>
              )}

              {targetScope === 'college' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select College:</label>
                  <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900"
                  >
                    <option value="CICT">College of Computing and Informatics (CICT)</option>
                    <option value="CEA">College of Engineering and Architecture (CEA)</option>
                    <option value="CIT">College of Industrial Technology (CIT)</option>
                    <option value="CAS">College of Arts and Sciences (CAS)</option>
                    <option value="COE">College of Education (COE)</option>
                  </select>
                </div>
              )}

              {targetScope === 'income_bracket' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Bracket:</label>
                  <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900"
                  >
                    <option value="Below Php 10,000">Below Php 10,000</option>
                    <option value="PhP 11,000- PhP 20,000">PhP 11,000- PhP 20,000</option>
                    <option value="PhP 21,000- PhP 30,000">PhP 21,000- PhP 30,000</option>
                    <option value="PhP 31,000- PhP 40,000">PhP 31,000- PhP 40,000</option>
                    <option value="PhP 41,000- PhP 50,000">PhP 41,000- PhP 50,000</option>
                    <option value="PhP 51,000 and above">PhP 51,000 and above</option>
                  </select>
                </div>
              )}

              {targetScope === 'single_parent' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Parent:</label>
                  <select
                    value={singleParentId}
                    onChange={(e) => setSingleParentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900"
                  >
                    {parents.filter((p) => !p.isArchived).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.contactNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  SMS Message Body (Standard GSM 7-bit Encoding):
                </label>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    charLength > 160 ? 'text-amber-600 font-bold' : 'text-slate-500'
                  }`}
                >
                  {charLength} chars | {smsSegments} SMS {smsSegments > 1 ? '(Multi-part)' : ''}
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden leading-relaxed"
                placeholder="Type your official SMS message here..."
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Broadcasts will dispatch via university SIM gateway to SMART, GLOBE & DITO numbers.
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    Routing via Carriers...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-200" />
                    Dispatch SMS Broadcast
                  </>
                )}
              </button>
            </div>

            {sentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                SMS broadcast dispatched successfully to carrier queues with sender ID {senderId}!
              </div>
            )}
          </form>
        </div>

        {/* Right: Phone Simulator Screen */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" /> Live Mobile Phone Preview
          </div>

          {/* Smartphone Frame */}
          <div className="w-72 sm:w-80 bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-700 text-slate-900">
            {/* Phone Screen */}
            <div className="bg-slate-100 rounded-[30px] overflow-hidden flex flex-col h-[460px]">
              {/* Status bar */}
              <div className="bg-slate-200/80 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-600 border-b border-slate-300">
                <span>9:41 AM</span>
                <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <Signal className="w-2.5 h-2.5" />
                  <Wifi className="w-2.5 h-2.5" />
                  <BatteryCharging className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Chat Header */}
              <div className="bg-[#0b2545] p-3 text-white flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  IS
                </div>
                <div>
                  <div className="text-xs font-bold tracking-tight">{senderId}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Official University SMS
                  </div>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#e5ddd5]/30">
                <div className="text-center text-[10px] text-slate-400 font-medium">
                  Today · ISAT U SMS Channel
                </div>

                {/* Simulated SMS bubble */}
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200 text-left space-y-1.5 max-w-[90%]">
                  <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                    {senderId}
                  </div>
                  <p className="text-[11px] text-slate-800 font-sans leading-relaxed break-words whitespace-pre-wrap">
                    {smsBody}
                  </p>
                  <div className="text-[9px] text-slate-400 text-right tabular-nums">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Delivered
                  </div>
                </div>
              </div>

              {/* Reply Bar (Disabled / Non-reply notice) */}
              <div className="p-2 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 font-medium">
                System Broadcast · Do not reply
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time SMS Dispatch Audit Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-700" />
            SMS Transmission Audit Log ({smsDispatches.length})
          </h3>
          <span className="text-xs text-slate-500">Live Delivery Gateway</span>
        </div>

        <div className="divide-y divide-slate-100">
          {smsDispatches.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent SMS broadcasts dispatched yet. Use the composer above to send your first message.
            </div>
          ) : (
            smsDispatches.map((disp) => (
              <div key={disp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {disp.smsSenderId || 'ISATU-PAR'}
                    </span>
                    <span className="font-bold text-slate-900">{disp.title}</span>
                    <span className="text-[11px] text-slate-400 tabular-nums">{disp.sentAt}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 font-mono text-[11px]">{disp.body}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {disp.smsCarrierBreakdown && (
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                        Smart: {disp.smsCarrierBreakdown.smartTnt}
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                        Globe: {disp.smsCarrierBreakdown.globeTm}
                      </span>
                      <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                        DITO: {disp.smsCarrierBreakdown.dito}
                      </span>
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Delivered ({disp.recipientCount})
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
