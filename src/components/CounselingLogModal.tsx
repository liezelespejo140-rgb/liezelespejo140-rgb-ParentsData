import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, CounselingRecord } from '../types';
import { X, CheckCircle, Clock, ShieldCheck, User } from 'lucide-react';

interface CounselingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent?: Student | null;
}

export const CounselingLogModal: React.FC<CounselingLogModalProps> = ({
  isOpen,
  onClose,
  targetStudent,
}) => {
  const { students, addCounselingRecord, currentUser } = useApp();

  const activeStudent = targetStudent || students[0];

  const [category, setCategory] = useState<CounselingRecord['category']>(
    'Academic Adjustment & Motivation'
  );
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('02:00 PM');
  const [summary, setSummary] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [status, setStatus] = useState<CounselingRecord['status']>('Completed');
  const [notifyParent, setNotifyParent] = useState(true);

  if (!isOpen || !activeStudent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !actionPlan.trim()) {
      alert('Please fill in session summary and action plan.');
      return;
    }

    addCounselingRecord(activeStudent.id, {
      date,
      time,
      category,
      counselorName: currentUser.name || 'Prof. Arthur Magbanua, RGC',
      summary: summary.trim(),
      actionPlan: actionPlan.trim(),
      status,
      parentInformed: notifyParent,
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Log Guidance Counseling Session</h3>
              <p className="text-xs text-blue-200">
                Official Student Development & Counseling Inventory for {activeStudent.fullName}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#0b2545]">{activeStudent.fullName}</span>
              <div className="text-slate-600 text-[11px]">
                {activeStudent.studentNumber} · {activeStudent.program} ({activeStudent.yearLevel})
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              {activeStudent.guidanceStanding}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Counseling Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
            >
              <option value="Academic Adjustment & Motivation">Academic Adjustment & Motivation</option>
              <option value="Attendance Follow-up">Attendance Follow-up & Interventions</option>
              <option value="Career Guidance & Internship">Career Guidance & Industry Practicum</option>
              <option value="Peer Relations & Conduct">Peer Relations & Conduct</option>
              <option value="Emotional Well-Being">Emotional Well-Being & Stress Management</option>
              <option value="Routine Intake & Progress">Routine Annual Guidance Intake</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Summary & Student Concerns *
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Record observations, student concerns, discussion points..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prescribed Action Plan & Home Support Instructions *
            </label>
            <textarea
              rows={2}
              required
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="Steps for the student, follow-up timeline, and parent collaboration..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="Completed">Completed</option>
                <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                <option value="Case Closed">Case Closed</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-blue-900">
                <input
                  type="checkbox"
                  checked={notifyParent}
                  onChange={(e) => setNotifyParent(e.target.checked)}
                  className="rounded text-[#0b2545]"
                />
                <span>Notify parent via automated portal alert</span>
              </label>
            </div>
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
              Save to Guidance Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
