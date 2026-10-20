import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Parent, InvolvementRecord } from '../types';
import { X, CheckCircle, Calendar, Plus } from 'lucide-react';

interface InvolvementLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetParent: Parent | null;
}

export const InvolvementLogModal: React.FC<InvolvementLogModalProps> = ({
  isOpen,
  onClose,
  targetParent,
}) => {
  const { addInvolvementRecord, events, currentUser } = useApp();

  const [title, setTitle] = useState('ISAT U Mid-Year General PTA Assembly');
  const [type, setType] = useState<InvolvementRecord['type']>('GPTA Assembly');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00 AM');
  const [status, setStatus] = useState<InvolvementRecord['status']>('Attended');
  const [verifiedBy, setVerifiedBy] = useState(
    currentUser.name || 'Dr. Erlinda M. Yap (VP Student Affairs)'
  );
  const [feedback, setFeedback] = useState('Actively participated in college discussion and PTA agenda voting.');

  if (!isOpen || !targetParent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addInvolvementRecord({
      parentId: targetParent.id,
      parentName: targetParent.fullName,
      title: title.trim(),
      type,
      date,
      time,
      status,
      verifiedBy: verifiedBy.trim(),
      feedback: feedback.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Log University Involvement Record</h3>
              <p className="text-xs text-blue-200">
                Record attendance for {targetParent.fullName} ({targetParent.relationship})
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select or Enter Meeting / Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activity Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="GPTA Assembly">GPTA Assembly</option>
                <option value="College PTA Meeting">College PTA Meeting</option>
                <option value="Parent-Teacher Conference">Parent-Teacher Conference</option>
                <option value="University Foundation Week">University Foundation Week</option>
                <option value="Guidance Dialogue">Guidance Dialogue</option>
                <option value="Community Extension">Community Extension</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attendance Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="Attended">Attended</option>
                <option value="Virtual Attendance">Virtual Attendance (Zoom/Livestream)</option>
                <option value="Excused">Excused with Prior Notice</option>
                <option value="Absent">Absent / No Show</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Verified By (Faculty / PTA Officer)
              </label>
              <input
                type="text"
                required
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Parent Feedback / Meeting Notes
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Record parent concerns, consultation outcomes, or suggestions..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0b2545] hover:bg-[#133c70] text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              Save Attendance Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
