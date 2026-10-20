import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, GuidanceStanding, ClearanceStatus, BehavioralRating } from '../../types';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  Edit2,
  Check,
  X,
  Bell,
  Users,
  Clock,
  Plus,
  Building2
} from 'lucide-react';
import { MISEDPScheduleModal } from '../MISEDPScheduleModal';
import { getScheduleForStudent } from '../../data/studentSchedules';

interface AdminGuidanceViewProps {
  onOpenGuidanceClearance: (student: Student) => void;
  onOpenCounselingLog: (student: Student) => void;
  onOpenBroadcastModal: () => void;
}

export const AdminGuidanceView: React.FC<AdminGuidanceViewProps> = ({
  onOpenGuidanceClearance,
  onOpenCounselingLog,
  onOpenBroadcastModal,
}) => {
  const {
    students,
    parents,
    updateGuidanceStatus,
    updateStudentSchedule,
    addClassScheduleItem,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedStanding, setSelectedStanding] = useState('all');
  const [selectedMISEDPStudent, setSelectedMISEDPStudent] = useState<Student | null>(null);

  // Status editing dialog
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editStanding, setEditStanding] = useState<GuidanceStanding>('Good Moral Standing');
  const [editClearance, setEditClearance] = useState<ClearanceStatus>('Cleared');
  const [editBehavioral, setEditBehavioral] = useState<BehavioralRating>('Exemplary');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.program.toLowerCase().includes(searchTerm.toLowerCase());

      if (searchTerm && !matchSearch) return false;
      if (selectedCollege !== 'all' && s.collegeCode !== selectedCollege) return false;
      if (selectedStanding !== 'all' && s.guidanceStanding !== selectedStanding) return false;

      return true;
    });
  }, [students, searchTerm, selectedCollege, selectedStanding]);

  // Statistics
  const totalStudents = students.length;
  const goodStandingCount = students.filter(
    (s) => s.guidanceStanding === 'Good Moral Standing' || s.guidanceStanding === 'Special Commendation'
  ).length;
  const interventionCount = students.filter(
    (s) => s.guidanceStanding === 'Attendance Intervention' || s.guidanceStanding === 'Requires Parent Dialogue'
  ).length;
  const clearedCount = students.filter((s) => s.guidanceClearanceStatus === 'Cleared').length;

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateGuidanceStatus(editingStudent.id, editStanding, editClearance, editBehavioral);
    setEditingStudent(null);
  };

  const getStandingColor = (standing: GuidanceStanding) => {
    switch (standing) {
      case 'Good Moral Standing':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Special Commendation':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'Under Routine Advisement':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'Attendance Intervention':
      case 'Requires Parent Dialogue':
        return 'text-rose-800 bg-rose-50 border-rose-200 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Student Guidance & Counseling Records Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor behavioral wellness, student development inventories, moral clearances, and counseling dialogues
          </p>
        </div>

        <button
          onClick={onOpenBroadcastModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <Bell className="w-4 h-4" />
          Send Guidance Bulletin to Parents
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-700" /> Monitored Students
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {totalStudents}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Active in Guidance Inventory
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" /> Good Moral Standing
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {goodStandingCount}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-0.5">
            Zero conduct infractions
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Interventions Required
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {interventionCount}
          </div>
          <div className="text-xs text-rose-600 font-semibold mt-0.5">
            Attendance or counseling case
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" /> Clearance Cleared
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {clearedCount}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Eligible for Certificate
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, ID, or course..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b2545]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Colleges</option>
            <option value="CICT">CICT (IT & Computer Science)</option>
            <option value="CEA">CEA (Engineering & Arch)</option>
            <option value="CIT">CIT (Industrial Technology)</option>
            <option value="COE">COE (Education)</option>
            <option value="CAS">CAS (Arts and Sciences)</option>
          </select>

          <select
            value={selectedStanding}
            onChange={(e) => setSelectedStanding(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Guidance Standings</option>
            <option value="Good Moral Standing">Good Moral Standing</option>
            <option value="Special Commendation">Special Commendation</option>
            <option value="Under Routine Advisement">Under Routine Advisement</option>
            <option value="Attendance Intervention">Attendance Intervention</option>
            <option value="Requires Parent Dialogue">Requires Parent Dialogue</option>
          </select>
        </div>
      </div>

      {/* Student Guidance Records List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No students found matching current filters.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const parent = parents.find((p) => p.studentIds.includes(student.id));

            return (
              <div
                key={student.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{student.fullName}</h3>
                      <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {student.studentNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStandingColor(student.guidanceStanding)}`}>
                        {student.guidanceStanding}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Clearance: {student.guidanceClearanceStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {student.program} · <span className="font-medium text-slate-800">{student.yearLevel} ({student.section})</span> · {student.collegeCode}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedMISEDPStudent(student)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                      title="Manage student subjects under MIS/EDP Office authority (Add/Change/Drop)"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-300" />
                      MIS/EDP Subjects ({getScheduleForStudent(student).length})
                    </button>
                    <button
                      onClick={() => onOpenGuidanceClearance(student)}
                      className="px-3.5 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      Guidance Certificate
                    </button>
                    <button
                      onClick={() => onOpenCounselingLog(student)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Log Session
                    </button>
                  </div>
                </div>

                {/* Behavioral & Parent Summary Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registered Parent / Guardian:</span>
                    <span className="font-semibold text-slate-800">
                      {parent ? `${parent.fullName} (${parent.contactNumber})` : 'Unassigned'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Counselor:</span>
                    <span className="font-semibold text-slate-800">{student.counselor.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Attendance & Punctuality:</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {student.overallAttendanceRate}% ({student.totalAbsences} Absences, {student.unexcusedAbsences} Unexcused)
                    </span>
                  </div>
                </div>

                {/* Counseling Sessions Timeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Logged Counseling Dialogues ({student.counselingRecords.length})
                    </span>
                    <button
                      onClick={() => {
                        setEditingStudent(student);
                        setEditStanding(student.guidanceStanding);
                        setEditClearance(student.guidanceClearanceStatus);
                        setEditBehavioral(student.behavioralRating);
                      }}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Adjust Standing / Clearance
                    </button>
                  </div>

                  {student.counselingRecords.length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-3 bg-slate-50/50 rounded-lg">
                      No formal counseling sessions logged.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {student.counselingRecords.map((coun) => (
                        <div
                          key={coun.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{coun.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 tabular-nums text-[11px]">{coun.date}</span>
                              <span className="text-[10px] font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {coun.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {coun.summary}
                          </p>
                          <div className="text-slate-700 text-[11px] font-medium pt-1">
                            <strong>Action Plan:</strong> {coun.actionPlan}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Adjust Guidance Standing Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0b2545] p-5 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Update Student Guidance Standing</h4>
                <div className="text-xs text-blue-200">
                  {editingStudent.fullName} ({editingStudent.studentNumber})
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Moral & Guidance Standing
                </label>
                <select
                  value={editStanding}
                  onChange={(e) => setEditStanding(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                >
                  <option value="Good Moral Standing">Good Moral Standing</option>
                  <option value="Special Commendation">Special Commendation</option>
                  <option value="Under Routine Advisement">Under Routine Advisement</option>
                  <option value="Attendance Intervention">Attendance Intervention</option>
                  <option value="Requires Parent Dialogue">Requires Parent Dialogue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guidance Clearance Status
                </label>
                <select
                  value={editClearance}
                  onChange={(e) => setEditClearance(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                >
                  <option value="Cleared">Cleared</option>
                  <option value="Pending Interview">Pending Interview</option>
                  <option value="Conditional Clearance">Conditional Clearance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Behavioral & Conduct Evaluation
                </label>
                <select
                  value={editBehavioral}
                  onChange={(e) => setEditBehavioral(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                >
                  <option value="Exemplary">Exemplary Conduct</option>
                  <option value="Satisfactory">Satisfactory Conduct</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0b2545] hover:bg-[#133c70] text-white px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  Save & Synchronize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMISEDPStudent && (
        <MISEDPScheduleModal
          isOpen={true}
          onClose={() => setSelectedMISEDPStudent(null)}
          student={selectedMISEDPStudent}
          schedule={getScheduleForStudent(selectedMISEDPStudent)}
          onAddClass={(item) => addClassScheduleItem(selectedMISEDPStudent.id, item)}
          onUpdateSchedule={updateStudentSchedule}
        />
      )}
    </div>
  );
};
