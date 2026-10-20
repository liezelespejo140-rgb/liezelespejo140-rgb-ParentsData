import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Parent, Student } from '../types';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Award,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  Sparkles,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { SchedulePrintModal } from './SchedulePrintModal';
import { getScheduleForStudent } from '../data/studentSchedules';

interface ParentDetailModalProps {
  parent: Parent | null;
  onClose: () => void;
  onOpenLogModal: (parent: Parent) => void;
  onOpenGuidanceClearance: (student: Student) => void;
  onOpenPrintQFPAR01: (parent: Parent, student: Student | null) => void;
  onSendDirectNotification: (parent: Parent) => void;
}

export const ParentDetailModal: React.FC<ParentDetailModalProps> = ({
  parent,
  onClose,
  onOpenLogModal,
  onOpenGuidanceClearance,
  onOpenPrintQFPAR01,
  onSendDirectNotification,
}) => {
  const { students, involvements } = useApp();
  const [scheduleStudent, setScheduleStudent] = useState<Student | null>(null);

  if (!parent) return null;

  const linkedStudents = students.filter((s) => parent.studentIds.includes(s.id));
  const primaryStudent = linkedStudents[0] || null;
  const parentInvolvements = involvements.filter((inv) => inv.parentId === parent.id);

  const getTierColor = (tier: Parent['involvementStatus']) => {
    switch (tier) {
      case 'Highly Engaged':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Active':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Moderate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Needs Follow-up':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Inactive':
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-amber-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
                {parent.firstName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{parent.fullName}</h3>
                  <span className="text-xs text-amber-300 bg-white/10 px-2 py-0.5 rounded border border-amber-400/30">
                    {parent.respondentType}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mt-1">
                  <span>Doc Code: <strong className="text-white">QF-PAR-01</strong></span>
                  <span>·</span>
                  <span>Dept: <strong className="text-white">Parents’ Affairs and Relations</strong></span>
                  <span>·</span>
                  <span>Rev: <strong className="text-white">{parent.revNo}</strong></span>
                </div>
              </div>
            </div>

            {/* Involvement & Return Slip Pill */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-center shrink-0">
              <div className="text-[10px] text-blue-200 uppercase font-semibold tracking-wider">
                Involvement Rating
              </div>
              <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-amber-300 tabular-nums">
                  {parent.involvementScore}%
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getTierColor(parent.involvementStatus)}`}>
                  {parent.involvementStatus}
                </span>
              </div>
              <div className="text-[10px] text-emerald-300 mt-1 font-medium">
                ✓ Return Slip Logged ({parent.returnSlipVerifiedAt})
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            Contact: <span className="font-mono font-semibold text-slate-800">{parent.contactNumber}</span> · Email: <span className="font-medium text-slate-800">{parent.emailAddress}</span> · FB: <span className="text-blue-700">{parent.facebookAccount}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintQFPAR01(parent, primaryStudent)}
              className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#133c70] text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              Print Form QF-PAR-01
            </button>
            <button
              onClick={() => onOpenLogModal(parent)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              Log PTA Attendance
            </button>
            <button
              onClick={() => onSendDirectNotification(parent)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Send Alert / Email
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Form QF-PAR-01 Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PART 1A Details */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>PART 1A: Parent / Guardian Data</span>
                <span className="text-[10px] text-slate-500 font-normal">Respondent: {parent.respondentType}</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">Complete Address:</span>
                  <span className="font-medium text-slate-900">{parent.completeAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Civil Status & Sex:</span>
                  <span className="font-medium text-slate-900">{parent.civilStatus} · {parent.sex}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Educational Attainment:</span>
                  <span className="font-medium text-slate-900">{parent.educationalAttainment}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Religious Affiliation:</span>
                  <span className="font-medium text-slate-900">{parent.religiousAffiliation}</span>
                </div>
              </div>

              {/* Employment & Socioeconomic */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Employment Status:</span>
                    <span className="font-bold text-slate-900">
                      {parent.employmentStatus} {parent.employmentType ? `(${parent.employmentType})` : ''}
                    </span>
                  </div>
                  {parent.affiliation && (
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      {parent.affiliation} Sector
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Socio-Economic Bracket (Monthly Income):</span>
                  <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                    {parent.socioEconomicStatus}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Nature of Work:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {parent.natureOfWork.map((w) => (
                      <span key={w} className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {parent.nameOfEmployer && (
                  <div className="text-[11px]">
                    <span className="text-slate-400 text-[10px] block">Employer & Workplace:</span>
                    <span className="font-medium text-slate-900">{parent.nameOfEmployer}</span>
                    <span className="text-slate-500 block text-[10px]">{parent.addressOfEmployer}</span>
                  </div>
                )}

                {parent.unemployedSourceOfIncome && (
                  <div className="text-[10px] bg-amber-50 p-2 rounded border border-amber-200 text-amber-900">
                    <strong>Financial Support / Assistance:</strong> {parent.unemployedSourceOfIncome}
                  </div>
                )}

                <div>
                  <span className="text-slate-400 text-[10px] block">Special Skills:</span>
                  <span className="italic text-slate-800">{parent.specialSkills || 'None listed'}</span>
                </div>
              </div>
            </div>

            {/* PART 1B: Spouse Information */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-100 pb-2">
                PART 1B: Spouse Information
              </h4>

              {parent.spouse.hasSpouse ? (
                <div className="space-y-2 text-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Name of Spouse:</span>
                      <span className="font-bold text-slate-900">{parent.spouse.nameOfSpouse}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Educational Attainment:</span>
                      <span className="font-medium text-slate-900">{parent.spouse.educationalAttainment}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Contact Number:</span>
                      <span className="font-mono text-slate-900">{parent.spouse.contactNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Facebook:</span>
                      <span className="text-blue-700">{parent.spouse.facebookAccount}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Employment & Affiliation:</span>
                    <span className="font-bold text-slate-900">{parent.spouse.employmentStatus}</span>
                    {parent.spouse.affiliation && ` · ${parent.spouse.affiliation} Sector`}
                  </div>

                  {parent.spouse.natureOfWork && parent.spouse.natureOfWork.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-[10px] block">Nature of Work (Spouse):</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {parent.spouse.natureOfWork.map((w) => (
                          <span key={w} className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {parent.spouse.nameOfEmployer && (
                    <div className="text-[11px]">
                      <span className="text-slate-400 text-[10px] block">Employer:</span>
                      <span className="font-medium text-slate-900">{parent.spouse.nameOfEmployer}</span>
                      <span className="text-slate-500 block text-[10px]">{parent.spouse.addressOfEmployer}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 text-[10px] block">Special Skills:</span>
                    <span className="italic text-slate-800">{parent.spouse.specialSkills || 'None'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 italic">
                  Not applicable / Single parent family.
                </div>
              )}
            </div>
          </div>

          {/* PART 2: Linked Student & Children's Moral Values */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#0b2545]" /> PART 2: Student Academic & Moral Values Record ({linkedStudents.length})
            </h4>

            {linkedStudents.map((stud) => (
              <div key={stud.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{stud.fullName}</span>
                      <span className="font-mono text-[11px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        {stud.studentNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {stud.courseYearSection}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Campus: <strong className="text-slate-800">{stud.campus} Campus</strong>
                      {stud.college && ` · ${stud.college}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setScheduleStudent(stud)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1 border border-emerald-200 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      Class Schedule
                    </button>
                    <button
                      onClick={() => onOpenGuidanceClearance(stud)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                      Guidance Certificate
                    </button>
                  </div>
                </div>

                {/* Moral Values Assessment Box */}
                <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#0b2545] uppercase text-[10px] tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Moral Character & Core Values Standing
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {stud.moralValues.overallStanding}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Integrity</div>
                      <div className="font-bold text-slate-900 mt-0.5">{stud.moralValues.integrity.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Respect & Decorum</div>
                      <div className="font-bold text-slate-900 mt-0.5">{stud.moralValues.respectAndDecorum.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Social Responsibility</div>
                      <div className="font-bold text-slate-900 mt-0.5">{stud.moralValues.socialResponsibility.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Craftsmanship</div>
                      <div className="font-bold text-slate-900 mt-0.5">{stud.moralValues.diligenceAndCraftsmanship.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Faith & Spirit</div>
                      <div className="font-bold text-slate-900 mt-0.5">{stud.moralValues.spiritualityAndFaith.toFixed(1)}/5.0</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <strong>Counselor Guidance Notes:</strong> {stud.moralValues.guidanceNotes}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PTA Involvement & Assembly Logs */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" /> Parent Involvement & Assembly Logs ({parentInvolvements.length})
            </h4>

            {parentInvolvements.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-slate-500">
                No meeting records logged yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {parentInvolvements.map((inv) => (
                  <div key={inv.id} className="p-3 flex items-start justify-between gap-2 hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900">{inv.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {inv.date} · {inv.type} · Verified by: <span className="font-medium text-slate-700">{inv.verifiedBy}</span>
                      </div>
                      {inv.feedback && (
                        <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded">
                          "{inv.feedback}"
                        </p>
                      )}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {scheduleStudent && (
        <SchedulePrintModal
          isOpen={!!scheduleStudent}
          onClose={() => setScheduleStudent(null)}
          student={scheduleStudent}
          schedule={getScheduleForStudent(scheduleStudent)}
          parentName={parent.fullName}
        />
      )}
    </div>
  );
};
