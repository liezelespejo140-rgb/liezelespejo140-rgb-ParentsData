import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  ShieldCheck,
  Award,
  Calendar,
  Users,
  Bell,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
  Check,
  MessageSquare,
  Sparkles,
  HeartHandshake,
  Printer,
  BookOpen,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Parent } from '../../types';
import { ChildScheduleSection } from '../ChildScheduleSection';
import { getScheduleForStudent, getCurrentOrNextClass } from '../../data/studentSchedules';

interface ParentDashboardViewProps {
  onOpenGuidanceClearance: (student: Student) => void;
  onOpenConsultationModal: (student: Student) => void;
  onOpenPrintModal?: (parent: Parent, student: Student | null) => void;
}

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  onOpenGuidanceClearance,
  onOpenConsultationModal,
  onOpenPrintModal,
}) => {
  const {
    currentUser,
    parents,
    students,
    events,
    notifications,
    involvements,
    selectedStudentId,
    setSelectedStudentId,
    toggleEventRSVP,
    markNotificationRead,
    setActiveView,
  } = useApp();

  const currentParent = parents.find((p) => p.id === currentUser.parentId) || parents[0];
  const linkedStudents = students.filter((s) => currentParent.studentIds.includes(s.id));
  const activeStudent =
    linkedStudents.find((s) => s.id === selectedStudentId) || linkedStudents[0] || students[0];

  const activeSchedule = getScheduleForStudent(activeStudent);
  const { todayName, todayClasses, currentClass } = getCurrentOrNextClass(activeSchedule);

  const parentInvolvements = involvements.filter((i) => i.parentId === currentParent.id);

  const getStandingColor = (standing: Student['guidanceStanding']) => {
    switch (standing) {
      case 'Exemplary Moral Character':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Good Moral Standing':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'Special Commendation':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'Under Routine Advisement':
        return 'text-sky-800 bg-sky-50 border-sky-200';
      case 'Developing Core Values':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Attendance Intervention':
      case 'Requires Parent Dialogue':
      case 'Values Guidance Required':
        return 'text-rose-800 bg-rose-50 border-rose-200 font-bold';
      default:
        return 'text-slate-800 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* University Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-[#0b2545] text-white">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/isat_u_campus_hall_1792048182513.jpg"
            alt="ISAT U Campus"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Iloilo Science and Technology University · Guidance & Parent Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Welcome, {currentParent.fullName}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Monitoring your child's moral conduct, behavioral wellness, class attendance, and guidance counseling inventory at ISAT U.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-blue-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                Registered Contact: <strong className="text-white">{currentParent.contactNumber}</strong>
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                Notification Channel: <strong className="text-white uppercase">{currentParent.preferredNotification}</strong>
              </span>
            </div>
          </div>

          {/* Quick Involvement Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center shrink-0 min-w-[200px]">
            <div className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">
              Your Involvement Score
            </div>
            <div className="text-3xl font-extrabold text-amber-300 mt-1 tabular-nums">
              {currentParent.involvementScore}%
            </div>
            <div className="text-[11px] text-white font-medium mt-0.5">
              Tier: <span className="text-amber-300 font-bold">{currentParent.involvementStatus}</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${currentParent.involvementScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Selector Switcher (if parent has multiple students) */}
      {linkedStudents.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl max-w-fit">
          <span className="text-xs font-semibold text-slate-600 px-2">Enrolled Children:</span>
          {linkedStudents.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                s.id === activeStudent.id
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              {s.fullName} ({s.program.split(' ')[0]})
            </button>
          ))}
        </div>
      )}

      {/* Primary 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Guidance Record, Behavioral Wellness & Counseling (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Official Document QF-PAR-01 & Verified Return Slip Card */}
          <div className="bg-white rounded-2xl border-2 border-blue-900/20 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-blue-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono">
                      Document Code: QF-PAR-01
                    </span>
                    <span className="text-[10px] text-slate-500">Rev. 02 · April 15, 2026</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    Parent’s/Guardian’s Data Form & Verified Return Slip
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Verified on File
                </span>
                {onOpenPrintModal && (
                  <button
                    onClick={() => onOpenPrintModal(currentParent, activeStudent)}
                    className="px-3.5 py-1.5 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" /> Print Return Slip
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-medium">Return Slip Code:</span>
                <span className="font-mono font-bold text-slate-800">{currentParent.returnSlipCode || 'PAR-2026-00101'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-medium">Income Bracket:</span>
                <span className="font-semibold text-slate-800">{currentParent.socioEconomicStatus}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-medium">Registered SMS Mobile:</span>
                <span className="font-medium text-slate-800 tabular-nums">{currentParent.contactNumber}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-medium">Needs Assessment:</span>
                <button
                  onClick={() => setActiveView('needs_assessment')}
                  className="font-bold text-blue-700 hover:text-blue-900 underline"
                >
                  View QP-PAR 02
                </button>
              </div>
            </div>
          </div>

          {/* Student Guidance Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{activeStudent.fullName}</h2>
                  <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    {activeStudent.studentNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {activeStudent.program} · <span className="font-semibold text-slate-800">{activeStudent.yearLevel} ({activeStudent.section})</span>
                </div>
                <div className="text-[11px] text-blue-700 mt-0.5">
                  {activeStudent.college}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('child-schedule-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  Class Schedule ({activeSchedule.length})
                </button>
                <button
                  onClick={() => onOpenGuidanceClearance(activeStudent)}
                  className="px-3.5 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  View Guidance Clearance
                </button>
                <button
                  onClick={() => onOpenConsultationModal(activeStudent)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Book Counselor
                </button>
              </div>
            </div>

            {/* Guidance KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Moral & Guidance Standing
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1.5">
                  <span className={`px-2 py-0.5 rounded border ${getStandingColor(activeStudent.guidanceStanding)}`}>
                    {activeStudent.guidanceStanding}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  0 Disciplinary Infractions
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Class Attendance Rate
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {activeStudent.overallAttendanceRate}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {activeStudent.totalAbsences} Total Absences ({activeStudent.excusedAbsences} Excused)
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Conduct & Decorum
                </div>
                <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  {activeStudent.behavioralRating} Conduct
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Peer Collaboration & Ethics
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Guidance Clearance
                </div>
                <div className="text-base font-bold text-blue-900 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {activeStudent.guidanceClearanceStatus}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Annual Student Inventory
                </div>
              </div>
            </div>

            {/* Attendance or counseling alert callout if applicable */}
            {activeStudent.guidanceStanding === 'Requires Parent Dialogue' && (
              <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Urgent Guidance Advisory: </strong>
                  The Guidance and Counseling Center has requested a parent-counselor dialogue regarding shop class attendance thresholds ({activeStudent.overallAttendanceRate}%). Please book a consultation using the button above.
                </div>
              </div>
            )}
          </div>

          {/* Child's Academic & Class Schedule on Parents Wall */}
          <div id="child-schedule-section">
            <ChildScheduleSection
              student={activeStudent}
              parent={currentParent}
            />
          </div>

          {/* Verified Counseling Sessions Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-700" /> Individual Counseling & Guidance Inventory Sessions
                </h3>
                <p className="text-xs text-slate-500">
                  Official counseling records logged by Registered Guidance Counselors (RGC)
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                {activeStudent.counselingRecords.length} Sessions on File
              </span>
            </div>

            <div className="p-4 space-y-3">
              {activeStudent.counselingRecords.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No counseling interventions on record. Student has completed routine orientation.
                </div>
              ) : (
                activeStudent.counselingRecords.map((coun) => (
                  <div
                    key={coun.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {coun.category}
                          </span>
                          <span className="text-[10px] text-slate-500 tabular-nums">
                            {coun.date} {coun.time && `· ${coun.time}`}
                          </span>
                        </div>
                        <div className="text-[11px] text-blue-700 font-medium mt-0.5">
                          Counselor: {coun.counselorName}
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-800 border-blue-200 shrink-0">
                        {coun.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100 space-y-1.5">
                      <p className="leading-relaxed">
                        <strong className="text-slate-900">Session Summary: </strong>
                        {coun.summary}
                      </p>
                      <div className="pt-1.5 border-t border-slate-100 text-blue-900 text-[11px]">
                        <strong>Prescribed Action Plan: </strong>
                        {coun.actionPlan}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Strengths & Recommended Home Support Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Observed Character Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeStudent.studentStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-blue-600" /> Recommended Parent Home Support
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeStudent.recommendedParentSupport.map((sup, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{sup}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assigned Counselor Office Card */}
          <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                {activeStudent.counselor.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Assigned Guidance Counselor: {activeStudent.counselor.name}
                </div>
                <div className="text-[11px] text-slate-600">
                  {activeStudent.counselor.office} · {activeStudent.counselor.contact}
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenConsultationModal(activeStudent)}
              className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              Request Consultation
            </button>
          </div>
        </div>

        {/* Right Column: Today's Schedule, Events, Involvement & Notification Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Schedule Widget for Parents */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  Today's Classes ({todayName})
                </h3>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('child-schedule-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-0.5"
              >
                Full Timetable <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-500 mb-3">
              Enrolled Schedule for <strong className="text-slate-800">{activeStudent.firstName}</strong> ({activeStudent.courseYearSection})
            </div>

            {todayClasses.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
                <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                No classes scheduled for today ({todayName}). Free for study & values guidance.
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayClasses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-blue-950">{c.subjectCode}</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                        {c.startTime}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                      {c.subjectTitle}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3 h-3 text-amber-600" /> {c.room}
                      </span>
                      <span className="text-blue-900 font-semibold truncate max-w-[160px]" title={c.instructor}>
                        Faculty: {c.instructor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Activities & Events for Parents */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" /> Upcoming School Events
              </h3>
              <button
                onClick={() => setActiveView('events')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {event.title}
                    </span>
                    {event.isMandatory && (
                      <span className="text-[9px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded shrink-0">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400" /> {event.date}
                    </span>
                    <button
                      onClick={() => toggleEventRSVP(event.id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> RSVP ({event.rsvpCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Push & Email Notifications Bulletin */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" /> University Bulletins
              </h3>
              <button
                onClick={() => setActiveView('notifications')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                All Bulletins
              </button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => {
                const isRead = notif.readByParentIds.includes(currentParent.id);
                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      !isRead
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 line-clamp-1">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                        {notif.sentAt.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="uppercase text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {notif.channel}
                      </span>
                      {!isRead ? (
                        <span className="text-amber-700 font-bold">Unread</span>
                      ) : (
                        <span className="text-slate-400">Read</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parent Involvement History Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" /> PTA Attendance Log
              </h3>
              <button
                onClick={() => setActiveView('involvement')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                View History
              </button>
            </div>

            {parentInvolvements.length === 0 ? (
              <div className="text-xs text-slate-500 py-2">
                No PTA meeting records logged yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {parentInvolvements.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="text-xs flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1">{inv.title}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums">{inv.date}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
