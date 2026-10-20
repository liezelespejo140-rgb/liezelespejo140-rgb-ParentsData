import React, { useState } from 'react';
import { Student, Parent, ClassScheduleItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Building2,
  FileText,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  CheckCircle,
  ExternalLink,
  Info
} from 'lucide-react';

interface MISEDPInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  parent: Parent;
  schedule: ClassScheduleItem[];
}

export const MISEDPInquiryModal: React.FC<MISEDPInquiryModalProps> = ({
  isOpen,
  onClose,
  student,
  parent,
  schedule,
}) => {
  const { dispatchNotification } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('General Schedule');
  const [inquiryType, setInquiryType] = useState<'Schedule Clarification' | 'Adding Subject Query' | 'Changing Section Query' | 'Dropping Subject Query' | 'Faculty Consultation'>('Schedule Clarification');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    dispatchNotification({
      title: 'MIS/EDP Office Inquiry Submitted',
      body: `Parent inquiry for ${student.fullName} regarding ${selectedSubject} (${inquiryType}) logged with MIS/EDP Office. Ref Ticket: #EDP-INQ-${Date.now().toString().slice(-5)}`,
      channel: 'all',
      targetScope: 'all',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 2200);
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
                  ISAT U Administrative Policy
                </span>
                <span className="text-[11px] text-blue-200">Form QF-REG-03 Protocol</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg leading-tight mt-0.5">
                MIS / EDP Office Collaboration Guidelines
              </h3>
              <p className="text-xs text-blue-100">
                Management Information System / Electronic Data Processing Office
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

        <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Institutional Policy Notice */}
          <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              Official Institutional Enrollment Regulation
            </div>
            <p className="text-slate-800 leading-relaxed">
              <strong>Adding, Changing, and Dropping of subjects</strong> is officially collaborated and processed through the 
              <strong> Management Information System / Electronic Data Processing (MIS/EDP) Office</strong> in coordination with the 
              <strong> Office of the University Registrar</strong> and the respective College Deans.
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              To safeguard academic record integrity and section quotas in the Student Information System (SIS), 
              <strong> parents and students are provided read-only schedule visibility</strong>. Only authorized MIS/EDP personnel can encode enrollment changes into the university database.
            </p>
          </div>

          {/* Official 4-Step Subject Adjustment Procedure */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              Standard Process for Adding, Changing, or Dropping Subjects:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span className="font-bold text-slate-900 text-xs">Adviser & Dean Approval</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-7">
                  Student consults their Academic Adviser ({student.academicAdviser?.name || 'Assigned College Adviser'}) to verify prerequisites and secure the College Dean's signature.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span className="font-bold text-slate-900 text-xs">Accomplish Form QF-REG-03</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-7">
                  Obtain and fill out the official <em>Adding/Changing/Dropping Form (QF-REG-03)</em> from the Registrar or Department Chairperson.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span className="font-bold text-slate-900 text-xs">MIS / EDP Office Encoding</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-7">
                  Submit the endorsed form to the MIS/EDP Office. System encoders update the SIS database, generate an EDP Control Number, and adjust class master lists.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span className="font-bold text-slate-900 text-xs">Synchronized on Parent Wall</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-7">
                  Once encoded by MIS/EDP, the updated schedule, assigned faculty, room, and units immediately reflect on this portal for parents to monitor.
                </p>
              </div>
            </div>
          </div>

          {/* MIS / EDP Office Contact Details */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
            <h5 className="font-bold text-blue-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-700" />
              MIS / EDP Office Directory & Location:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-700">
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Office Location:</span>
                <span className="font-semibold text-slate-900">2nd Floor, Administration Building</span>
                <span className="text-slate-500 block">ICT / MIS Center, Main Campus</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Office Hours:</span>
                <span className="font-semibold text-slate-900">Monday – Friday</span>
                <span className="text-slate-600 block">8:00 AM – 5:00 PM (No Noon Break)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Hotline & Email:</span>
                <span className="font-semibold text-blue-700 font-mono">(033) 320-7190 loc. 132</span>
                <span className="text-slate-600 block">mis.edp@isatu.edu.ph</span>
              </div>
            </div>
          </div>

          {/* Inquiry / Concern Form */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Parent Schedule Inquiry & Verification Ticket
            </h4>
            <p className="text-slate-500 text-[11px] mb-3">
              Have a question regarding your child's schedule, room assignment, or faculty instructor? Transmit an official inquiry note to the MIS/EDP Office and Guidance Center.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-emerald-900 text-xs">Inquiry Transmitted to MIS/EDP Office</h5>
                <p className="text-[11px] text-emerald-700">
                  Your ticket has been queued. An official response will be routed to your registered contact number and email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inquiry Category</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#0b2545]"
                    >
                      <option value="Schedule Clarification">Schedule Clarification / Room Check</option>
                      <option value="Adding Subject Query">Adding Subject Procedure Query</option>
                      <option value="Changing Section Query">Changing Section / Conflict Query</option>
                      <option value="Dropping Subject Query">Dropping Subject Procedure Query</option>
                      <option value="Faculty Consultation">Faculty Consultation Hour Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#0b2545]"
                    >
                      <option value="General Schedule">All Enrolled Subjects ({schedule.length})</option>
                      {schedule.map((item) => (
                        <option key={item.id} value={`${item.subjectCode} - ${item.subjectTitle}`}>
                          {item.subjectCode}: {item.subjectTitle} ({item.instructor})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Parent Inquiry / Message *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter details of your schedule concern, conflict, or question for the MIS/EDP and PAR Guidance Office..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Parent: <strong>{parent.fullName}</strong> ({parent.contactNumber})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0b2545] hover:bg-[#133c70] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      Submit to MIS/EDP
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
