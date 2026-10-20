import React, { useState } from 'react';
import { Student, ClassScheduleItem, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../data/studentSchedules';
import { useApp } from '../context/AppContext';
import {
  X,
  Building2,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface MISEDPScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  schedule: ClassScheduleItem[];
  onAddClass: (item: Omit<ClassScheduleItem, 'id'>) => void;
  onUpdateSchedule: (studentId: string, updatedSchedule: ClassScheduleItem[]) => void;
}

export const MISEDPScheduleModal: React.FC<MISEDPScheduleModalProps> = ({
  isOpen,
  onClose,
  student,
  schedule,
  onAddClass,
  onUpdateSchedule,
}) => {
  const { dispatchNotification, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'add' | 'change' | 'drop' | 'policy'>('add');

  // Form states for ADDING subject
  const [addSubjectCode, setAddSubjectCode] = useState('');
  const [addSubjectTitle, setAddSubjectTitle] = useState('');
  const [addDays, setAddDays] = useState<DayOfWeek[]>(['Monday', 'Wednesday']);
  const [addStartTime, setAddStartTime] = useState('08:00 AM');
  const [addEndTime, setAddEndTime] = useState('09:30 AM');
  const [addRoom, setAddRoom] = useState('CICT Computer Lab 301');
  const [addBuilding, setAddBuilding] = useState('New Tech Building');
  const [addInstructor, setAddInstructor] = useState('');
  const [addFacultyTitle, setAddFacultyTitle] = useState('Associate Professor II');
  const [addFacultyDept, setAddFacultyDept] = useState('Department of Computer Studies');
  const [addInstructorEmail, setAddInstructorEmail] = useState('');
  const [addUnits, setAddUnits] = useState('3.0');
  const [addType, setAddType] = useState<ClassScheduleItem['type']>('Laboratory');
  const [addColorTheme, setAddColorTheme] = useState<ClassScheduleItem['colorTheme']>('blue');
  const [addRemarks, setAddRemarks] = useState('Approved by College Dean under Form QF-REG-03');

  // Form states for CHANGING subject
  const [changeTargetId, setChangeTargetId] = useState<string>(schedule[0]?.id || '');
  const [changeDays, setChangeDays] = useState<DayOfWeek[]>(['Monday', 'Wednesday']);
  const [changeStartTime, setChangeStartTime] = useState('10:00 AM');
  const [changeEndTime, setChangeEndTime] = useState('11:30 AM');
  const [changeRoom, setChangeRoom] = useState('');
  const [changeBuilding, setChangeBuilding] = useState('');
  const [changeInstructor, setChangeInstructor] = useState('');
  const [changeFacultyTitle, setChangeFacultyTitle] = useState('');
  const [changeFacultyDept, setChangeFacultyDept] = useState('');
  const [changeRemarks, setChangeRemarks] = useState('Section & schedule transfer processed by MIS/EDP');

  // Form states for DROPPING subject
  const [dropTargetId, setDropTargetId] = useState<string>(schedule[0]?.id || '');
  const [dropReason, setDropReason] = useState('Academic Overload / Unit Reduction');
  const [dropRemarks, setDropRemarks] = useState('Official QF-REG-03 Dropping Slip signed by Dean and Registrar');

  if (!isOpen) return null;

  const toggleAddDay = (day: DayOfWeek) => {
    setAddDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleChangeDay = (day: DayOfWeek) => {
    setChangeDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Sync Change fields when change target changes
  const handleSelectChangeSubject = (id: string) => {
    setChangeTargetId(id);
    const target = schedule.find((s) => s.id === id);
    if (target) {
      setChangeDays(target.days);
      setChangeStartTime(target.startTime);
      setChangeEndTime(target.endTime);
      setChangeRoom(target.room);
      setChangeBuilding(target.building || '');
      setChangeInstructor(target.instructor);
      setChangeFacultyTitle(target.facultyTitle || 'Assistant Professor I');
      setChangeFacultyDept(target.facultyDepartment || 'College Faculty');
    }
  };

  // Execute ADDING subject
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSubjectCode.trim() || !addSubjectTitle.trim() || addDays.length === 0) {
      alert('Please provide subject code, title, and at least one meeting day.');
      return;
    }

    const controlNo = `EDP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    onAddClass({
      subjectCode: addSubjectCode.trim().toUpperCase(),
      subjectTitle: addSubjectTitle.trim(),
      days: addDays,
      startTime: addStartTime.trim(),
      endTime: addEndTime.trim(),
      room: addRoom.trim() || 'TBA',
      building: addBuilding.trim() || undefined,
      instructor: addInstructor.trim() || 'Assigned Faculty',
      facultyTitle: addFacultyTitle.trim() || undefined,
      facultyDepartment: addFacultyDept.trim() || undefined,
      instructorEmail: addInstructorEmail.trim() || `${addInstructor.toLowerCase().replace(/[^a-z]/g, '') || 'faculty'}@isatu.edu.ph`,
      units: parseFloat(addUnits) || 3.0,
      type: addType,
      colorTheme: addColorTheme,
      enrollmentStatus: 'Added via MIS/EDP',
      edpControlNumber: controlNo,
      edpVerifiedAt: new Date().toISOString().split('T')[0],
    });

    dispatchNotification({
      title: 'MIS/EDP: Subject Added Successfully',
      body: `Subject ${addSubjectCode.toUpperCase()} (${addSubjectTitle}) has been encoded by MIS/EDP Office for ${student.fullName}. Ref: ${controlNo}. Parents wall schedule updated.`,
      channel: 'all',
      targetScope: 'all',
    });

    onClose();
  };

  // Execute CHANGING subject
  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = schedule.find((s) => s.id === changeTargetId);
    if (!target) {
      alert('Please select an enrolled subject to change.');
      return;
    }

    const controlNo = `EDP-CHG-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = schedule.map((item) => {
      if (item.id === changeTargetId) {
        return {
          ...item,
          days: changeDays.length > 0 ? changeDays : item.days,
          startTime: changeStartTime.trim() || item.startTime,
          endTime: changeEndTime.trim() || item.endTime,
          room: changeRoom.trim() || item.room,
          building: changeBuilding.trim() || item.building,
          instructor: changeInstructor.trim() || item.instructor,
          facultyTitle: changeFacultyTitle.trim() || item.facultyTitle,
          facultyDepartment: changeFacultyDept.trim() || item.facultyDepartment,
          enrollmentStatus: 'Changed via MIS/EDP' as const,
          edpControlNumber: controlNo,
          edpVerifiedAt: new Date().toISOString().split('T')[0],
        };
      }
      return item;
    });

    onUpdateSchedule(student.id, updated);

    dispatchNotification({
      title: 'MIS/EDP: Subject Schedule Changed',
      body: `Schedule & Faculty for ${target.subjectCode} updated by MIS/EDP Office (${changeRemarks}). Control: ${controlNo}.`,
      channel: 'all',
      targetScope: 'all',
    });

    onClose();
  };

  // Execute DROPPING subject
  const handleDropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = schedule.find((s) => s.id === dropTargetId);
    if (!target) {
      alert('Please select a subject to drop.');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to DROP ${target.subjectCode} (${target.subjectTitle}) for ${student.fullName} under official MIS/EDP protocol?`
      )
    ) {
      return;
    }

    const controlNo = `EDP-DRP-${Math.floor(1000 + Math.random() * 9000)}`;
    const remaining = schedule.filter((s) => s.id !== dropTargetId);
    onUpdateSchedule(student.id, remaining);

    dispatchNotification({
      title: 'MIS/EDP: Subject Dropped Officially',
      body: `Subject ${target.subjectCode} dropped for ${student.fullName} under Form QF-REG-03. Reason: ${dropReason}. Ref: ${controlNo}. Parents wall schedule synchronized.`,
      channel: 'all',
      targetScope: 'all',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b2545] via-[#103565] to-[#0b2545] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                  MIS / EDP Office Console
                </span>
                <span className="text-xs text-blue-200">
                  Electronic Data Processing · SIS Control
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg leading-tight mt-0.5">
                Adding, Changing & Dropping of Subjects
              </h3>
              <p className="text-xs text-blue-100">
                Student: <strong>{student.fullName}</strong> ({student.studentNumber}) · {student.courseYearSection}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'add'
                ? 'border-[#0b2545] text-[#0b2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            1. Add Subject
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('change');
              if (schedule.length > 0 && !changeTargetId) {
                handleSelectChangeSubject(schedule[0].id);
              }
            }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'change'
                ? 'border-[#0b2545] text-[#0b2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit className="w-3.5 h-3.5 text-blue-600" />
            2. Change Subject / Section
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('drop');
              if (schedule.length > 0 && !dropTargetId) {
                setDropTargetId(schedule[0].id);
              }
            }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'drop'
                ? 'border-rose-600 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            3. Drop Subject
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('policy')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'policy'
                ? 'border-[#0b2545] text-[#0b2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Institutional Policy
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* TAB 1: ADD SUBJECT */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">MIS/EDP Subject Addition Protocol (Form QF-REG-03): </strong>
                  Enter the course code, assigned faculty instructor, and timeslot. Once encoded, the course will be officially linked to {student.fullName}'s enrolled load and visible on the Parents Wall.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-800 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT 316"
                    value={addSubjectCode}
                    onChange={(e) => setAddSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold uppercase focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Subject Description / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Computing & Distributed Systems"
                    value={addSubjectTitle}
                    onChange={(e) => setAddSubjectTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
              </div>

              {/* Faculty Information (Required by User Brief) */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="font-bold text-blue-950 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  Assigned Faculty Instructor (Visible to Parents) *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Faculty Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Leo Villaruz, MIT"
                      value={addInstructor}
                      onChange={(e) => setAddInstructor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Faculty Academic Rank</label>
                    <input
                      type="text"
                      placeholder="e.g. Associate Professor II"
                      value={addFacultyTitle}
                      onChange={(e) => setAddFacultyTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Department of Computer Studies"
                      value={addFacultyDept}
                      onChange={(e) => setAddFacultyDept(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Faculty Email</label>
                    <input
                      type="email"
                      placeholder="e.g. leo.villaruz@isatu.edu.ph"
                      value={addInstructorEmail}
                      onChange={(e) => setAddInstructorEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Days */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Schedule Days *</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = addDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleAddDay(day)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[#0b2545] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time, Room & Units */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={addStartTime}
                    onChange={(e) => setAddStartTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">End Time</label>
                  <input
                    type="text"
                    value={addEndTime}
                    onChange={(e) => setAddEndTime(e.target.value)}
                    placeholder="09:30 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Units</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="6"
                    value={addUnits}
                    onChange={(e) => setAddUnits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Type</label>
                  <select
                    value={addType}
                    onChange={(e) => setAddType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Shop">Shop</option>
                    <option value="PE/NSTP">PE/NSTP</option>
                  </select>
                </div>
              </div>

              {/* Room & Building */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Room Assignment</label>
                  <input
                    type="text"
                    value={addRoom}
                    onChange={(e) => setAddRoom(e.target.value)}
                    placeholder="e.g. CICT Computer Lab 301"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Building</label>
                  <input
                    type="text"
                    value={addBuilding}
                    onChange={(e) => setAddBuilding(e.target.value)}
                    placeholder="e.g. New Information Tech Building"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>
              </div>

              {/* Authorization & Reference */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">MIS/EDP Encoder Officer</label>
                    <input
                      type="text"
                      disabled
                      value={`${currentUser.name} (${currentUser.title || 'MIS/EDP Officer'})`}
                      className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authority / Form Reference</label>
                    <input
                      type="text"
                      value={addRemarks}
                      onChange={(e) => setAddRemarks(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  Encode & Add Subject (MIS/EDP)
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE SUBJECT / SECTION */}
          {activeTab === 'change' && (
            <form onSubmit={handleChangeSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-2.5">
                <Edit className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">MIS/EDP Subject & Faculty Change Protocol: </strong>
                  Select an enrolled course to reassign schedule days, time, room, or change the assigned faculty instructor.
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Enrolled Course to Modify *</label>
                <select
                  value={changeTargetId}
                  onChange={(e) => handleSelectChangeSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-[#0b2545]"
                >
                  {schedule.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subjectCode} – {item.subjectTitle} ({item.days.join('/')} {item.startTime} | Faculty: {item.instructor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Days */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">New Schedule Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = changeDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleChangeDay(day)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[#0b2545] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time & Room */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={changeStartTime}
                    onChange={(e) => setChangeStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">End Time</label>
                  <input
                    type="text"
                    value={changeEndTime}
                    onChange={(e) => setChangeEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Room</label>
                  <input
                    type="text"
                    value={changeRoom}
                    onChange={(e) => setChangeRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Building</label>
                  <input
                    type="text"
                    value={changeBuilding}
                    onChange={(e) => setChangeBuilding(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Change Faculty */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="font-bold text-amber-950 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  Assigned Faculty Instructor Change
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Faculty Name</label>
                    <input
                      type="text"
                      value={changeInstructor}
                      onChange={(e) => setChangeInstructor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Faculty Rank</label>
                    <input
                      type="text"
                      value={changeFacultyTitle}
                      onChange={(e) => setChangeFacultyTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={changeFacultyDept}
                      onChange={(e) => setChangeFacultyDept(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">EDP Remarks / Dean Endorsement</label>
                <input
                  type="text"
                  value={changeRemarks}
                  onChange={(e) => setChangeRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Edit className="w-4 h-4 text-amber-300" />
                  Save & Apply Change (MIS/EDP)
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DROP SUBJECT */}
          {activeTab === 'drop' && (
            <form onSubmit={handleDropSubmit} className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Official Dropping Collaboration (Form QF-REG-03): </strong>
                  Dropping a course will officially remove it from the student's enrolled load in the Student Information System and remove it from the parents schedule view.
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Course to Drop *</label>
                <select
                  value={dropTargetId}
                  onChange={(e) => setDropTargetId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500"
                >
                  {schedule.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subjectCode} – {item.subjectTitle} ({item.units} units | Faculty: {item.instructor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Official Reason for Dropping *</label>
                <select
                  value={dropReason}
                  onChange={(e) => setDropReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Academic Overload / Unit Reduction">Academic Overload / Unit Reduction</option>
                  <option value="Prerequisite Conflict with Core Subject">Prerequisite Conflict with Core Subject</option>
                  <option value="Schedule Conflict with Essential Lab">Schedule Conflict with Essential Lab</option>
                  <option value="Health / Medical Justification">Health / Medical Justification</option>
                  <option value="Section Dissolution / College Reassignment">Section Dissolution / College Reassignment</option>
                  <option value="Dean & Adviser Recommended Dropping">Dean & Adviser Recommended Dropping</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Dean / Registrar Clearance Reference</label>
                <textarea
                  rows={2}
                  value={dropRemarks}
                  onChange={(e) => setDropRemarks(e.target.value)}
                  placeholder="Form QF-REG-03 control reference and endorsement notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                  Confirm Official Subject Drop (MIS/EDP)
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: POLICY */}
          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  Management Information System / Electronic Data Processing (MIS/EDP) Charter
                </h4>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Pursuant to ISAT U University Code and Quality Management System standard QF-REG-03, the 
                  <strong> Management Information System / Electronic Data Processing (MIS/EDP) Office</strong> holds 
                  sole authority over the centralized encoding, section balancing, and database committing of all course adjustments.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Read-Only for Parents:</strong> Protects academic integrity; parents can track real-time faculty instructors and class schedules without risk of unauthorized tampering.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Faculty Transparency:</strong> All subjects enrolled must clearly list the designated teaching faculty, contact channels, and consultation office.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Audited Collaboration:</strong> Adding, Changing, and Dropping transactions produce an official EDP Control Number and push notifications to student and parent accounts.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
