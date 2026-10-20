import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const ParentInvolvementView: React.FC = () => {
  const { currentUser, parents, involvements, addInvolvementRecord } = useApp();

  const currentParent = parents.find((p) => p.id === currentUser.parentId) || parents[0];
  const parentInvolvements = involvements.filter((i) => i.parentId === currentParent.id);

  const [feedbackText, setFeedbackText] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState('ISAT U Mid-Year GPTA Assembly');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    addInvolvementRecord({
      parentId: currentParent.id,
      parentName: currentParent.fullName,
      title: `${selectedMeeting} (Submitted Feedback/Resolution)`,
      type: 'GPTA Assembly',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'Attended',
      verifiedBy: 'ISAT U GPTA Secretariat',
      feedback: feedbackText.trim(),
    });

    setIsSubmitted(true);
    setFeedbackText('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-[#0b2545] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              General Parents-Teachers Association (GPTA)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Parent Involvement & University Participation
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed max-w-xl">
              ISAT U recognizes that continuous parent involvement is a cornerstone of student academic persistence, emotional resilience, and technological craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10">
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-bold">Engagement Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums">
                {currentParent.involvementScore}%
              </div>
              <div className="text-[11px] text-white font-medium">{currentParent.involvementStatus}</div>
            </div>

            <div>
              <div className="text-[10px] text-blue-200 uppercase font-bold">Verified Meetings</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {parentInvolvements.filter((i) => i.status === 'Attended').length}
              </div>
              <div className="text-[11px] text-emerald-300 font-medium">Recorded in Registry</div>
            </div>

            <div>
              <div className="text-[10px] text-blue-200 uppercase font-bold">Clearance Status</div>
              <div className="text-base sm:text-lg font-bold text-emerald-300 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cleared
              </div>
              <div className="text-[10px] text-blue-200">PTA Assembly Requirement</div>
            </div>
          </div>
        </div>

        {/* Feature Dialogue Image Card */}
        <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative bg-slate-900 min-h-[220px]">
          <img
            src="/src/assets/images/parent_adviser_dialogue_1792048183580.jpg"
            alt="Parent Consultation"
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Guidance & Advisory Council
            </span>
            <div className="text-xs font-semibold text-white mt-1">
              Active partnership between educators and families at ISAT U
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Log Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Official Assembly & Meeting Attendance Log
              </h3>
              <p className="text-xs text-slate-500">
                Verified records signed by University Administration and PTA Officers
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {parentInvolvements.length} Records
            </span>
          </div>

          <div className="space-y-3">
            {parentInvolvements.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No meeting records logged yet.
              </div>
            ) : (
              parentInvolvements.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{inv.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="tabular-nums font-medium text-slate-700">{inv.date}</span>
                        <span>·</span>
                        <span>{inv.type}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        inv.status === 'Attended'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inv.status === 'Excused'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100 flex items-center justify-between">
                    <span>Verified by: <strong>{inv.verifiedBy}</strong></span>
                    <span className="text-slate-400 text-[10px]">Registry Authenticated</span>
                  </div>

                  {inv.feedback && (
                    <p className="text-xs text-slate-600 italic bg-amber-50/40 p-2 rounded border border-amber-100">
                      "{inv.feedback}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Feedback / Excuse Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-700" /> Submit PTA Feedback or Resolution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send questions, proposals, or attendance excuses to the ISAT U GPTA Council
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">Feedback Logged in Registry</h4>
              <p className="text-xs text-emerald-700">
                Your input has been recorded and factored into your semester parent involvement score.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target University Meeting / Assembly
                </label>
                <select
                  value={selectedMeeting}
                  onChange={(e) => setSelectedMeeting(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                >
                  <option value="ISAT U Mid-Year GPTA Assembly">ISAT U Mid-Year GPTA Assembly</option>
                  <option value="College PTA Consultation & Forum">College PTA Consultation & Forum</option>
                  <option value="University Foundation Week Volunteers">University Foundation Week Volunteers</option>
                  <option value="Guidance Wellness & Mental Health Dialogue">Guidance Wellness & Mental Health Dialogue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Remarks, Proposal, or Justification
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share feedback on curriculum, facilities, student laboratory needs, or submit justification if unable to attend..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-900">
                <ShieldCheck className="w-4 h-4 inline mr-1 text-blue-700" />
                Submitting feedback awards active participation points towards your parent clearance rating.
              </div>

              <button
                type="submit"
                className="w-full bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                Submit to GPTA Council
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
