import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ISO25010Evaluation } from '../../types';
import {
  ShieldCheck,
  Award,
  Star,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Cpu,
  Smartphone,
  Lock,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';

export const ISOEvaluationView: React.FC = () => {
  const { isoEvaluations, submitISOEvaluation, currentUser } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [evaluatorName, setEvaluatorName] = useState(currentUser.name);
  const [evaluatorRole, setEvaluatorRole] = useState<ISO25010Evaluation['evaluatorRole']>(
    currentUser.role === 'admin'
      ? 'PAR Director'
      : currentUser.role === 'faculty'
      ? 'Staff/Coordinator'
      : 'Parent Evaluator'
  );

  const [functionalSuitability, setFunctionalSuitability] = useState(5.0);
  const [performanceEfficiency, setPerformanceEfficiency] = useState(4.8);
  const [usability, setUsability] = useState(5.0);
  const [compatibility, setCompatibility] = useState(4.9);
  const [reliability, setReliability] = useState(4.8);
  const [security, setSecurity] = useState(4.9);
  const [maintainability, setMaintainability] = useState(4.8);
  const [portability, setPortability] = useState(4.8);
  const [feedback, setFeedback] = useState('');

  // Compute average across all evaluations
  const count = isoEvaluations.length || 1;
  const avg = {
    functional: Number((isoEvaluations.reduce((sum, e) => sum + e.functionalSuitability, 0) / count).toFixed(2)),
    performance: Number((isoEvaluations.reduce((sum, e) => sum + e.performanceEfficiency, 0) / count).toFixed(2)),
    usability: Number((isoEvaluations.reduce((sum, e) => sum + e.usability, 0) / count).toFixed(2)),
    compatibility: Number((isoEvaluations.reduce((sum, e) => sum + e.compatibility, 0) / count).toFixed(2)),
    reliability: Number((isoEvaluations.reduce((sum, e) => sum + e.reliability, 0) / count).toFixed(2)),
    security: Number((isoEvaluations.reduce((sum, e) => sum + e.security, 0) / count).toFixed(2)),
    maintainability: Number((isoEvaluations.reduce((sum, e) => sum + e.maintainability, 0) / count).toFixed(2)),
    portability: Number((isoEvaluations.reduce((sum, e) => sum + e.portability, 0) / count).toFixed(2)),
  };

  const overallAvg = Number(
    (
      (avg.functional +
        avg.performance +
        avg.usability +
        avg.compatibility +
        avg.reliability +
        avg.security +
        avg.maintainability +
        avg.portability) /
      8
    ).toFixed(2)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorName.trim()) {
      alert('Please enter evaluator name.');
      return;
    }

    submitISOEvaluation({
      evaluatorName: evaluatorName.trim(),
      evaluatorRole,
      functionalSuitability,
      performanceEfficiency,
      usability,
      compatibility,
      reliability,
      security,
      maintainability,
      portability,
      feedback: feedback.trim() || 'System exceeds software quality requirements under ISO/IEC 25010.',
    });

    setIsSubmitModalOpen(false);
    setFeedback('');
  };

  const isoCriteria = [
    {
      name: 'Functional Suitability',
      score: avg.functional,
      desc: 'Form QF-PAR-01 intake, verification workflow, QP-PAR-02 needs assessment filtering, and SMS broadcasting complete all stated operational needs.',
      icon: CheckCircle2,
      color: 'text-emerald-600',
    },
    {
      name: 'Performance Efficiency',
      score: avg.performance,
      desc: 'Sub-second search and multi-criteria demographic filtering, client-side caching, and responsive UI performance.',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      name: 'Usability & Ergonomics',
      score: avg.usability,
      desc: 'Intuitive interface designed for parents and university staff, accessible guidance summaries, and clear print forms.',
      icon: Smartphone,
      color: 'text-amber-500',
    },
    {
      name: 'Compatibility',
      score: avg.compatibility,
      desc: 'Cross-browser responsive rendering across desktop, tablets, and Android/iOS smartphones.',
      icon: Cpu,
      color: 'text-purple-600',
    },
    {
      name: 'Reliability & Fault Tolerance',
      score: avg.reliability,
      desc: 'Safe persistent state management, error boundaries, and no-data-loss validation checks.',
      icon: RefreshCw,
      color: 'text-cyan-600',
    },
    {
      name: 'Security & Confidentiality',
      score: avg.security,
      desc: 'Data privacy confidentiality compliance, role-based access control, and prevention of unauthorized data alterations.',
      icon: Lock,
      color: 'text-rose-600',
    },
    {
      name: 'Maintainability',
      score: avg.maintainability,
      desc: 'Modular TypeScript architecture, clear data contracts, and maintainable component separation.',
      icon: FileCheck,
      color: 'text-indigo-600',
    },
    {
      name: 'Portability',
      score: avg.portability,
      desc: 'Annual database backup export (JSON/CSV), cloud deployment readiness, and cross-platform flexibility.',
      icon: Award,
      color: 'text-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                  ISO/IEC 25010 & ISO 9001:2015
                </span>
                <span className="text-[11px] text-slate-500">Conceptual Framework Component</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                System Quality Evaluation & ISO Compliance Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                Empirical evaluation of the ISAT U Parents Web-based Management System (PGWBMS) across the 8 primary software quality characteristics outlined in Chapter II of the concept paper.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" /> Submit ISO Evaluation
          </button>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
              ISO/IEC 25010 Composite Score
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black tabular-nums tracking-tight text-white">
                {overallAvg}
              </span>
              <span className="text-xl text-blue-200 font-semibold">/ 5.00</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full">
                Exemplary Quality
              </span>
            </div>
            <p className="text-xs text-blue-200 max-w-xl leading-relaxed">
              Based on {isoEvaluations.length} standardized evaluations conducted by PAR Directors, Guidance Coordinators, and Parent stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 p-4 rounded-xl border border-white/10 text-center">
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Evaluations</div>
              <div className="text-xl font-bold mt-0.5 tabular-nums">{isoEvaluations.length}</div>
            </div>
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Usability</div>
              <div className="text-xl font-bold mt-0.5 tabular-nums text-amber-300">{avg.usability}</div>
            </div>
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Suitability</div>
              <div className="text-xl font-bold mt-0.5 tabular-nums text-emerald-300">{avg.functional}</div>
            </div>
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Security</div>
              <div className="text-xl font-bold mt-0.5 tabular-nums text-purple-300">{avg.security}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Characteristics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isoCriteria.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${c.color}`} />
                  <span className="text-xs font-bold text-slate-800">{c.name}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg tabular-nums">
                  {c.score}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(c.score / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                {c.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ISO Evaluator Reviews Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Stakeholder Evaluation Reviews ({isoEvaluations.length})
          </h3>
          <span className="text-xs text-slate-500">ISO 9001:2015 Audit Log</span>
        </div>

        <div className="space-y-3">
          {isoEvaluations.map((evalItem) => (
            <div
              key={evalItem.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-xs text-slate-900">{evalItem.evaluatorName}</span>
                  <span className="ml-2 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900 tracking-wider">
                    {evalItem.evaluatorRole}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 tabular-nums">
                  Evaluated on {evalItem.evaluatedAt}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{evalItem.feedback}"
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-slate-600 font-medium">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Suitability: <strong>{evalItem.functionalSuitability}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Efficiency: <strong>{evalItem.performanceEfficiency}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Usability: <strong>{evalItem.usability}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Reliability: <strong>{evalItem.reliability}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Security: <strong>{evalItem.security}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Submit Evaluation */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0b2545] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Submit ISO/IEC 25010 Quality Evaluation</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evaluator Name:</label>
                  <input
                    type="text"
                    required
                    value={evaluatorName}
                    onChange={(e) => setEvaluatorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evaluator Role:</label>
                  <select
                    value={evaluatorRole}
                    onChange={(e) => setEvaluatorRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >
                    <option value="PAR Director">PAR Director</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Staff/Coordinator">Staff / Coordinator</option>
                    <option value="Parent Evaluator">Parent Evaluator</option>
                  </select>
                </div>
              </div>

              {/* Sliders for 8 criteria */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Rate Characteristics (1.0 - 5.0 Likert Scale):
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Functional Suitability:</span>
                    <span className="font-bold text-slate-900 tabular-nums">{functionalSuitability}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={functionalSuitability}
                    onChange={(e) => setFunctionalSuitability(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Usability & Ease of Use:</span>
                    <span className="font-bold text-slate-900 tabular-nums">{usability}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={usability}
                    onChange={(e) => setUsability(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Security & Data Privacy:</span>
                    <span className="font-bold text-slate-900 tabular-nums">{security}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={security}
                    onChange={(e) => setSecurity(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Performance Efficiency:</span>
                    <span className="font-bold text-slate-900 tabular-nums">{performanceEfficiency}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={performanceEfficiency}
                    onChange={(e) => setPerformanceEfficiency(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualitative Feedback & Remarks:</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter observation on system capability, QF-PAR-01 intake, or SMS transmission..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
