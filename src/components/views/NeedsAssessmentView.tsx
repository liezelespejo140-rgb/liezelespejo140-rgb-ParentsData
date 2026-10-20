import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ISATUCampus,
  IloiloCityCollege,
  SocioEconomicBracket,
  EmploymentStatus,
  NatureOfWork,
  NeedsAssessmentSeminarProposal,
} from '../../types';
import {
  BarChart3,
  Filter,
  Download,
  Send,
  Users,
  Briefcase,
  DollarSign,
  GraduationCap,
  Sparkles,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  Building2,
  FileSpreadsheet,
  Award,
  Plus,
  X
} from 'lucide-react';

interface NeedsAssessmentViewProps {
  onOpenBroadcastModalWithFilter?: (scope: string, filterVal?: string) => void;
}

export const NeedsAssessmentView: React.FC<NeedsAssessmentViewProps> = ({
  onOpenBroadcastModalWithFilter,
}) => {
  const {
    parents,
    students,
    seminarProposals,
    addSeminarProposal,
    updateProposalStatus,
    currentUser,
  } = useApp();

  // Multi-criteria filter states (as per QP-PAR 02)
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedIncomeBracket, setSelectedIncomeBracket] = useState<string>('all');
  const [selectedEmployment, setSelectedEmployment] = useState<string>('all');
  const [selectedNatureOfWork, setSelectedNatureOfWork] = useState<string>('all');
  const [selectedFinancialAid, setSelectedFinancialAid] = useState<string>('all');
  const [skillSearch, setSkillSearch] = useState<string>('');

  // Proposal creation modal
  const [isCreateProposalOpen, setIsCreateProposalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NeedsAssessmentSeminarProposal['category']>('Livelihood & Skills');
  const [newObjective, setNewObjective] = useState('');
  const [newCohort, setNewCohort] = useState('');
  const [newEstimate, setNewEstimate] = useState(50);
  const [newMatchedSkill, setNewMatchedSkill] = useState('');
  const [newDuration, setNewDuration] = useState('1 Day (4 Hours)');
  const [newSpeakers, setNewSpeakers] = useState('');
  const [newPriority, setNewPriority] = useState<NeedsAssessmentSeminarProposal['priority']>('High Priority');

  // Filtered dataset
  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      if (p.isArchived) return false;

      const linkedStudents = students.filter((s) => p.studentIds.includes(s.id));

      // Campus filter
      if (selectedCampus !== 'all') {
        const hasCampus = linkedStudents.some((s) => s.campus === selectedCampus);
        if (!hasCampus) return false;
      }

      // College filter (Iloilo City)
      if (selectedCollege !== 'all') {
        const hasCollege = linkedStudents.some(
          (s) => s.college === selectedCollege || s.collegeCode === selectedCollege
        );
        if (!hasCollege) return false;
      }

      // Income bracket
      if (selectedIncomeBracket !== 'all' && p.socioEconomicStatus !== selectedIncomeBracket) {
        return false;
      }

      // Employment status
      if (selectedEmployment !== 'all' && p.employmentStatus !== selectedEmployment) {
        return false;
      }

      // Nature of work
      if (selectedNatureOfWork !== 'all' && !p.natureOfWork.includes(selectedNatureOfWork as NatureOfWork)) {
        return false;
      }

      // Financial support (4Ps, Tulong Dunong)
      if (selectedFinancialAid === '4ps') {
        if (!p.unemployedSourceOfIncome || !p.unemployedSourceOfIncome.toLowerCase().includes('4p')) {
          return false;
        }
      } else if (selectedFinancialAid === 'support') {
        if (!p.unemployedSourceOfIncome || p.unemployedSourceOfIncome.trim() === '') {
          return false;
        }
      }

      // Special skills search
      if (skillSearch.trim()) {
        const search = skillSearch.toLowerCase();
        const parentSkills = (p.specialSkills || '').toLowerCase();
        const spouseSkills = (p.spouse?.specialSkills || '').toLowerCase();
        if (!parentSkills.includes(search) && !spouseSkills.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }, [
    parents,
    students,
    selectedCampus,
    selectedCollege,
    selectedIncomeBracket,
    selectedEmployment,
    selectedNatureOfWork,
    selectedFinancialAid,
    skillSearch,
  ]);

  // Statistical calculations
  const totalFiltered = filteredParents.length;
  const activeParentsTotal = parents.filter((p) => !p.isArchived).length;

  // Income Breakdown
  const incomeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      'Below Php 10,000': 0,
      'PhP 11,000- PhP 20,000': 0,
      'PhP 21,000- PhP 30,000': 0,
      'PhP 31,000- PhP 40,000': 0,
      'PhP 41,000- PhP 50,000': 0,
      'PhP 51,000 and above': 0,
    };
    filteredParents.forEach((p) => {
      if (counts[p.socioEconomicStatus] !== undefined) {
        counts[p.socioEconomicStatus]++;
      }
    });
    return counts;
  }, [filteredParents]);

  // Employment Breakdown
  const employmentBreakdown = useMemo(() => {
    const counts = { Employed: 0, Unemployed: 0, 'Self Employed': 0 };
    filteredParents.forEach((p) => {
      if (p.employmentStatus in counts) {
        counts[p.employmentStatus]++;
      }
    });
    return counts;
  }, [filteredParents]);

  // Nature of Work Breakdown
  const natureOfWorkBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredParents.forEach((p) => {
      p.natureOfWork.forEach((work) => {
        counts[work] = (counts[work] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredParents]);

  // 4Ps and Support Cohort
  const fourPsCount = useMemo(() => {
    return filteredParents.filter(
      (p) => p.unemployedSourceOfIncome && p.unemployedSourceOfIncome.toLowerCase().includes('4p')
    ).length;
  }, [filteredParents]);

  const handlePrintReport = () => {
    window.print();
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newObjective.trim()) {
      alert('Please fill in title and objective.');
      return;
    }

    addSeminarProposal({
      title: newTitle.trim(),
      category: newCategory,
      objective: newObjective.trim(),
      targetCohortDescription: newCohort.trim() || `${totalFiltered} parents in current filtered cohort`,
      targetEstimatedParents: Number(newEstimate) || totalFiltered,
      matchedParentSkill: newMatchedSkill.trim() || undefined,
      suggestedDuration: newDuration,
      suggestedResourcePersons: newSpeakers.trim() || 'PAR Coordinators & University Faculty',
      priority: newPriority,
      status: currentUser.role === 'admin' ? 'Approved by PAR Director' : 'Proposed',
    });

    setIsCreateProposalOpen(false);
    setNewTitle('');
    setNewObjective('');
    setNewCohort('');
    setNewMatchedSkill('');
    setNewSpeakers('');
  };

  return (
    <div className="space-y-6">
      {/* Official Form Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                  Form Procedure: QP-PAR 02
                </span>
                <span className="text-[11px] text-slate-500">ISO 9001:2015 Certified Process</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Needs Assessment & Statistical Treatment Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                Filter demographic and socio-economic data collected from Form QF-PAR-01 to identify training needs, proposal planning, and actionable seminar recommendations for ISAT U parents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print / Export QP-PAR 02
            </button>
            <button
              onClick={() => setIsCreateProposalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Draft Seminar Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Criteria Filter Controls (QP-PAR 02) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Filter className="w-4 h-4 text-blue-700" />
            Multi-Criteria Data Filtering (Chapter I & III Framework)
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-900">{totalFiltered}</span> of{' '}
            <span className="font-bold text-slate-900">{activeParentsTotal}</span> parent records
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Campus Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Target Campus:
            </label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All 5 ISAT U Campuses</option>
              <option value="Iloilo City">Iloilo City (Main Campus)</option>
              <option value="Barotac Nuevo">Barotac Nuevo Campus</option>
              <option value="Dumangas">Dumangas Campus</option>
              <option value="Leon">Leon Campus</option>
              <option value="Miag-ao">Miag-ao Campus</option>
            </select>
          </div>

          {/* College Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              College (Iloilo City):
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Colleges / Disciplines</option>
              <option value="College of Computing and Informatics">College of Computing and Informatics (CICT)</option>
              <option value="College of Engineering and Architecture">College of Engineering and Architecture (CEA)</option>
              <option value="College of Industrial Technology">College of Industrial Technology (CIT)</option>
              <option value="College of Arts and Sciences">College of Arts and Sciences (CAS)</option>
              <option value="College of Education">College of Education (COE)</option>
            </select>
          </div>

          {/* Income Bracket */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Family Monthly Income:
            </label>
            <select
              value={selectedIncomeBracket}
              onChange={(e) => setSelectedIncomeBracket(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
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

          {/* Employment Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Employment Status:
            </label>
            <select
              value={selectedEmployment}
              onChange={(e) => setSelectedEmployment(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Employment Statuses</option>
              <option value="Employed">Employed (Full/Part/Contractual)</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Self Employed">Self Employed</option>
            </select>
          </div>

          {/* Nature of Work */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nature of Work / Industry:
            </label>
            <select
              value={selectedNatureOfWork}
              onChange={(e) => setSelectedNatureOfWork(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All 13 Sectors</option>
              <option value="Academe">Academe</option>
              <option value="Agriculture/ Farming">Agriculture/ Farming</option>
              <option value="Government">Government</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Business Management">Business Management</option>
              <option value="Construction">Construction</option>
              <option value="Fisheries">Fisheries</option>
              <option value="Electronics">Electronics</option>
              <option value="OFW">OFW</option>
              <option value="Seafarer">Seafarer</option>
              <option value="Military">Military</option>
            </select>
          </div>

          {/* Financial Aid Support */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Financial Support Status:
            </label>
            <select
              value={selectedFinancialAid}
              onChange={(e) => setSelectedFinancialAid(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Parents</option>
              <option value="4ps">4Ps Beneficiaries Only</option>
              <option value="support">With Financial Support Aid</option>
            </select>
          </div>

          {/* Special Skills Search */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Filter by Parent Special Skills (e.g., Organic, Tailoring, Carpentry, First Aid, IT):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search specific skill..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              {(selectedCampus !== 'all' ||
                selectedCollege !== 'all' ||
                selectedIncomeBracket !== 'all' ||
                selectedEmployment !== 'all' ||
                selectedNatureOfWork !== 'all' ||
                selectedFinancialAid !== 'all' ||
                skillSearch) && (
                <button
                  onClick={() => {
                    setSelectedCampus('all');
                    setSelectedCollege('all');
                    setSelectedIncomeBracket('all');
                    setSelectedEmployment('all');
                    setSelectedNatureOfWork('all');
                    setSelectedFinancialAid('all');
                    setSkillSearch('');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg whitespace-nowrap transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action bar for filtered cohort */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            Filtered Cohort: <strong className="text-slate-900">{totalFiltered} Parents</strong> | 4Ps Aid Beneficiaries: <strong className="text-amber-700">{fourPsCount}</strong>
          </div>
          {onOpenBroadcastModalWithFilter && (
            <button
              onClick={() => onOpenBroadcastModalWithFilter('income_bracket', selectedIncomeBracket)}
              className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-bold"
            >
              <Send className="w-3.5 h-3.5 text-amber-500" />
              Dispatch SMS Advisory to this Filtered Cohort ({totalFiltered})
            </button>
          )}
        </div>
      </div>

      {/* Statistical Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Family Monthly Income Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Socio-Economic Income Distribution
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
              6 Brackets
            </span>
          </div>
          <div className="space-y-2 pt-1">
            {Object.entries(incomeBreakdown).map(([bracket, count]) => {
              const pct = totalFiltered ? Math.round((count / totalFiltered) * 100) : 0;
              return (
                <div key={bracket} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 truncate">{bracket}</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bracket.includes('Below') || bracket.includes('11,000')
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Employment & Livelihood Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-700" />
              Employment Status & Aid Needs
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
              Livelihood Indicators
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {employmentBreakdown.Employed}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Employed
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-lg font-extrabold text-blue-900 tabular-nums">
                  {employmentBreakdown['Self Employed']}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Self-Employed
                </div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-lg font-extrabold text-amber-900 tabular-nums">
                  {employmentBreakdown.Unemployed}
                </div>
                <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mt-0.5">
                  Unemployed
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Social Welfare & Financial Aid Identifiers:
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Pantawid Pamilyang Pilipino (4Ps):</span>
                <span className="font-bold text-slate-900">{fourPsCount} families</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Livelihood Workshop Recommendations:</span>
                <span className="font-bold text-emerald-700">High Priority</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              * Data utilized by PAR Director to endorse subsidized university livelihood kits and skills workshops.
            </p>
          </div>
        </div>

        {/* Card 3: Top Nature of Work Sectors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-700" />
              Top Industry & Work Domains
            </h3>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
              Parent Capacities
            </span>
          </div>

          <div className="space-y-2 pt-1 max-h-56 overflow-y-auto">
            {natureOfWorkBreakdown.slice(0, 6).map(([work, count]) => {
              const pct = totalFiltered ? Math.round((count / totalFiltered) * 100) : 0;
              return (
                <div key={work} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50">
                  <span className="text-slate-700 font-medium">{work}</span>
                  <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded tabular-nums">
                    {count} parents ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actionable Seminar & Workshop Proposals Section (As specified in Chapter III) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Tailored Seminar & Workshop Proposal Plans (QP-PAR 02)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable intelligence derived from parent survey data to formulate university extension proposals.
            </p>
          </div>

          <button
            onClick={() => setIsCreateProposalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" /> Add Proposal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seminarProposals.map((prop) => (
            <div
              key={prop.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    {prop.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                    {prop.title}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    prop.status === 'Approved by PAR Director'
                      ? 'bg-emerald-100 text-emerald-800'
                      : prop.status === 'Scheduled'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {prop.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {prop.objective}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Target Cohort:</span>
                  <span className="font-medium text-slate-800 truncate block">
                    {prop.targetCohortDescription} ({prop.targetEstimatedParents} pax)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Duration & Facilitators:</span>
                  <span className="font-medium text-slate-800 truncate block">
                    {prop.suggestedDuration}
                  </span>
                </div>
              </div>

              {prop.matchedParentSkill && (
                <div className="text-[11px] bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 text-amber-900">
                  <span className="font-semibold">Parent Volunteer Resource: </span>
                  {prop.matchedParentSkill}
                </div>
              )}

              {/* Status workflow buttons */}
              {currentUser.role === 'admin' && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  {prop.status === 'Proposed' && (
                    <button
                      onClick={() => updateProposalStatus(prop.id, 'Approved by PAR Director')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-md transition-colors"
                    >
                      Approve Proposal
                    </button>
                  )}
                  {prop.status === 'Approved by PAR Director' && (
                    <button
                      onClick={() => updateProposalStatus(prop.id, 'Scheduled')}
                      className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold rounded-md transition-colors"
                    >
                      Mark Scheduled
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Draft Custom Proposal */}
      {isCreateProposalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0b2545] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Draft Actionable Seminar Proposal (QP-PAR 02)</h3>
              </div>
              <button
                onClick={() => setIsCreateProposalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Seminar / Workshop Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Micro-Enterprise Livelihood Workshop for Parents"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >
                    <option value="Livelihood & Skills">Livelihood & Skills</option>
                    <option value="Financial Empowerment">Financial Empowerment</option>
                    <option value="Parenting & Values">Parenting & Values</option>
                    <option value="Digital Literacy">Digital Literacy</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority Level:
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >
                    <option value="High Priority">High Priority</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Objective:
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="State the measurable objective for parent participants..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Cohort Description:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unemployed parents, Leon campus"
                    value={newCohort}
                    onChange={(e) => setNewCohort(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Participants:
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={newEstimate}
                    onChange={(e) => setNewEstimate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Matched Parent Volunteer Skills (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic composting, carpentry, culinary skills"
                  value={newMatchedSkill}
                  onChange={(e) => setNewMatchedSkill(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateProposalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Save Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
