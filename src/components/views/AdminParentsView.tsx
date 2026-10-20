import React, { useState, useMemo } from 'react';
import { useApp, detectPhilippineCarrier } from '../../context/AppContext';
import { Parent, Student } from '../../types';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Calendar,
  Send,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  GraduationCap,
  ShieldCheck,
  FileText,
  Copy,
  Printer,
  Archive,
  RefreshCw,
  Sliders,
  Lock,
  Unlock,
  Layers,
  Database
} from 'lucide-react';

interface AdminParentsViewProps {
  onSelectParent: (parent: Parent) => void;
  onOpenIntakeModal: () => void;
  onOpenLogModal: (parent: Parent) => void;
  onSendAlert: (parent: Parent) => void;
  onOpenPrintModal?: (parent: Parent, student: Student | null) => void;
}

export const AdminParentsView: React.FC<AdminParentsViewProps> = ({
  onSelectParent,
  onOpenIntakeModal,
  onOpenLogModal,
  onSendAlert,
  onOpenPrintModal,
}) => {
  const {
    parents,
    students,
    verifyParentForm,
    deleteParent,
    restoreParent,
    resolveDuplicateParent,
    detectDuplicates,
    databaseBackups,
    createBackupSnapshot,
    exportDatabaseJSON,
    exportParentsCSV,
    isIntakeOpen,
    toggleIntakePeriod,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'directory' | 'verification' | 'deduplication' | 'backup'>('directory');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedIncome, setSelectedIncome] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // Backup modal state
  const [backupNote, setBackupNote] = useState('');

  // Duplicates list
  const detectedDuplicates = useMemo(() => detectDuplicates(), [parents]);

  // Filtered Parents
  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      // Archive visibility
      if (!showArchived && p.isArchived) return false;
      if (showArchived && !p.isArchived) return false;

      const linked = students.filter((s) => p.studentIds.includes(s.id));

      // Search match
      const studentMatch = linked.some(
        (s) =>
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const parentMatch =
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.emailAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.contactNumber.includes(searchTerm) ||
        (p.returnSlipCode || '').toLowerCase().includes(searchTerm.toLowerCase());

      if (searchTerm && !parentMatch && !studentMatch) return false;

      // Campus filter
      if (selectedCampus !== 'all') {
        const matchesCampus = linked.some((s) => s.campus === selectedCampus);
        if (!matchesCampus) return false;
      }

      // College filter
      if (selectedCollege !== 'all') {
        const matchesCollege = linked.some(
          (s) => s.collegeCode === selectedCollege || s.college?.includes(selectedCollege)
        );
        if (!matchesCollege) return false;
      }

      // Income filter
      if (selectedIncome !== 'all' && p.socioEconomicStatus !== selectedIncome) {
        return false;
      }

      // Verification filter
      if (selectedVerification !== 'all') {
        const status = p.verificationStatus || 'Verified & Accepted';
        if (status !== selectedVerification) return false;
      }

      return true;
    });
  }, [
    parents,
    students,
    searchTerm,
    selectedCampus,
    selectedCollege,
    selectedIncome,
    selectedVerification,
    showArchived,
  ]);

  // Review Queue (Pending or Needs Correction)
  const pendingReviewParents = useMemo(() => {
    return parents.filter(
      (p) => !p.isArchived && (p.verificationStatus === 'Pending Review' || p.verificationStatus === 'Needs Correction')
    );
  }, [parents]);

  // Metrics
  const activeCount = parents.filter((p) => !p.isArchived).length;
  const verifiedCount = parents.filter(
    (p) => !p.isArchived && (p.verificationStatus === 'Verified & Accepted' || !p.verificationStatus)
  ).length;

  return (
    <div className="space-y-6">
      {/* Top University Department Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                  Form QF-PAR-01 Master Database
                </span>
                <span className="text-[11px] text-slate-500">Rev. 02 · April 15, 2026</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                ISAT U Parents & Guardians Information Management System
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                Centralized university repository for parent/guardian intake records, return slips, verification queues, duplicate resolution, and annual institutional database backups.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportParentsCSV}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-500" /> Export CSV
            </button>
            <button
              onClick={onOpenIntakeModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" /> Register QF-PAR-01
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-[#0b2545] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Master Directory ({activeCount})
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap relative ${
              activeTab === 'verification'
                ? 'bg-[#0b2545] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Verification Queue
            {pendingReviewParents.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center tabular-nums">
                {pendingReviewParents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('deduplication')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap relative ${
              activeTab === 'deduplication'
                ? 'bg-[#0b2545] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            Deduplication Tool
            {detectedDuplicates.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center tabular-nums">
                {detectedDuplicates.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-[#0b2545] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Annual Backup & Access Control
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Multi-field search and filter bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by parent name, student, phone, return slip code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Campus */}
              <div>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  <option value="all">All 5 Campuses</option>
                  <option value="Iloilo City">Iloilo City (Main)</option>
                  <option value="Barotac Nuevo">Barotac Nuevo</option>
                  <option value="Dumangas">Dumangas</option>
                  <option value="Leon">Leon</option>
                  <option value="Miag-ao">Miag-ao</option>
                </select>
              </div>

              {/* Income */}
              <div>
                <select
                  value={selectedIncome}
                  onChange={(e) => setSelectedIncome(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  <option value="all">All Income Brackets</option>
                  <option value="Below Php 10,000">Below Php 10,000</option>
                  <option value="PhP 11,000- PhP 20,000">PhP 11,000- PhP 20,000</option>
                  <option value="PhP 21,000- PhP 30,000">PhP 21,000- PhP 30,000</option>
                  <option value="PhP 31,000- PhP 40,000">PhP 31,000- PhP 40,000</option>
                  <option value="PhP 41,000- PhP 50,000">PhP 41,000- PhP 50,000</option>
                  <option value="PhP 51,000 and above">PhP 51,000 and above</option>
                </select>
              </div>

              {/* Archive Toggle */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowArchived(!showArchived)}
                  className={`text-xs px-3 py-2 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors ${
                    showArchived
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5" />
                  {showArchived ? 'Viewing Archived' : 'Show Archived'}
                </button>
              </div>
            </div>
          </div>

          {/* Parents Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Return Slip / Code</th>
                    <th className="py-3 px-4">Parent / Guardian Name</th>
                    <th className="py-3 px-4">Linked Student & Campus</th>
                    <th className="py-3 px-4">Contact & Telco Carrier</th>
                    <th className="py-3 px-4">Socio-Economic Bracket</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No parent records found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredParents.map((parent) => {
                      const linkedStudents = students.filter((s) => parent.studentIds.includes(s.id));
                      const carrier = detectPhilippineCarrier(parent.contactNumber);
                      const isVerified = parent.verificationStatus === 'Verified & Accepted' || (!parent.verificationStatus && parent.returnSlipSubmitted);

                      return (
                        <tr
                          key={parent.id}
                          className={`hover:bg-blue-50/30 transition-colors ${
                            parent.isArchived ? 'bg-slate-50/80 opacity-70' : ''
                          }`}
                        >
                          {/* Code */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              {parent.returnSlipCode || `PAR-2026-${parent.id.slice(-5)}`}
                            </span>
                          </td>

                          {/* Parent Info */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{parent.fullName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{parent.respondentType}</span>
                              <span>·</span>
                              <span>{parent.civilStatus}</span>
                            </div>
                          </td>

                          {/* Student & Campus */}
                          <td className="py-3.5 px-4">
                            {linkedStudents.map((st) => (
                              <div key={st.id}>
                                <div className="font-semibold text-slate-900">{st.fullName}</div>
                                <div className="text-[11px] text-slate-500">
                                  {st.courseYearSection} · <strong className="text-blue-900">{st.campus}</strong>
                                </div>
                              </div>
                            ))}
                          </td>

                          {/* Contact & Carrier */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="text-slate-900 font-medium tabular-nums">{parent.contactNumber}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  carrier === 'SMART'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : carrier === 'GLOBE'
                                    ? 'bg-blue-100 text-blue-800'
                                    : carrier === 'DITO'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {carrier}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                {parent.emailAddress}
                              </span>
                            </div>
                          </td>

                          {/* Income */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="text-slate-800 font-semibold">{parent.socioEconomicStatus}</div>
                            <div className="text-[11px] text-slate-500 capitalize">{parent.employmentStatus}</div>
                          </td>

                          {/* Verification */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                Verified QF-PAR-01
                              </span>
                            ) : parent.verificationStatus === 'Needs Correction' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                Needs Correction
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                Pending Staff Review
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => onSelectParent(parent)}
                                title="View Complete QF-PAR-01 Profile"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {onOpenPrintModal && (
                                <button
                                  onClick={() => onOpenPrintModal(parent, linkedStudents[0] || null)}
                                  title="Print Official Form & Return Slip"
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => onSendAlert(parent)}
                                title="Send SMS / Broadcast to this Parent"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>

                              {parent.isArchived ? (
                                <button
                                  onClick={() => restoreParent(parent.id)}
                                  title="Restore Record"
                                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => deleteParent(parent.id)}
                                  title="Archive Parent Record (Safe Audit Retention)"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION & INTAKE REVIEW QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  QF-PAR-01 Verification & Intake Approval Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  As mandated for PAR Director & Staff in Chapter III: Review submitted responses, verify student linkages, and confirm accuracy.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                {pendingReviewParents.length} Pending Review
              </span>
            </div>

            {pendingReviewParents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                All submitted parent forms have been verified and confirmed by PAR Office staff!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviewParents.map((p) => {
                  const linked = students.filter((s) => p.studentIds.includes(s.id));
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.fullName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                            {p.returnSlipCode || 'NEW SUBMISSION'}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          {p.respondentType} · Phone: <strong className="text-slate-800">{p.contactNumber}</strong> · Address: {p.completeAddress}
                        </div>
                        <div className="text-slate-600">
                          Linked Student: <strong className="text-blue-900">{linked[0]?.fullName || 'Unlinked'}</strong> ({linked[0]?.courseYearSection} - {linked[0]?.campus})
                        </div>
                        {p.notes && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 mt-1 inline-block">
                            {p.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onSelectParent(p)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg"
                        >
                          Review Form
                        </button>
                        <button
                          onClick={() => verifyParentForm(p.id, 'Needs Correction')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200"
                        >
                          Flag Correction
                        </button>
                        <button
                          onClick={() => verifyParentForm(p.id, 'Verified & Accepted')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
                        >
                          Accept & Verify
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DUPLICATE DETECTION & DEDUPLICATION */}
      {activeTab === 'deduplication' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-600" />
                Automated Duplicate Detection & Deduplication Tool
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                As stated in Chapter III: "ensuring that the information is correct and delete multiple responses" - detects duplicate submissions by matching student profile, contact numbers, or names.
              </p>
            </div>

            {detectedDuplicates.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                No duplicate or redundant parent entries detected. The database is clean and consolidated!
              </div>
            ) : (
              <div className="space-y-4">
                {detectedDuplicates.map((dup, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Duplicate Conflict Detected: {dup.reason}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Entry A */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{dup.parentA.fullName}</span>
                          <span className="text-[10px] bg-slate-100 font-mono px-2 py-0.5 rounded font-bold">
                            Primary Entry ({dup.parentA.id})
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Contact: <strong>{dup.parentA.contactNumber}</strong> · Email: {dup.parentA.emailAddress}
                        </div>
                        <div className="text-slate-600">
                          Return Slip: <span className="font-mono">{dup.parentA.returnSlipCode || 'N/A'}</span> (Status: {dup.parentA.verificationStatus || 'Verified'})
                        </div>
                        <button
                          onClick={() => resolveDuplicateParent(dup.parentA.id, dup.parentB.id)}
                          className="mt-2 w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs"
                        >
                          Keep This Entry (Merge & Archive Other)
                        </button>
                      </div>

                      {/* Entry B */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{dup.parentB.fullName}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded font-bold">
                            Secondary Entry ({dup.parentB.id})
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Contact: <strong>{dup.parentB.contactNumber}</strong> · Email: {dup.parentB.emailAddress}
                        </div>
                        <div className="text-slate-600">
                          Return Slip: <span className="font-mono">{dup.parentB.returnSlipCode || 'N/A'}</span> (Status: {dup.parentB.verificationStatus || 'Pending'})
                        </div>
                        <button
                          onClick={() => resolveDuplicateParent(dup.parentB.id, dup.parentA.id)}
                          className="mt-2 w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs"
                        >
                          Keep This Entry (Merge & Archive Other)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ANNUAL BACKUP & ACCESS CONTROL */}
      {activeTab === 'backup' && (
        <div className="space-y-5">
          {/* Access Control Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-700" />
                  Intake Window System Access Control
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  As described in Chapter I & III: "enabling/disabling system access during specific periods as required by PAR Director."
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                    isIntakeOpen
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {isIntakeOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {isIntakeOpen ? 'Intake Portal OPEN' : 'Intake Portal CLOSED'}
                </span>

                <button
                  onClick={toggleIntakePeriod}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-xs ${
                    isIntakeOpen
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isIntakeOpen ? 'Close Intake Window' : 'Open Intake Window'}
                </button>
              </div>
            </div>
          </div>

          {/* Annual Database Backup Snapshot Manager */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  Annual Database Backup & Snapshot Archive
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mandatory annual database preservation for ISO 9001:2015 institutional accreditation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => createBackupSnapshot(backupNote || undefined)}
                  className="px-3.5 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" /> Create Backup Snapshot
                </button>
                <button
                  onClick={exportDatabaseJSON}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Full JSON Archive
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {databaseBackups.map((bak) => (
                <div
                  key={bak.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono text-sm">{bak.id}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                        AY {bak.academicYear}
                      </span>
                      <span className="text-slate-400 tabular-nums text-[11px]">{bak.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{bak.backupNote}</p>
                    <div className="text-[11px] text-slate-400">Created by: {bak.createdBy}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{bak.parentCount} Parent Records</div>
                      <div className="text-[10px] text-slate-400">{bak.fileSize}</div>
                    </div>
                    <button
                      onClick={exportDatabaseJSON}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-blue-700"
                      title="Download JSON Snapshot"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
