import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConsultationRequest, Student } from '../../types';
import {
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Plus,
  MessageSquare
} from 'lucide-react';

interface ConsultationsViewProps {
  onOpenConsultationModal: (student?: Student) => void;
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({
  onOpenConsultationModal,
}) => {
  const { consultations, updateConsultationStatus, currentUser, students } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = consultations.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (currentUser.role === 'parent' && currentUser.parentId) {
      return c.parentId === currentUser.parentId;
    }
    return true;
  });

  const getStatusBadge = (status: ConsultationRequest['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Declined':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Academic & Guidance Consultation Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Schedule direct dialogues between parents, course advisers, and university guidance counselors
          </p>
        </div>

        <button
          onClick={() => onOpenConsultationModal(students[0])}
          className="px-4 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          Request New Consultation
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['all', 'Pending', 'Confirmed', 'Completed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap capitalize ${
              statusFilter === st
                ? 'bg-[#0b2545] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st === 'all' ? 'All Requests' : st}
          </button>
        ))}
      </div>

      {/* Consultations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No consultation appointments found.
          </div>
        ) : (
          filtered.map((cons) => (
            <div
              key={cons.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Parent: {cons.parentName}
                    </h3>
                    <div className="text-xs text-blue-700 mt-0.5">
                      Student: <span className="font-semibold text-slate-800">{cons.studentName}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(cons.status)}`}>
                    {cons.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <strong className="block text-slate-500 text-[10px] uppercase font-bold mb-1">
                    Agenda / Matters to Discuss
                  </strong>
                  "{cons.agenda}"
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-800 tabular-nums">{cons.preferredDate}</span>
                    <span className="text-slate-400">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {cons.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Counselor: <strong>{cons.counselorName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status Update for Admin / Faculty */}
              {currentUser.role !== 'parent' && cons.status === 'Pending' && (
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => updateConsultationStatus(cons.id, 'Confirmed')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Confirm Appointment
                  </button>
                  <button
                    onClick={() => updateConsultationStatus(cons.id, 'Declined')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
