import React, { useState } from 'react';
import { Student, ClassScheduleItem, DayOfWeek, Parent } from '../types';
import {
  DAYS_OF_WEEK,
  getClassesForDay,
  calculateTotalUnits,
  getCurrentOrNextClass,
  getScheduleForStudent
} from '../data/studentSchedules';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Printer,
  BookOpen,
  CheckCircle,
  Layers,
  GraduationCap,
  Building2,
  ShieldCheck,
  Mail,
  HelpCircle,
  Info
} from 'lucide-react';
import { SchedulePrintModal } from './SchedulePrintModal';
import { MISEDPInquiryModal } from './MISEDPInquiryModal';

interface ChildScheduleSectionProps {
  student: Student;
  parent: Parent;
}

export const ChildScheduleSection: React.FC<ChildScheduleSectionProps> = ({
  student,
  parent,
}) => {
  const schedule = getScheduleForStudent(student);
  const { total, labUnits, lecUnits } = calculateTotalUnits(schedule);
  const { currentClass, nextClass, todayName, todayClasses } = getCurrentOrNextClass(schedule);

  const [activeTab, setActiveTab] = useState<'day' | 'matrix' | 'list'>('day');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayName);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const dayClasses = getClassesForDay(schedule, selectedDay);

  const getThemeClasses = (theme?: string) => {
    switch (theme) {
      case 'emerald':
        return 'border-l-4 border-l-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70';
      case 'purple':
        return 'border-l-4 border-l-purple-500 bg-purple-50/40 hover:bg-purple-50/70';
      case 'amber':
        return 'border-l-4 border-l-amber-500 bg-amber-50/40 hover:bg-amber-50/70';
      case 'rose':
        return 'border-l-4 border-l-rose-500 bg-rose-50/40 hover:bg-rose-50/70';
      case 'indigo':
        return 'border-l-4 border-l-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70';
      case 'sky':
        return 'border-l-4 border-l-sky-500 bg-sky-50/40 hover:bg-sky-50/70';
      case 'blue':
      default:
        return 'border-l-4 border-l-blue-600 bg-blue-50/40 hover:bg-blue-50/70';
    }
  };

  const getTypeBadge = (type: ClassScheduleItem['type']) => {
    switch (type) {
      case 'Laboratory':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Lecture':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shop':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PE/NSTP':
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-900/20 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#103565] to-[#0b2545] p-5 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                  Parents Wall · Student Class Schedule
                </span>
                <span className="text-xs text-blue-200">
                  {student.academicYear} · {student.currentSemester}
                </span>
                <span className="text-[10px] bg-white/10 text-emerald-300 px-2 py-0.5 rounded border border-white/20 font-medium">
                  Read-Only Parent Access
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
                Class Timetable: {student.fullName}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {student.program} · Section <strong className="text-amber-300">{student.courseYearSection}</strong> · {student.campus}
              </p>
            </div>
          </div>

          {/* Action Controls for Parents */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print Study Load / COM
            </button>

            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              MIS/EDP Collaboration Guidelines & Inquiries
            </button>
          </div>
        </div>

        {/* Live Today's Class Bar */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-blue-100 font-medium">
              Today is <strong className="text-white">{todayName}</strong>: {todayClasses.length} {todayClasses.length === 1 ? 'class' : 'classes'} scheduled
            </span>
          </div>

          {todayClasses.length > 0 && currentClass && (
            <div className="text-[11px] text-amber-200 bg-white/10 px-3 py-1 rounded-lg border border-white/15 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-300">Active / Next Class:</span>
              <span className="font-bold text-white font-mono">{currentClass.subjectCode}</span>
              <span>· {currentClass.startTime} ({currentClass.room})</span>
              <span className="text-blue-100 truncate">· Faculty: {currentClass.instructor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Policy Notice Banner: MIS/EDP Collaboration Rule */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-snug">
            <strong>Management Information System / Electronic Data Processing (MIS/EDP) Policy: </strong>
            Adding, Changing, and Dropping of subjects is collaborated exclusively with the MIS/EDP Office and University Registrar (Form QF-REG-03). Parents are provided official read-only schedule visibility of their child's classes and designated faculty instructors.
          </p>
        </div>
        <button
          onClick={() => setIsInquiryModalOpen(true)}
          className="text-[11px] text-blue-900 font-bold hover:underline whitespace-nowrap shrink-0 flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          View Collaboration Steps
        </button>
      </div>

      {/* View Switcher Tabs & Academic Totals Bar */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('day')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'day'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-700" />
            Day Schedule
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Weekly Grid
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-700" />
            Subject & Faculty Directory ({schedule.length})
          </button>
        </div>

        {/* Academic Load Stats */}
        <div className="flex items-center gap-3 text-slate-600">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            Total Load: <strong className="text-slate-900 font-mono">{total.toFixed(1)} Units</strong>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 hidden md:inline">
            Lab/Shop: <strong className="text-emerald-700 font-mono">{labUnits.toFixed(1)}u</strong> · Lec:{' '}
            <strong className="text-blue-700 font-mono">{lecUnits.toFixed(1)}u</strong>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6">
        {/* TAB 1: DAY SCHEDULE (Chronological cards with day pills) */}
        {activeTab === 'day' && (
          <div className="space-y-4">
            {/* Days of Week Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DAYS_OF_WEEK.map((day) => {
                const count = getClassesForDay(schedule, day).length;
                const isSelected = selectedDay === day;
                const isToday = todayName === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#0b2545] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{day}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {count}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Today" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Classes for Selected Day */}
            {dayClasses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Academic Classes on {selectedDay}</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Your child has no scheduled classes for this day. This period can be utilized for library research, homework, or scheduled faculty consultation during designated office hours.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Subject adjustments can only be processed via MIS/EDP Office (Form QF-REG-03)
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'} for{' '}
                    <strong className="text-slate-800">{selectedDay}</strong>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Verified by MIS/EDP · Enrolled in Student Information System
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {dayClasses.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border border-slate-200 shadow-xs transition-all ${getThemeClasses(
                        item.colorTheme
                      )} flex flex-col justify-between gap-3`}
                    >
                      <div>
                        {/* Time & Type Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-mono font-bold text-xs text-slate-900 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-blue-700" />
                            {item.startTime} – {item.endTime}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadge(
                                item.type
                              )}`}
                            >
                              {item.type}
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                              {item.units} Units
                            </span>
                          </div>
                        </div>

                        {/* Subject Code & Title */}
                        <div className="mt-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-950 text-sm">
                              {item.subjectCode}
                            </span>
                            {item.enrollmentStatus && (
                              <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-200">
                                {item.enrollmentStatus}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 leading-snug">
                            {item.subjectTitle}
                          </h4>
                        </div>
                      </div>

                      {/* Prominent Faculty Information & Room Details (Read-only for parents) */}
                      <div className="pt-3 border-t border-slate-200/90 space-y-2 text-xs">
                        {/* Faculty In-Charge Block */}
                        <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                            <User className="w-3 h-3 text-blue-700" />
                            Faculty Teaching This Subject:
                          </div>
                          <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                            <span>{item.instructor}</span>
                            {item.instructorEmail && (
                              <a
                                href={`mailto:${item.instructorEmail}`}
                                className="text-blue-700 hover:underline text-[10px] flex items-center gap-1 font-normal"
                              >
                                <Mail className="w-2.5 h-2.5" />
                                Email Faculty
                              </a>
                            )}
                          </div>
                          {item.facultyTitle && (
                            <div className="text-[10px] text-slate-600 font-medium">
                              {item.facultyTitle}
                              {item.facultyDepartment && ` · ${item.facultyDepartment}`}
                            </div>
                          )}
                          {item.consultationHours && (
                            <div className="text-[10px] text-amber-900/90 bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200/50 mt-1">
                              <strong>Consultation Hours:</strong> {item.consultationHours}
                            </div>
                          )}
                        </div>

                        {/* Room & Building Location */}
                        <div className="flex items-center justify-between text-slate-700 text-[11px] px-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="font-semibold text-slate-900">{item.room}</span>
                            {item.building && (
                              <span className="text-slate-500 truncate">· {item.building}</span>
                            )}
                          </div>
                          {item.edpControlNumber && (
                            <span className="text-[9px] font-mono text-slate-400 shrink-0">
                              Ref: {item.edpControlNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WEEKLY GRID MATRIX */}
        {activeTab === 'matrix' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="p-3 w-28">Day</th>
                  <th className="p-3">Morning Classes (07:30 AM – 12:00 PM)</th>
                  <th className="p-3">Afternoon Classes (01:00 PM – 05:00 PM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {DAYS_OF_WEEK.map((day) => {
                  const dClasses = getClassesForDay(schedule, day);
                  const morning = dClasses.filter((c) => c.startTime.includes('AM'));
                  const afternoon = dClasses.filter((c) => c.startTime.includes('PM'));
                  const isToday = todayName === day;

                  return (
                    <tr
                      key={day}
                      className={isToday ? 'bg-amber-50/40' : 'bg-white hover:bg-slate-50'}
                    >
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span>{day}</span>
                          {isToday && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {dClasses.length} courses
                        </span>
                      </td>

                      {/* Morning Column */}
                      <td className="p-2.5 border-r border-slate-100 align-top space-y-2">
                        {morning.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">No morning classes</span>
                        ) : (
                          morning.map((c) => (
                            <div
                              key={c.id}
                              className={`p-2.5 rounded-lg border text-xs ${getThemeClasses(
                                c.colorTheme
                              )} space-y-1`}
                            >
                              <div className="flex items-center justify-between gap-1 font-mono font-bold text-slate-900 text-[11px]">
                                <span>{c.subjectCode}</span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {c.startTime} – {c.endTime}
                                </span>
                              </div>
                              <div className="font-semibold text-slate-800 text-[11px]">
                                {c.subjectTitle}
                              </div>
                              <div className="text-[10px] text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200/60 mt-1">
                                <div className="font-bold text-blue-900 flex items-center gap-1">
                                  <User className="w-2.5 h-2.5" /> Faculty: {c.instructor}
                                </div>
                                <div className="text-slate-500 text-[9px]">{c.room} {c.building && `· ${c.building}`}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </td>

                      {/* Afternoon Column */}
                      <td className="p-2.5 align-top space-y-2">
                        {afternoon.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">No afternoon classes</span>
                        ) : (
                          afternoon.map((c) => (
                            <div
                              key={c.id}
                              className={`p-2.5 rounded-lg border text-xs ${getThemeClasses(
                                c.colorTheme
                              )} space-y-1`}
                            >
                              <div className="flex items-center justify-between gap-1 font-mono font-bold text-slate-900 text-[11px]">
                                <span>{c.subjectCode}</span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {c.startTime} – {c.endTime}
                                </span>
                              </div>
                              <div className="font-semibold text-slate-800 text-[11px]">
                                {c.subjectTitle}
                              </div>
                              <div className="text-[10px] text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200/60 mt-1">
                                <div className="font-bold text-blue-900 flex items-center gap-1">
                                  <User className="w-2.5 h-2.5" /> Faculty: {c.instructor}
                                </div>
                                <div className="text-slate-500 text-[9px]">{c.room} {c.building && `· ${c.building}`}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SUBJECT & FACULTY DIRECTORY MATRIX */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            {/* Mobile Cards View (Visible on phones & tablets < md) */}
            <div className="md:hidden space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 text-sm">
                          {item.subjectCode}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${getTypeBadge(item.type)}`}>
                          {item.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                        {item.subjectTitle}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        {item.units.toFixed(1)} Units
                      </span>
                    </div>
                  </div>

                  {/* Day, Time & Room */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-medium text-slate-900">
                      {item.days.map((d) => d.slice(0, 3)).join('/')} {item.startTime} – {item.endTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      {item.room} {item.building && `· ${item.building}`}
                    </span>
                  </div>

                  {/* Faculty Information Box */}
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-700" />
                      Faculty Teaching This Subject:
                    </div>
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>{item.instructor}</span>
                      {item.instructorEmail && (
                        <a
                          href={`mailto:${item.instructorEmail}`}
                          className="text-blue-700 underline text-[10px] font-normal"
                        >
                          Email
                        </a>
                      )}
                    </div>
                    {item.facultyTitle && (
                      <div className="text-[10px] text-slate-600">
                        {item.facultyTitle}
                        {item.facultyDepartment && ` · ${item.facultyDepartment}`}
                      </div>
                    )}
                    {item.consultationHours && (
                      <div className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        <strong>Consultation:</strong> {item.consultationHours}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="p-3.5 bg-slate-100 rounded-xl text-center font-bold text-slate-900 text-xs">
                Total Enrolled Academic Load: {total.toFixed(1)} Units ({schedule.length} Courses)
              </div>
            </div>

            {/* Desktop Table View (Hidden on mobile < md) */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Description</th>
                    <th className="p-3">Schedule & Room</th>
                    <th className="p-3">Faculty / Instructor Teaching Subject</th>
                    <th className="p-3 text-center">Units</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {schedule.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                        {item.subjectCode}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div>{item.subjectTitle}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border mt-1 inline-block ${getTypeBadge(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {item.days.map((d) => d.slice(0, 3)).join('/')} {item.startTime} – {item.endTime}
                        </div>
                        <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{item.room}</span>
                          {item.building && <span className="text-slate-400">· {item.building}</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>{item.instructor}</span>
                        </div>
                        {item.facultyTitle && (
                          <div className="text-[10px] text-slate-600 font-medium">
                            {item.facultyTitle}
                          </div>
                        )}
                        {item.instructorEmail && (
                          <div className="text-[10px] text-blue-700 font-mono">
                            {item.instructorEmail}
                          </div>
                        )}
                        {item.consultationHours && (
                          <div className="text-[9px] text-amber-900 mt-0.5">
                            Consultation: {item.consultationHours}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-900 tabular-nums">
                        {item.units.toFixed(1)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                          {item.enrollmentStatus || 'Enrolled · SIS Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={4} className="p-3 text-right uppercase text-[10px]">
                      Total Academic Enrolled Load:
                    </td>
                    <td className="p-3 text-center text-sm font-black text-blue-950">
                      {total.toFixed(1)}
                    </td>
                    <td className="p-3 text-center text-xs text-slate-500">
                      {schedule.length} Enrolled Courses
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Academic Adviser & Parental Monitoring Strip */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-900 block tracking-wider">
                Assigned Academic Adviser:
              </span>
              <span className="font-bold text-slate-900">
                {student.academicAdviser?.name || 'Prof. Arthur Magbanua, MIT, RGC'}
              </span>
              <div className="text-[11px] text-slate-600">
                {student.academicAdviser?.office || 'CICT Faculty Office Room 301'} ·{' '}
                <a
                  href={`mailto:${student.academicAdviser?.email || 'guidance.cict@isatu.edu.ph'}`}
                  className="text-blue-700 underline font-medium"
                >
                  Contact Adviser
                </a>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-900 block tracking-wider">
                MIS / EDP Office Schedule Endorsement:
              </span>
              <span className="text-[11px] text-slate-700 leading-relaxed">
                For changes in subject load, consult your College Dean and the MIS/EDP Office (2nd Flr Admin Bldg). Parents hold official read-only schedule visibility.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Modals */}
      <SchedulePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        student={student}
        schedule={schedule}
        parentName={parent.fullName}
      />

      <MISEDPInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        student={student}
        parent={parent}
        schedule={schedule}
      />
    </div>
  );
};
