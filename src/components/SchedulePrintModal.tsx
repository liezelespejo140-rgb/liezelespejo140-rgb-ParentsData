import React from 'react';
import { Student, ClassScheduleItem } from '../types';
import { calculateTotalUnits, DAYS_OF_WEEK } from '../data/studentSchedules';
import { X, Printer, Download, CheckCircle, ShieldCheck, MapPin, User, Clock } from 'lucide-react';

interface SchedulePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  schedule: ClassScheduleItem[];
  parentName: string;
}

export const SchedulePrintModal: React.FC<SchedulePrintModalProps> = ({
  isOpen,
  onClose,
  student,
  schedule,
  parentName,
}) => {
  if (!isOpen) return null;

  const { total, labUnits, lecUnits } = calculateTotalUnits(schedule);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Controls Toolbar (hidden during print) */}
        <div className="print:hidden bg-[#0b2545] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">
              Official Student Schedule
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white print:p-0 print:m-0">
          {/* Official University Header */}
          <div className="text-center border-b-2 border-blue-950 pb-4 relative">
            <div className="flex items-center justify-center gap-4">
              <img
                src="/src/assets/images/regenerated_image_1792130220954.png"
                alt="ISAT U Seal"
                className="w-16 h-16 object-contain shrink-0"
              />
              <div className="text-center">
                <div className="text-[11px] font-serif tracking-widest text-slate-600 uppercase">
                  Republic of the Philippines
                </div>
                <h1 className="text-base sm:text-lg font-serif font-black tracking-wider text-blue-950 uppercase">
                  Iloilo Science and Technology University
                </h1>
                <div className="text-xs text-slate-700 font-medium">
                  La Paz, Iloilo City, Philippines · Web: www.isatu.edu.ph
                </div>
                <div className="text-xs font-semibold text-blue-900 mt-1 uppercase tracking-wide">
                  Office of the University Registrar · Parents’ Affairs & Relations Office
                </div>
              </div>
            </div>

            <div className="mt-3 inline-block bg-blue-950 text-amber-300 px-4 py-1 rounded text-xs font-bold uppercase tracking-widest">
              Official Student Schedule
            </div>
          </div>

          {/* Student & Term Identification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Student Name:
              </span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Student ID No.:
              </span>
              <span className="font-mono font-bold text-blue-900">{student.studentNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Program & Year / Section:
              </span>
              <span className="font-bold text-slate-900">{student.courseYearSection}</span>
              <div className="text-[10px] text-slate-600">{student.program}</div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Campus / College:
              </span>
              <span className="font-bold text-slate-900">{student.campus}</span>
              <div className="text-[10px] text-slate-600">{student.collegeCode || 'Main'}</div>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Academic Year / Term:
              </span>
              <span className="font-bold text-slate-900">
                {student.academicYear} · {student.currentSemester}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Registered Parent / Guardian:
              </span>
              <span className="font-semibold text-slate-800">{parentName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Academic Adviser:
              </span>
              <span className="font-semibold text-slate-800">
                {student.academicAdviser?.name || student.counselor.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">
                Total Enrolled Units:
              </span>
              <span className="font-bold text-emerald-800">
                {total.toFixed(1)} Units ({lecUnits.toFixed(1)} Lec / {labUnits.toFixed(1)} Lab)
              </span>
            </div>
          </div>

          {/* Enrolled Courses Schedule Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs border-collapse min-w-[720px] print:min-w-0">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Descriptive Course Title</th>
                  <th className="py-2.5 px-3">Day(s)</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Room / Building</th>
                  <th className="py-2.5 px-3">Faculty / Instructor Teaching Subject</th>
                  <th className="py-2.5 px-3 text-center">Units</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schedule.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {item.subjectCode}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div>{item.subjectTitle}</div>
                      {item.enrollmentStatus && (
                        <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                          {item.enrollmentStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {item.days.map((d) => d.slice(0, 3)).join(' / ')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {item.startTime} – {item.endTime}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">
                      <div className="font-medium">{item.room}</div>
                      {item.building && (
                        <div className="text-[10px] text-slate-500">{item.building}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">
                      <div className="font-bold text-slate-900">{item.instructor}</div>
                      {item.facultyTitle && (
                        <div className="text-[10px] text-slate-600">{item.facultyTitle}</div>
                      )}
                      {item.instructorEmail && (
                        <div className="text-[9px] text-blue-700 font-mono">{item.instructorEmail}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                      {item.units.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={6} className="py-2.5 px-3 text-right uppercase text-[10px]">
                    Total Academic Credit Units Enrolled:
                  </td>
                  <td className="py-2.5 px-3 text-center text-sm text-blue-950 font-black">
                    {total.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-[10px] text-slate-600">
                    {schedule.length} Subjects
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* MIS / EDP Official Coordination Clause & Parental Monitoring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-700" />
                Parents’ Affairs & Guidance Monitoring:
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                This schedule is officially filed under the ISAT U Parents’ Affairs and Relations (PAR) Office. Class attendance is continuously monitored. In the event of two (2) unexcused absences, parents are notified via registered SMS and email advisory.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                MIS / EDP Office Enrollment Verification:
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                Adding, Changing, and Dropping of subjects is collaborated exclusively with the MIS/EDP Office and University Registrar (Form QF-REG-03). Parents hold official read-only schedule visibility of verified courses and assigned teaching faculty.
              </p>
            </div>
          </div>

          {/* Signatures & Certification Block */}
          <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">{student.fullName}</div>
              <div className="text-[10px] text-slate-500 uppercase">Student’s Signature</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">
                {student.academicAdviser?.name || 'Prof. Arthur Magbanua, RGC'}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Program Adviser / Chairperson</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">Dr. Nelo V. Magbanua, Ed.D.</div>
              <div className="text-[10px] text-slate-500 uppercase">Director, Parents’ Affairs & Relations</div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-100 flex items-center justify-between">
            <span>Doc Ref: ISATU-PAR-SCHED-2026</span>
            <span>Printed via ISAT U Parents’ Web-based Management Portal (PGWBMS)</span>
            <span>Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
