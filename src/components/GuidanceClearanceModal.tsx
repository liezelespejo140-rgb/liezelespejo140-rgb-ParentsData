import React from 'react';
import { Student } from '../types';
import { X, Printer, ShieldCheck, Award, CheckCircle, Clock } from 'lucide-react';

interface GuidanceClearanceModalProps {
  student: Student | null;
  onClose: () => void;
}

export const GuidanceClearanceModal: React.FC<GuidanceClearanceModalProps> = ({
  student,
  onClose,
}) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar */}
        <div className="bg-[#0b2545] px-6 py-3 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4" /> Official ISAT U Guidance Inventory & Moral Clearance Certificate
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 bg-white text-slate-900 print:p-0">
          {/* Institutional Letterhead */}
          <div className="flex items-center justify-center gap-4 border-b-2 border-slate-900 pb-4 text-center">
            <div className="w-16 h-16 rounded-full border border-slate-300 p-1 flex items-center justify-center shrink-0">
              <img
                src="/src/assets/images/isat_u_crest_symbol_1792048181752.jpg"
                alt="ISAT U Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-slate-600">
                Republic of the Philippines
              </div>
              <h2 className="text-base sm:text-lg font-extrabold uppercase text-[#0b2545] tracking-tight">
                Iloilo Science and Technology University
              </h2>
              <div className="text-xs text-slate-600">
                Burgos St., La Paz, Iloilo City, Philippines 5000 · Office of Student Affairs & Services
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mt-1">
                University Guidance & Counseling Center · Student Development Record
              </div>
            </div>
          </div>

          {/* Student Profile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs py-4 border-b border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Student ID Number:</span>
              <span className="font-bold font-mono text-slate-900">{student.studentNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Academic Year & Semester:</span>
              <span className="font-bold text-slate-900">{student.academicYear} · {student.currentSemester}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">College / Department:</span>
              <span className="font-medium text-slate-800">{student.college}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Program & Section:</span>
              <span className="font-medium text-slate-800">{student.program} ({student.section})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Guidance Clearance:</span>
              <span
                className={`font-bold ${
                  student.guidanceClearanceStatus === 'Cleared'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {student.guidanceClearanceStatus}
              </span>
            </div>
          </div>

          {/* Behavioral & Conduct Evaluation Summary */}
          <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" /> Behavioral & Moral Standing Evaluation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Moral Standing</span>
                <span className="font-bold text-slate-900">{student.guidanceStanding}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Conduct Rating</span>
                <span className="font-bold text-slate-900">{student.behavioralRating} Conduct</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Class Attendance</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {student.overallAttendanceRate}% ({student.totalAbsences} Absences)
                </span>
              </div>
            </div>
          </div>

          {/* Individual Counseling & Guidance Inventory Sessions */}
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" /> Verified Counseling & Guidance Dialogues
            </h4>

            {student.counselingRecords.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                No formal counseling cases recorded. Student is in regular academic standing.
              </div>
            ) : (
              <div className="border border-slate-300 rounded-lg divide-y divide-slate-200 overflow-hidden text-xs">
                {student.counselingRecords.map((coun) => (
                  <div key={coun.id} className="p-3 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{coun.category}</span>
                        <span className="text-[10px] text-slate-500 tabular-nums">{coun.date}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {coun.status}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      <strong>Summary:</strong> {coun.summary}
                    </p>
                    <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                      <strong>Counselor Action Plan:</strong> {coun.actionPlan}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Strengths & Recommended Home Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Observed Student Strengths & Aptitudes
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-700 text-[11px]">
                {student.studentStrengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Recommended Parent & Home Collaboration
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-700 text-[11px]">
                {student.recommendedParentSupport.map((sup, idx) => (
                  <li key={idx}>{sup}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-4 border-t border-slate-200 text-center text-xs">
            <div>
              <div className="font-semibold text-slate-900">{student.counselor.name}</div>
              <div className="text-[10px] text-slate-500">Registered Guidance Counselor (RGC)</div>
              <div className="text-[10px] text-slate-400">{student.counselor.office}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">Dr. Erlinda M. Yap</div>
              <div className="text-[10px] text-slate-500">Vice President for Academic & Student Affairs</div>
              <div className="text-[10px] text-slate-400">ISAT U Central Administration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
