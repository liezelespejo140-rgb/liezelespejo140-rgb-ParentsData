import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ISATUCampus,
  IloiloCityCollege,
  RespondentType,
  CivilStatus,
  EmploymentStatus,
  EmploymentType,
  AffiliationType,
  SocioEconomicBracket,
  NatureOfWork,
  Parent,
  Student
} from '../types';
import { X, FileText, Check, Plus, ShieldCheck, ChevronRight } from 'lucide-react';

interface ParentIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NATURE_OF_WORK_OPTIONS: NatureOfWork[] = [
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

const INCOME_BRACKETS: SocioEconomicBracket[] = [
  'Below Php 10,000',
  'PhP 11,000- PhP 20,000',
  'PhP 21,000- PhP 30,000',
  'PhP 31,000- PhP 40,000',
  'PhP 41,000- PhP 50,000',
  'PhP 51,000 and above',
];

export const ParentIntakeModal: React.FC<ParentIntakeModalProps> = ({ isOpen, onClose }) => {
  const { addParentWithStudent } = useApp();

  const [activeTab, setActiveTab] = useState<'part1a' | 'part1b' | 'part2'>('part1a');

  // PART 1A Form State
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [respondentType, setRespondentType] = useState<RespondentType>('Parent (Mother)');
  const [respondentOther, setRespondentOther] = useState('');
  const [completeAddress, setCompleteAddress] = useState('La Paz, Iloilo City');
  const [civilStatus, setCivilStatus] = useState<CivilStatus>('Married');
  const [educationalAttainment, setEducationalAttainment] = useState('College Graduate');
  const [contactNumber, setContactNumber] = useState('+63 ');
  const [emailAddress, setEmailAddress] = useState('');
  const [facebookAccount, setFacebookAccount] = useState('facebook.com/');
  const [religiousAffiliation, setReligiousAffiliation] = useState('Roman Catholic');
  const [sex, setSex] = useState<'Male' | 'Female'>('Female');
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>('Employed');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full Time (Permanent)');
  const [affiliation, setAffiliation] = useState<AffiliationType>('Government');
  const [manualIncomeAmount, setManualIncomeAmount] = useState('25,000.00');
  const [selectedNatureOfWork, setSelectedNatureOfWork] = useState<NatureOfWork[]>(['Healthcare']);
  const [natureOfWorkOther, setNatureOfWorkOther] = useState('');
  const [nameOfEmployer, setNameOfEmployer] = useState('');
  const [addressOfEmployer, setAddressOfEmployer] = useState('');
  const [unemployedSupport, setUnemployedSupport] = useState('');
  const [specialSkills, setSpecialSkills] = useState('');

  // PART 1B Spouse State
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseName, setSpouseName] = useState('');
  const [spouseEducation, setSpouseEducation] = useState('College Graduate');
  const [spouseContact, setSpouseContact] = useState('+63 ');
  const [spouseEmail, setSpouseEmail] = useState('');
  const [spouseFacebook, setSpouseFacebook] = useState('facebook.com/');
  const [spouseEmploymentStatus, setSpouseEmploymentStatus] = useState<EmploymentStatus>('Employed');
  const [spouseEmploymentType, setSpouseEmploymentType] = useState<EmploymentType>('Full Time (Permanent)');
  const [spouseAffiliation, setSpouseAffiliation] = useState<AffiliationType>('Private');
  const [spouseNatureOfWork, setSpouseNatureOfWork] = useState<NatureOfWork[]>(['Information Technology']);
  const [spouseEmployer, setSpouseEmployer] = useState('');
  const [spouseEmployerAddress, setSpouseEmployerAddress] = useState('');
  const [spouseSkills, setSpouseSkills] = useState('');

  // PART 2 Student State
  const [studentLastName, setStudentLastName] = useState('');
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentMiddleInitial, setStudentMiddleInitial] = useState('');
  const [studentNumber, setStudentNumber] = useState('2025-0');
  const [courseYearSection, setCourseYearSection] = useState('BSIT 1-A');
  const [campus, setCampus] = useState<ISATUCampus>('Iloilo City');
  const [college, setCollege] = useState<IloiloCityCollege>('College of Computing and Informatics');
  const [studentCivilStatus, setStudentCivilStatus] = useState<CivilStatus>('Single');
  const [studentAddress, setStudentAddress] = useState('');
  const [studentContact, setStudentContact] = useState('+63 ');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentFB, setStudentFB] = useState('facebook.com/');

  if (!isOpen) return null;

  const handleNatureToggle = (work: NatureOfWork) => {
    setSelectedNatureOfWork((prev) =>
      prev.includes(work) ? prev.filter((w) => w !== work) : [...prev, work]
    );
  };

  const handleSpouseNatureToggle = (work: NatureOfWork) => {
    setSpouseNatureOfWork((prev) =>
      prev.includes(work) ? prev.filter((w) => w !== work) : [...prev, work]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!lastName.trim() || !firstName.trim() || !emailAddress.trim()) {
      alert('Please fill in required parent name and email.');
      return;
    }

    const parentFullName = `${firstName.trim()} ${middleName.trim() ? middleName.trim().charAt(0) + '. ' : ''}${lastName.trim()}`;
    const studentFullName = `${studentFirstName.trim() || firstName.trim()} ${studentMiddleInitial.trim() ? studentMiddleInitial.trim() + ' ' : ''}${studentLastName.trim() || lastName.trim()}`;

    const cleanedIncome = manualIncomeAmount.trim();
    const parsedAmount = parseFloat(cleanedIncome.replace(/[^0-9.]/g, ''));
    const formattedIncome = cleanedIncome
      ? (cleanedIncome.startsWith('₱') || cleanedIncome.startsWith('PhP') || cleanedIncome.startsWith('PHP')
          ? cleanedIncome
          : `PhP ${cleanedIncome}`)
      : 'PhP 25,000.00';

    const parentPayload: Omit<Parent, 'id'> = {
      documentCode: 'QF-PAR-01',
      revNo: '02',
      effectiveDate: 'April 15, 2026',
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      fullName: parentFullName,
      respondentType,
      respondentOtherSpecify: respondentOther.trim() || undefined,
      completeAddress: completeAddress.trim(),
      civilStatus,
      educationalAttainment: educationalAttainment.trim(),
      contactNumber: contactNumber.trim(),
      emailAddress: emailAddress.trim(),
      facebookAccount: facebookAccount.trim(),
      religiousAffiliation: religiousAffiliation.trim(),
      sex,
      employmentStatus,
      employmentType: employmentStatus === 'Employed' ? employmentType : undefined,
      affiliation: employmentStatus === 'Employed' ? affiliation : undefined,
      socioEconomicStatus: formattedIncome,
      monthlyIncomeAmount: !isNaN(parsedAmount) ? parsedAmount : undefined,
      natureOfWork: selectedNatureOfWork,
      natureOfWorkOtherSpecify: natureOfWorkOther.trim() || undefined,
      nameOfEmployer: nameOfEmployer.trim() || undefined,
      addressOfEmployer: addressOfEmployer.trim() || undefined,
      unemployedSourceOfIncome: unemployedSupport.trim() || undefined,
      specialSkills: specialSkills.trim(),
      spouse: {
        hasSpouse,
        nameOfSpouse: hasSpouse ? spouseName.trim() : undefined,
        educationalAttainment: hasSpouse ? spouseEducation.trim() : undefined,
        contactNumber: hasSpouse ? spouseContact.trim() : undefined,
        emailAddress: hasSpouse ? spouseEmail.trim() : undefined,
        facebookAccount: hasSpouse ? spouseFacebook.trim() : undefined,
        employmentStatus: hasSpouse ? spouseEmploymentStatus : undefined,
        employmentType: hasSpouse && spouseEmploymentStatus === 'Employed' ? spouseEmploymentType : undefined,
        affiliation: hasSpouse && spouseEmploymentStatus === 'Employed' ? spouseAffiliation : undefined,
        natureOfWork: hasSpouse ? spouseNatureOfWork : undefined,
        nameOfEmployer: hasSpouse ? spouseEmployer.trim() : undefined,
        addressOfEmployer: hasSpouse ? spouseEmployerAddress.trim() : undefined,
        specialSkills: hasSpouse ? spouseSkills.trim() : undefined,
      },
      studentIds: [],
      returnSlipSubmitted: true,
      returnSlipVerifiedAt: new Date().toISOString().split('T')[0],
      returnSlipCode: `PAR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationStatus: 'Verified & Accepted',
      involvementScore: 80,
      involvementStatus: 'Active',
      preferredNotification: 'all',
      pushSubscribed: true,
      registeredAt: new Date().toISOString().split('T')[0],
      lastActiveAt: new Date().toISOString().split('T')[0],
      notes: 'Form QF-PAR-01 submitted digitally through Parents’ Affairs and Relations Portal.',
    };

    const studentPayload: Omit<Student, 'id' | 'parentIds'> = {
      studentNumber: studentNumber.trim(),
      lastName: studentLastName.trim() || lastName.trim(),
      firstName: studentFirstName.trim() || firstName.trim(),
      middleInitial: studentMiddleInitial.trim() || (middleName.trim() ? middleName.trim().charAt(0) + '.' : ''),
      fullName: studentFullName,
      courseYearSection: courseYearSection.trim(),
      program: courseYearSection.split(' ')[0] || 'Bachelor of Science',
      yearLevel: courseYearSection.split(' ')[1] ? `${courseYearSection.split(' ')[1].charAt(0)}th Year` : '1st Year',
      section: courseYearSection.split('-')[1] || 'A',
      academicYear: '2025-2026',
      currentSemester: '1st Semester',
      collegeCode: campus === 'Iloilo City' && college ? (college.match(/\b([A-Z])/g)?.join('') || 'CAS') : 'ISAT-U',
      campus,
      college: campus === 'Iloilo City' ? college : undefined,
      civilStatus: studentCivilStatus,
      completeAddress: studentAddress.trim() || completeAddress.trim(),
      contactNo: studentContact.trim() || contactNumber.trim(),
      emailAddress: studentEmail.trim() || `${firstName.toLowerCase().replace(/[^a-z]/g, '')}.student@isatu.edu.ph`,
      fbAccount: studentFB.trim(),
      moralValues: {
        integrity: 4.8,
        respectAndDecorum: 4.9,
        socialResponsibility: 4.7,
        diligenceAndCraftsmanship: 4.8,
        spiritualityAndFaith: 4.8,
        overallStanding: 'Good Moral Standing',
        commendations: [
          'Courteous, cooperative, and respectful during university enrollment',
          'Committed to upholding the moral character and honor of ISAT U',
        ],
        guidanceNotes: 'New student inventory logged. Recommended for regular student values orientation.',
      },
      guidanceStanding: 'Good Moral Standing',
      behavioralRating: 'Exemplary',
      guidanceClearanceStatus: 'Cleared',
      overallAttendanceRate: 100.0,
      totalAbsences: 0,
      excusedAbsences: 0,
      unexcusedAbsences: 0,
      studentStrengths: [
        'Courteous, cooperative, and respectful during university enrollment',
        'Demonstrates eagerness to cultivate sound ethical character and civic values',
      ],
      recommendedParentSupport: [
        'Encourage positive study and moral habits at home',
        'Participate in quarterly college PTA meetings and university events',
      ],
      counselor: {
        name: 'Prof. Arthur Magbanua, RGC',
        email: 'guidance@isatu.edu.ph',
        office: 'Guidance and Counseling Center, Student Center 2nd Flr',
        contact: '+63 (033) 320-7190 loc. 128',
      },
      counselingRecords: [
        {
          id: `coun-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          category: 'Routine Intake & Progress',
          counselorName: 'Prof. Arthur Magbanua, RGC',
          summary: 'Completed QF-PAR-01 intake questionnaire & student character inventory.',
          actionPlan: 'Endorsed for general university standing.',
          status: 'Completed',
          parentInformed: true,
        },
      ],
    };

    addParentWithStudent(parentPayload, studentPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching QF-PAR-01 Form Header */}
        <div className="bg-[#0b2545] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                  Doc Code: QF-PAR-01 · Rev. 02
                </span>
                <span className="text-[10px] text-blue-200 hidden sm:inline">
                  Dept: Parents’ Affairs and Relations
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight mt-0.5">
                PARENT’S/GUARDIAN’S DATA FORM (QF-PAR-01)
              </h3>
              <p className="text-[11px] text-blue-100">
                Official form for collecting parent data, socioeconomic background, spouse data, and student moral values
              </p>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('part1a')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'part1a' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              1. PART 1A: Parent / Guardian
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('part1b')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'part1b' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              2. PART 1B: Spouse Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('part2')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'part2' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              3. PART 2: Student & Campus
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* TAB 1: PART 1A */}
          {activeTab === 'part1a' && (
            <div className="space-y-4 text-xs">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 leading-relaxed italic">
                Direction: Kindly don’t leave any item unanswered. Rest assured that all information written on this form will be kept with utmost confidentiality.
              </div>

              {/* Name Fields */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Name of Parent / Guardian *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Middle Name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                    />
                  </div>
                </div>
              </div>

              {/* Respondent Type */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block font-bold text-slate-800 mb-1.5">
                  As Respondent, please check:
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  {(['Parent (Mother)', 'Parent (Father)', 'Guardian', 'Others'] as RespondentType[]).map((type) => (
                    <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="respondentType"
                        checked={respondentType === type}
                        onChange={() => setRespondentType(type)}
                        className="text-[#0b2545]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {respondentType === 'Others' && (
                  <input
                    type="text"
                    placeholder="Please specify relationship"
                    value={respondentOther}
                    onChange={(e) => setRespondentOther(e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 border border-slate-300 rounded"
                  />
                )}
              </div>

              {/* Address & Demographic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Complete Address *</label>
                  <input
                    type="text"
                    required
                    value={completeAddress}
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder="House/Street, Barangay, City/Municipality, Province"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Civil Status</label>
                  <select
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value as CivilStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sex</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="sex"
                        checked={sex === 'Male'}
                        onChange={() => setSex('Male')}
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="sex"
                        checked={sex === 'Female'}
                        onChange={() => setSex('Female')}
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Educational Attainment</label>
                  <input
                    type="text"
                    value={educationalAttainment}
                    onChange={(e) => setEducationalAttainment(e.target.value)}
                    placeholder="e.g. College Graduate (Course)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Religious Affiliation</label>
                  <input
                    type="text"
                    value={religiousAffiliation}
                    onChange={(e) => setReligiousAffiliation(e.target.value)}
                    placeholder="e.g. Roman Catholic, Christian, etc."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+63 917 123 4567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Facebook Account</label>
                  <input
                    type="text"
                    value={facebookAccount}
                    onChange={(e) => setFacebookAccount(e.target.value)}
                    placeholder="facebook.com/username or Name on FB"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Employment Status */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block font-bold text-slate-800 mb-1.5">Employment Status</label>
                <div className="flex items-center gap-4">
                  {(['Employed', 'Unemployed', 'Self Employed'] as EmploymentStatus[]).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="empStatus"
                        checked={employmentStatus === st}
                        onChange={() => setEmploymentStatus(st)}
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>

                {employmentStatus === 'Employed' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">If Employed:</label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded"
                      >
                        <option value="Full Time (Permanent)">Full Time (Permanent)</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Part Time">Part Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Affiliation:</label>
                      <select
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value as AffiliationType)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded"
                      >
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Socio-Economic Status */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-800">
                    Socio-Economic Status (Family Monthly Income) *
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Manual Amount Entry</span>
                </div>
                <div>
                  <div className="relative rounded-lg border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#0b2545] focus-within:border-[#0b2545] transition-all overflow-hidden flex items-center shadow-xs">
                    <div className="bg-slate-100 text-slate-700 font-bold px-3 py-2 text-xs border-r border-slate-300 flex items-center gap-1 select-none shrink-0">
                      <span>₱ (PhP)</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={manualIncomeAmount}
                      onChange={(e) => setManualIncomeAmount(e.target.value)}
                      placeholder="Fill in manual monthly income amount (e.g. 25,000.00)"
                      className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Enter the exact monthly family / household income in Philippine Peso.
                  </p>
                </div>
              </div>

              {/* Nature of Work (Multi-select) */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Nature of work (You can choose more than 1)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NATURE_OF_WORK_OPTIONS.map((work) => (
                    <label key={work} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedNatureOfWork.includes(work)}
                        onChange={() => handleNatureToggle(work)}
                      />
                      <span>{work}</span>
                    </label>
                  ))}
                </div>
                {selectedNatureOfWork.includes('Others') && (
                  <input
                    type="text"
                    placeholder="Specify nature of work"
                    value={natureOfWorkOther}
                    onChange={(e) => setNatureOfWorkOther(e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 border border-slate-300 rounded"
                  />
                )}
              </div>

              {/* Employer Details & Special Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Name of Employer</label>
                  <input
                    type="text"
                    value={nameOfEmployer}
                    onChange={(e) => setNameOfEmployer(e.target.value)}
                    placeholder="Company / Agency Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address of Employer</label>
                  <input
                    type="text"
                    value={addressOfEmployer}
                    onChange={(e) => setAddressOfEmployer(e.target.value)}
                    placeholder="Employer address"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    If unemployed, state source of income/ financial support (4P’s, Tulong Dunong, Sponsorship, etc.)
                  </label>
                  <input
                    type="text"
                    value={unemployedSupport}
                    onChange={(e) => setUnemployedSupport(e.target.value)}
                    placeholder="e.g. 4Ps Beneficiary, Relative Assistance"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Special Skills</label>
                  <input
                    type="text"
                    value={specialSkills}
                    onChange={(e) => setSpecialSkills(e.target.value)}
                    placeholder="e.g. Carpentry, First Aid, Baking, Electrical Wiring"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('part1b')}
                  className="bg-[#0b2545] hover:bg-[#133c70] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-1.5"
                >
                  Proceed to PART 1B (Spouse) <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PART 1B SPOUSE */}
          {activeTab === 'part1b' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">PART 1B: Spouse Information</span>
                  <span className="text-[11px] text-slate-500">Answer this part only if applicable.</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-900">
                  <input
                    type="checkbox"
                    checked={hasSpouse}
                    onChange={(e) => setHasSpouse(e.target.checked)}
                    className="rounded text-[#0b2545]"
                  />
                  <span>Has Spouse / Complete Part 1B</span>
                </label>
              </div>

              {hasSpouse ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Name of Spouse</label>
                    <input
                      type="text"
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                      placeholder="Spouse Full Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Educational Attainment</label>
                      <input
                        type="text"
                        value={spouseEducation}
                        onChange={(e) => setSpouseEducation(e.target.value)}
                        placeholder="e.g. College Graduate"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Contact Number</label>
                      <input
                        type="tel"
                        value={spouseContact}
                        onChange={(e) => setSpouseContact(e.target.value)}
                        placeholder="+63 917 000 0000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={spouseEmail}
                        onChange={(e) => setSpouseEmail(e.target.value)}
                        placeholder="spouse@email.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Facebook Account</label>
                      <input
                        type="text"
                        value={spouseFacebook}
                        onChange={(e) => setSpouseFacebook(e.target.value)}
                        placeholder="facebook.com/spouse"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Spouse Employment */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block font-bold text-slate-800 mb-1">Spouse Employment Status</label>
                    <div className="flex items-center gap-4">
                      {(['Employed', 'Unemployed', 'Self Employed'] as EmploymentStatus[]).map((st) => (
                        <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="spouseEmpStatus"
                            checked={spouseEmploymentStatus === st}
                            onChange={() => setSpouseEmploymentStatus(st)}
                          />
                          <span>{st}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Spouse Nature of Work */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Nature of Work (Spouse)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {NATURE_OF_WORK_OPTIONS.map((work) => (
                        <label key={work} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={spouseNatureOfWork.includes(work)}
                            onChange={() => handleSpouseNatureToggle(work)}
                          />
                          <span>{work}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Name of Employer</label>
                      <input
                        type="text"
                        value={spouseEmployer}
                        onChange={(e) => setSpouseEmployer(e.target.value)}
                        placeholder="Employer name"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Special Skills</label>
                      <input
                        type="text"
                        value={spouseSkills}
                        onChange={(e) => setSpouseSkills(e.target.value)}
                        placeholder="Skills"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  Part 1B is skipped for single parent households. Proceed to Part 2 to link student details.
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('part1a')}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  ← Back to Part 1A
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('part2')}
                  className="bg-[#0b2545] hover:bg-[#133c70] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-1.5"
                >
                  Proceed to PART 2 (Student) <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PART 2 STUDENT & CAMPUS */}
          {activeTab === 'part2' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-900 block text-sm">PART 2: Name of Student & Campus Selection</span>
                <span className="text-[11px] text-amber-700">
                  Select student campus and university college, complete address, and character monitoring data.
                </span>
              </div>

              {/* Student Name */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Student Last Name *</label>
                  <input
                    type="text"
                    required
                    value={studentLastName}
                    onChange={(e) => setStudentLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={studentFirstName}
                    onChange={(e) => setStudentFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Middle Initial</label>
                  <input
                    type="text"
                    value={studentMiddleInitial}
                    onChange={(e) => setStudentMiddleInitial(e.target.value)}
                    placeholder="e.g. M."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID Number</label>
                  <input
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="e.g. 2025-0192-A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Year & Section *</label>
                  <input
                    type="text"
                    required
                    value={courseYearSection}
                    onChange={(e) => setCourseYearSection(e.target.value)}
                    placeholder="e.g. BSIT 1-A or BSECE 3-B"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Campus Radio Selection matching Form */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block font-bold text-slate-800 mb-1">Campus (Check one):</label>
                <div className="flex flex-wrap gap-4 mt-1">
                  {(['Iloilo City', 'Barotac Nuevo', 'Dumangas', 'Leon', 'Miag-ao'] as ISATUCampus[]).map((c) => (
                    <label key={c} className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="campus"
                        checked={campus === c}
                        onChange={() => setCampus(c)}
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* College for Iloilo City Campus Only */}
              {campus === 'Iloilo City' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <label className="block font-bold text-[#0b2545] mb-1">
                    College for Iloilo City Campus Only:
                  </label>
                  <div className="space-y-1.5 mt-1">
                    {(
                      [
                        'College of Arts and Sciences',
                        'College of Education',
                        'College of Engineering and Architecture',
                        'College of Industrial Technology',
                        'College of Computing and Informatics',
                      ] as IloiloCityCollege[]
                    ).map((col) => (
                      <label key={col} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="college"
                          checked={college === col}
                          onChange={() => setCollege(col)}
                        />
                        <span>{col}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Contact No.</label>
                  <input
                    type="tel"
                    value={studentContact}
                    onChange={(e) => setStudentContact(e.target.value)}
                    placeholder="+63 900 000 0000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student FB Account</label>
                  <input
                    type="text"
                    value={studentFB}
                    onChange={(e) => setStudentFB(e.target.value)}
                    placeholder="facebook.com/student"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Return Slip Confirmation Box */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">QF-PAR-01 Return Slip Auto-Generation</span>
                    <span className="text-[10px] text-emerald-700">
                      Submitting will generate your verifiable Return Slip for university clearance and PTA assembly attendance.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('part1b')}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  ← Back to Part 1B
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0b2545] hover:bg-[#133c70] text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-amber-400" />
                    Submit QF-PAR-01 Form
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
