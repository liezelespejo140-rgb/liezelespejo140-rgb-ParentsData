import React from 'react';
import { Parent, Student } from '../types';
import { X, Printer, ShieldCheck, CheckSquare, Square, FileText } from 'lucide-react';

interface QFPAR01PrintModalProps {
  parent: Parent | null;
  student: Student | null;
  onClose: () => void;
}

export const QFPAR01PrintModal: React.FC<QFPAR01PrintModalProps> = ({
  parent,
  student,
  onClose,
}) => {
  if (!parent) return null;

  const handlePrint = () => {
    window.print();
  };

  const natureOfWorkList = [
    'Academe',
    'Agriculture/ Farming',
    'Government',
    'Healthcare',
    'Information Technology',
    'Business Management',
    'Construction',
    'Fisheries',
    'Electronics',
    'OFW',
    'Seafarer',
    'Military',
    'Others',
  ];

  const incomeBrackets = [
    'Below Php 10,000',
    'PhP 11,000- PhP 20,000',
    'PhP 21,000- PhP 30,000',
    'PhP 31,000- PhP 40,000',
    'PhP 41,000- PhP 50,000',
    'PhP 51,000 and above',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (hidden on print) */}
        <div className="bg-[#0b2545] px-6 py-3 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4" /> Official ISAT U Form: QF-PAR-01 
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Form / PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Document Body */}
        <div className="p-4 sm:p-10 bg-white text-slate-900 font-sans text-xs leading-normal print:p-0 overflow-x-auto">
          <div className="min-w-[650px] print:min-w-0">
            {/* Header Table matching QF-PAR-01 */}
            <div className="border-2 border-slate-900 mb-4">
            <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
              {/* Left Logo & University Title */}
              <div className="col-span-8 p-3 flex items-center gap-3">
                <div className="w-16 h-16 shrink-0 border border-slate-300 p-0.5 rounded-full flex items-center justify-center">
                  <img
                    src="/src/assets/images/regenerated_image_1792137891214.png"
                    alt="ISAT U Seal"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="text-center flex-1">
                  <div className="text-[10px] tracking-widest uppercase font-semibold text-slate-700">
                    Republic of the Philippines
                  </div>
                  <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-[#0b2545]">
                    ILOILO SCIENCE AND TECHNOLOGY UNIVERSITY
                  </h1>
                  <div className="text-[11px] text-slate-600">La Paz, Iloilo City</div>
                  <div className="mt-1 text-xs font-extrabold uppercase tracking-wider text-slate-900 border-t border-slate-300 pt-0.5">
                    PARENT’S/GUARDIAN’S DATA FORM
                  </div>
                </div>
              </div>

              {/* Right Metadata Box */}
              <div className="col-span-4 divide-y-2 divide-slate-900 text-[10px]">
                <div className="p-1.5 font-semibold">
                  <span className="text-slate-500 block text-[9px]">Department:</span>
                  Parents’ Affairs and Relations
                </div>
                <div className="p-1.5 font-mono font-bold">
                  <span className="text-slate-500 block text-[9px] font-sans">Document Code:</span>
                  QF-PAR -01
                </div>
                <div className="p-1.5 font-mono">
                  <span className="text-slate-500 block text-[9px] font-sans">Rev. No.:</span>
                  {parent.revNo || '02'}
                </div>
                <div className="p-1.5 text-[9px]">
                  <span className="text-slate-500 block text-[8px] font-sans">Effective Date:</span>
                  {parent.effectiveDate || 'April 15, 2026'}
                </div>
              </div>
            </div>
          </div>

          {/* Direction / Confidentiality Notice */}
          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded mb-4 text-[11px] leading-relaxed text-slate-700 italic">
            <strong>Direction:</strong> Please fill out this form as directed. Kindly don’t leave any item unanswered. Rest assured that all information written on this form will be kept with utmost confidentiality.
          </div>

          {/* Main 2-Column Split: Part 1A & Part 1B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-slate-900 pb-5">
            {/* PART 1A: Parent/Guardian Data */}
            <div className="space-y-2.5">
              <div className="font-extrabold text-sm uppercase text-[#0b2545] border-b border-slate-900 pb-1 flex items-center justify-between">
                <span>PART 1A: Parent / Guardian</span>
                <span className="text-[10px] text-slate-500 font-normal">Personal Data</span>
              </div>

              <div>
                <span className="font-bold text-[11px] block">Name of Parent/ Guardian:</span>
                <div className="grid grid-cols-3 gap-2 mt-0.5 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[9px] block">Last Name:</span>
                    <span className="font-semibold border-b border-dotted border-slate-700 block pb-0.5">{parent.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">First Name:</span>
                    <span className="font-semibold border-b border-dotted border-slate-700 block pb-0.5">{parent.firstName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">Middle Name:</span>
                    <span className="font-semibold border-b border-dotted border-slate-700 block pb-0.5">{parent.middleName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Respondent Type Checkbox */}
              <div>
                <span className="font-bold text-[10px] block text-slate-700">As Respondent, please check:</span>
                <div className="grid grid-cols-2 gap-1 mt-1 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    {parent.respondentType.includes('Parent') ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Parent ({parent.respondentType.includes('Mother') ? 'Mother' : 'Father'})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    {parent.respondentType === 'Guardian' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Guardian</span>
                  </span>
                  {parent.respondentType === 'Others' && (
                    <span className="col-span-2 text-[10px] text-slate-600">
                      Others: {parent.respondentOtherSpecify}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div>
                  <span className="font-bold text-slate-700">Complete Address:</span>{' '}
                  <span className="border-b border-slate-300 pb-0.5 font-medium">{parent.completeAddress}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold text-slate-700">Civil Status:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5">{parent.civilStatus}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Sex:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5">{parent.sex}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Educational Attainment:</span>{' '}
                  <span className="border-b border-slate-300 pb-0.5">{parent.educationalAttainment}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold text-slate-700">Contact Number:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5 font-mono">{parent.contactNumber}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Religious Affiliation:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5">{parent.religiousAffiliation}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Email Address:</span>{' '}
                  <span className="border-b border-slate-300 pb-0.5">{parent.emailAddress}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Facebook Account:</span>{' '}
                  <span className="border-b border-slate-300 pb-0.5 text-blue-700">{parent.facebookAccount}</span>
                </div>
              </div>

              {/* Employment Status */}
              <div className="pt-1.5 border-t border-slate-200">
                <span className="font-bold text-[10px] block text-slate-700">Employment Status:</span>
                <div className="flex items-center gap-3 mt-0.5 text-[11px]">
                  <span className="flex items-center gap-1">
                    {parent.employmentStatus === 'Employed' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    Employed
                  </span>
                  <span className="flex items-center gap-1">
                    {parent.employmentStatus === 'Unemployed' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    Unemployed
                  </span>
                  <span className="flex items-center gap-1">
                    {parent.employmentStatus === 'Self Employed' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    Self Employed
                  </span>
                </div>

                {parent.employmentStatus === 'Employed' && (
                  <div className="grid grid-cols-2 gap-2 mt-1.5 text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
                    <div>
                      <span className="font-semibold block text-slate-600">If Employed:</span>
                      <div>{parent.employmentType || 'Full Time (Permanent)'}</div>
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-600">Affiliation:</span>
                      <div>{parent.affiliation || 'Private'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Socio-Economic Status */}
              <div className="pt-1.5 border-t border-slate-200">
                <span className="font-bold text-[10px] block text-slate-700">Socio-Economic Status (Family Monthly Income):</span>
                <div className="grid grid-cols-2 gap-1 mt-1 text-[10px]">
                  {incomeBrackets.map((bracket) => (
                    <span key={bracket} className="flex items-center gap-1">
                      {parent.socioEconomicStatus === bracket ? (
                        <CheckSquare className="w-3 h-3 text-blue-900" />
                      ) : (
                        <Square className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{bracket}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Nature of Work */}
              <div className="pt-1.5 border-t border-slate-200">
                <span className="font-bold text-[10px] block text-slate-700">Nature of work (Selected):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {parent.natureOfWork.map((work) => (
                    <span key={work} className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                      ✓ {work}
                    </span>
                  ))}
                </div>
              </div>

              {parent.nameOfEmployer && (
                <div className="text-[11px] space-y-0.5">
                  <div><strong className="text-slate-700">Employer:</strong> {parent.nameOfEmployer}</div>
                  <div><strong className="text-slate-700">Address:</strong> {parent.addressOfEmployer}</div>
                </div>
              )}

              {parent.unemployedSourceOfIncome && (
                <div className="text-[10px] bg-amber-50 p-2 rounded border border-amber-200 text-amber-900">
                  <strong>Source of Financial Support:</strong> {parent.unemployedSourceOfIncome}
                </div>
              )}

              <div>
                <strong className="text-slate-700 text-[10px] block">Special Skills:</strong>
                <div className="text-[11px] italic text-slate-800">{parent.specialSkills || 'None listed'}</div>
              </div>
            </div>

            {/* PART 1B: Spouse Information */}
            <div className="space-y-2.5">
              <div className="font-extrabold text-sm uppercase text-[#0b2545] border-b border-slate-900 pb-1 flex items-center justify-between">
                <span>PART 1B: Spouse Data</span>
                <span className="text-[10px] text-slate-500 font-normal">(If Applicable)</span>
              </div>

              {parent.spouse.hasSpouse ? (
                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-700">Name of Spouse:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5 font-semibold">{parent.spouse.nameOfSpouse}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Educational Attainment:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5">{parent.spouse.educationalAttainment}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Contact Number:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5 font-mono">{parent.spouse.contactNumber}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Email Address:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5">{parent.spouse.emailAddress}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Facebook Account:</span>{' '}
                    <span className="border-b border-slate-300 pb-0.5 text-blue-700">{parent.spouse.facebookAccount}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="font-bold text-[10px] block text-slate-700">Employment Status:</span>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px]">
                      <span className="flex items-center gap-1">
                        {parent.spouse.employmentStatus === 'Employed' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                        Employed
                      </span>
                      <span className="flex items-center gap-1">
                        {parent.spouse.employmentStatus === 'Unemployed' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                        Unemployed
                      </span>
                      <span className="flex items-center gap-1">
                        {parent.spouse.employmentStatus === 'Self Employed' ? <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                        Self Employed
                      </span>
                    </div>
                  </div>

                  {parent.spouse.natureOfWork && parent.spouse.natureOfWork.length > 0 && (
                    <div>
                      <span className="font-bold text-[10px] block text-slate-700">Nature of work:</span>
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
                    <div className="space-y-0.5 text-[10px]">
                      <div><strong>Employer:</strong> {parent.spouse.nameOfEmployer}</div>
                      <div><strong>Address:</strong> {parent.spouse.addressOfEmployer}</div>
                    </div>
                  )}

                  <div>
                    <strong className="text-slate-700 text-[10px] block">Special Skills:</strong>
                    <div className="text-[11px] italic text-slate-800">{parent.spouse.specialSkills || 'None listed'}</div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 italic text-xs border border-dashed border-slate-200 rounded-lg">
                  Not applicable / Single parent household.
                </div>
              )}
            </div>
          </div>

          {/* PART 2: Name of Student & Campus */}
          <div className="mt-5 space-y-3">
            <div className="font-extrabold text-sm uppercase text-[#0b2545] border-b border-slate-900 pb-1 flex items-center justify-between">
              <span>PART 2: Student Academic & Moral Development Profile</span>
              <span className="text-[10px] text-slate-500 font-normal">ISAT U Enrolled Student</span>
            </div>

            {student ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Name of Student:</span>
                    <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Student ID Number:</span>
                    <span className="font-bold font-mono text-slate-900">{student.studentNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Course Year & Section:</span>
                    <span className="font-bold text-slate-900">{student.courseYearSection}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-700 text-[10px] block">Campus:</span>
                    <span className="font-semibold text-slate-900">
                      ✓ {student.campus} Campus
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-[10px] block">College (For Iloilo City Campus Only):</span>
                    <span className="font-semibold text-slate-900">
                      {student.college || 'N/A (External Campus)'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-[10px] block">Student Contact:</span>
                    <span className="text-slate-800">{student.contactNo} · {student.emailAddress}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-[10px] block">Student Facebook Account:</span>
                    <span className="text-blue-700">{student.fbAccount}</span>
                  </div>
                </div>

                {/* Children's Moral Values & Guidance Evaluation */}
                <div className="p-3.5 rounded-lg border-2 border-amber-300 bg-amber-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-[#0b2545] tracking-wide">
                      ISAT U Student Moral Values & Character Formation Evaluation
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {student.moralValues.overallStanding}
                    </span>
                  </div>

                  {/* 5 Core Filipino & ISAT U Moral Values Scales */}
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Integrity</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{student.moralValues.integrity.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Respect & Decorum</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{student.moralValues.respectAndDecorum.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Social Responsibility</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{student.moralValues.socialResponsibility.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Craftsmanship</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{student.moralValues.diligenceAndCraftsmanship.toFixed(1)}/5.0</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-slate-500">Faith & Spirit</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{student.moralValues.spiritualityAndFaith.toFixed(1)}/5.0</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <strong>Counselor Guidance Notes:</strong> {student.moralValues.guidanceNotes}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-slate-400 italic text-center">No student record linked.</div>
            )}
          </div>

          {/* DOTTED TEAR LINE: Return Slip matching QF-PAR-01 */}
          <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-400">
            <div className="bg-slate-100 p-4 border border-slate-300 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-900">
                <span>PARENT’S/GUARDIAN’S DATA FORM Return Slip</span>
                <span className="text-[10px] text-slate-500 font-normal">Department of Parents’ Affairs and Relations</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 text-[9px] block">Last Name:</span>
                  <span className="font-bold border-b border-slate-400 block pb-0.5">{parent.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">First Name:</span>
                  <span className="font-bold border-b border-slate-400 block pb-0.5">{parent.firstName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">Middle Name:</span>
                  <span className="font-bold border-b border-slate-400 block pb-0.5">{parent.middleName || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 text-[9px] block">College / Campus:</span>
                  <span className="border-b border-slate-400 block pb-0.5 font-medium">
                    {student ? `${student.college || ''} · ${student.campus} Campus` : 'ISAT U'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">Course / Year / Section:</span>
                  <span className="border-b border-slate-400 block pb-0.5 font-medium">
                    {student?.courseYearSection || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 text-[9px] block">Contact No.:</span>
                  <span className="border-b border-slate-400 block pb-0.5 font-mono">{parent.contactNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">Email Address:</span>
                  <span className="border-b border-slate-400 block pb-0.5">{parent.emailAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">FB Account:</span>
                  <span className="border-b border-slate-400 block pb-0.5 text-blue-700">{parent.facebookAccount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                <span>Verification Status: <strong className="text-emerald-700">✓ Official Return Slip Logged</strong></span>
                <span>Date: {parent.returnSlipVerifiedAt || '2026-04-15'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
