import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { X, Calendar, Clock, User, CheckCircle, FileText } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedStudent?: Student | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  linkedStudent,
}) => {
  const { currentUser, createConsultation, students } = useApp();

  const activeStudent = linkedStudent || students[0];

  const [date, setDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('02:00 PM - 03:00 PM');
  const [counselor, setCounselor] = useState(
    activeStudent?.counselor.name || 'Prof. Arthur Magbanua, RGC (Director, Guidance Center)'
  );
  const [agenda, setAgenda] = useState(
    'Discuss student mid-term progress, class attendance, and curriculum advice.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createConsultation({
      parentId: currentUser.parentId || 'parent-1',
      parentName: currentUser.name,
      studentId: activeStudent.id,
      studentName: activeStudent.fullName,
      preferredDate: date,
      timeSlot,
      agenda: agenda.trim(),
      counselorName: counselor,
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Request Guidance / Teacher Consultation</h3>
              <p className="text-xs text-blue-200">
                Book a face-to-face or online conference regarding your child's academic journey
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="text-xs font-bold text-[#0b2545]">Student: {activeStudent?.fullName}</div>
            <div className="text-[11px] text-slate-600">
              {activeStudent?.studentNumber} · {activeStudent?.program} ({activeStudent?.yearLevel})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Adviser / University Counselor
            </label>
            <input
              type="text"
              value={counselor}
              onChange={(e) => setCounselor(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Date
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
                Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM</option>
                <option value="01:30 PM - 02:30 PM">01:30 PM - 02:30 PM</option>
                <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Consultation Agenda & Concerns
            </label>
            <textarea
              rows={3}
              required
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="State topics to discuss (e.g. subjects needing support, career planning, attendance follow-up)..."
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
              Submit Appointment Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
