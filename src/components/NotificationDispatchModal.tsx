import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Parent, SchoolEvent } from '../types';
import {
  X,
  Send,
  Bell,
  Mail,
  Smartphone,
  CheckCircle,
  Eye,
  Calendar,
  Users
} from 'lucide-react';

interface NotificationDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParent?: Parent | null;
  initialEvent?: SchoolEvent | null;
}

export const NotificationDispatchModal: React.FC<NotificationDispatchModalProps> = ({
  isOpen,
  onClose,
  initialParent,
  initialEvent,
}) => {
  const { parents, events, dispatchNotification } = useApp();

  const [title, setTitle] = useState(
    initialEvent
      ? `Notice: ${initialEvent.title}`
      : initialParent
      ? `University Advisory for ${initialParent.fullName}`
      : 'Mid-Year GPTA General Assembly & Academic Update'
  );

  const [body, setBody] = useState(
    initialEvent
      ? `ISAT U invites you to ${initialEvent.title} on ${initialEvent.date} at ${initialEvent.venue}. Your presence and involvement are vital to our university community.`
      : initialParent
      ? `Dear ${initialParent.fullName}, this is an official update regarding your student's progress and upcoming college consultations at ISAT U. Please review your dashboard.`
      : 'Greetings from Iloilo Science and Technology University! We cordially invite all parents and legal guardians to our upcoming general assembly. Please log in to confirm your attendance.'
  );

  const [channel, setChannel] = useState<'push' | 'email' | 'both'>('both');
  const [targetScope, setTargetScope] = useState<'all' | 'college' | 'guidance_cases' | 'single_parent'>(
    initialParent ? 'single_parent' : 'all'
  );
  const [selectedCollege, setSelectedCollege] = useState('CICT');
  const [selectedEventId, setSelectedEventId] = useState(initialEvent?.id || '');
  const [previewTab, setPreviewTab] = useState<'push' | 'email'>('push');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert('Please provide both notification title and message body.');
      return;
    }

    dispatchNotification({
      title: title.trim(),
      body: body.trim(),
      channel,
      targetScope,
      targetFilter: targetScope === 'college' ? selectedCollege : undefined,
      linkedEventId: selectedEventId || undefined,
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Automated Push Notification & Email Dispatcher</h3>
              <p className="text-xs text-blue-200">
                Inform parents of university activities, school events, and academic notices in real time
              </p>
            </div>
          </div>
        </div>

        {isSent ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Broadcast Successfully Dispatched!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Automated push alerts have been delivered to connected devices and institutional email templates sent to parent inboxes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Announcement Title / Push Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. GPTA General Assembly Notice"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message Body & Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write detailed event instructions, date, venue, and links..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>

                {/* Delivery Channel Radio */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Channels
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setChannel('both')}
                      className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                        channel === 'both'
                          ? 'bg-[#0b2545] text-white border-[#0b2545]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      Push & Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('push')}
                      className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                        channel === 'push'
                          ? 'bg-[#0b2545] text-white border-[#0b2545]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Push Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('email')}
                      className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                        channel === 'email'
                          ? 'bg-[#0b2545] text-white border-[#0b2545]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email Only
                    </button>
                  </div>
                </div>

                {/* Target Audience Scope */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Recipient Group
                  </label>
                  <select
                    value={targetScope}
                    onChange={(e) => setTargetScope(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  >
                    <option value="all">All Enrolled ISAT U Parents & Guardians ({parents.length} registered)</option>
                    <option value="college">Specific College / Department (e.g. CICT, CEA, CIT, CAS, COE)</option>
                    <option value="guidance_cases">Parents of Students with Attendance & Guidance Follow-ups</option>
                    {initialParent && (
                      <option value="single_parent">Direct Parent: {initialParent.fullName}</option>
                    )}
                  </select>
                </div>

                {targetScope === 'college' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Target College
                    </label>
                    <select
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    >
                      <option value="CICT">College of Information and Communications Technology (CICT)</option>
                      <option value="CEA">College of Engineering and Architecture (CEA)</option>
                      <option value="CIT">College of Industrial Technology (CIT)</option>
                      <option value="COE">College of Education (COE)</option>
                      <option value="CAS">College of Arts and Sciences (CAS)</option>
                    </select>
                  </div>
                )}

                {/* Attach to School Event */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attach Upcoming School Event (Optional)
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => {
                      setSelectedEventId(e.target.value);
                      const found = events.find((ev) => ev.id === e.target.value);
                      if (found) {
                        setTitle(`Notice: ${found.title}`);
                        setBody(`ISAT U cordially invites you to ${found.title} on ${found.date} (${found.time}) at ${found.venue}. Please log into your portal to confirm attendance.`);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="">None (General Memo / Announcement)</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} · {ev.date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column: Live Previews (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Eye className="w-3.5 h-3.5 text-blue-600" /> Live Recipient Preview
                  </div>
                  <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('push')}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        previewTab === 'push' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Mobile Push
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('email')}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        previewTab === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Email Letter
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  {previewTab === 'push' ? (
                    /* Smartphone Lockscreen Push Notification Simulation */
                    <div className="w-full max-w-[280px] bg-slate-900 rounded-[28px] p-3 shadow-xl border-4 border-slate-800 text-white">
                      <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-4" />
                      
                      <div className="text-center text-[11px] text-slate-400 mb-3 tabular-nums">
                        Today 10:15 AM
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-md">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-[9px]">
                            U
                          </div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
                            ISAT U Portal
                          </span>
                          <span className="text-[9px] text-slate-400 ml-auto">now</span>
                        </div>
                        <div className="text-xs font-bold text-white leading-snug">
                          {title || 'Announcement Headline'}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                          {body || 'Notification message text appears here...'}
                        </div>
                      </div>

                      <div className="mt-8 text-center text-[10px] text-slate-500">
                        Swipe up to view in portal
                      </div>
                    </div>
                  ) : (
                    /* Institutional Email Template Simulation */
                    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left text-xs">
                      {/* Email Header */}
                      <div className="bg-[#0b2545] p-3 text-white flex items-center gap-2 border-b-2 border-amber-400">
                        <div className="w-6 h-6 rounded-full bg-white p-0.5">
                          <img
                            src="/src/assets/images/isat_u_crest_symbol_1792048181752.jpg"
                            alt="Seal"
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[11px] tracking-wide text-white">
                            Iloilo Science and Technology University
                          </div>
                          <div className="text-[9px] text-blue-200">Office of the University Registrar & GPTA</div>
                        </div>
                      </div>

                      {/* Email Body */}
                      <div className="p-4 space-y-2.5 text-slate-700">
                        <div className="text-[11px] text-slate-500">
                          Dear ISAT U Parent / Guardian,
                        </div>
                        <div className="font-bold text-slate-900 text-xs">
                          {title || 'Official Academic Notice'}
                        </div>
                        <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded border border-slate-100">
                          {body || 'Your email text will be formatted in this formal bulletin.'}
                        </div>
                        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                          Sent automatically via ISAT U Parent Link Portal. Burgos St., La Paz, Iloilo City.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-200">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Recipients: <span className="font-semibold text-slate-800">
                  {targetScope === 'all'
                    ? `${parents.length * 80} Parents & Guardians`
                    : targetScope === 'college'
                    ? `120 Parents (${selectedCollege})`
                    : targetScope === 'guidance_cases'
                    ? '14 Guidance Follow-up Parents'
                    : '1 Parent'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0b2545] hover:bg-[#133c70] text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  Dispatch Broadcast Now
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
