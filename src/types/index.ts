export type ISATUCampus =
  | 'Iloilo City'
  | 'Barotac Nuevo'
  | 'Dumangas'
  | 'Leon'
  | 'Miag-ao';

export type IloiloCityCollege =
  | 'College of Arts and Sciences'
  | 'College of Education'
  | 'College of Engineering and Architecture'
  | 'College of Industrial Technology'
  | 'College of Computing and Informatics';

export type RespondentType =
  | 'Parent (Mother)'
  | 'Parent (Father)'
  | 'Guardian'
  | 'Others';

export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';

export type EmploymentStatus = 'Employed' | 'Unemployed' | 'Self Employed';

export type EmploymentType = 'Full Time (Permanent)' | 'Contractual' | 'Part Time';

export type AffiliationType = 'Government' | 'Private';

export type SocioEconomicBracket =
  | 'Below Php 10,000'
  | 'PhP 11,000- PhP 20,000'
  | 'PhP 21,000- PhP 30,000'
  | 'PhP 31,000- PhP 40,000'
  | 'PhP 41,000- PhP 50,000'
  | 'PhP 51,000 and above';

export type NatureOfWork =
  | 'Academe'
  | 'Agriculture/ Farming'
  | 'Government'
  | 'Healthcare'
  | 'Information Technology'
  | 'Business Management'
  | 'Construction'
  | 'Fisheries'
  | 'Electronics'
  | 'OFW'
  | 'Seafarer'
  | 'Military'
  | 'Others';

export type InvolvementTier =
  | 'Highly Engaged'
  | 'Active'
  | 'Moderate'
  | 'Needs Follow-up'
  | 'Inactive';

export type GuidanceStanding =
  | 'Exemplary Moral Character'
  | 'Good Moral Standing'
  | 'Special Commendation'
  | 'Under Routine Advisement'
  | 'Developing Core Values'
  | 'Attendance Intervention'
  | 'Requires Parent Dialogue'
  | 'Values Guidance Required';

export type MoralStanding = GuidanceStanding;

export type BehavioralRating =
  | 'Exemplary'
  | 'Commendable'
  | 'Satisfactory'
  | 'Needs Improvement'
  | 'Critical Intervention';

export type ClearanceStatus = 'Cleared' | 'Pending Interview' | 'Conditional Clearance';

export interface MoralValuesAssessment {
  integrity: number; // 1-5 scale
  respectAndDecorum: number; // 1-5
  socialResponsibility: number; // 1-5
  diligenceAndCraftsmanship: number; // 1-5
  spiritualityAndFaith: number; // 1-5
  overallStanding: MoralStanding;
  commendations: string[];
  guidanceNotes: string;
}

export interface CounselingRecord {
  id: string;
  date: string;
  time?: string;
  category:
    | 'Moral Values & Character Formation'
    | 'Academic Adjustment & Motivation'
    | 'Attendance Follow-up'
    | 'Career Guidance & Internship'
    | 'Peer Relations & Conduct'
    | 'Emotional Well-Being'
    | 'Routine Intake & Progress';
  counselorName: string;
  summary: string;
  actionPlan: string;
  status: 'Completed' | 'Follow-up Scheduled' | 'Case Closed';
  parentInformed: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface ClassScheduleItem {
  id: string;
  subjectCode: string;
  subjectTitle: string;
  days: DayOfWeek[];
  startTime: string; // e.g. "08:00 AM"
  endTime: string; // e.g. "09:30 AM"
  room: string;
  building?: string;
  instructor: string;
  instructorEmail?: string;
  facultyTitle?: string; // e.g. "Associate Professor II", "Instructor III"
  facultyDepartment?: string; // e.g. "Dept of Computer Studies"
  consultationHours?: string; // e.g. "Mon/Wed 1:00 PM – 3:00 PM"
  units: number;
  type: 'Lecture' | 'Laboratory' | 'Shop' | 'PE/NSTP';
  colorTheme?: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose' | 'sky' | 'indigo';
  enrollmentStatus?: 'Enrolled' | 'Added via MIS/EDP' | 'Changed via MIS/EDP' | 'Dropped via MIS/EDP';
  edpControlNumber?: string;
  edpVerifiedAt?: string;
}

export interface MISEDPSubjectTransaction {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  transactionType: 'Add Subject' | 'Change Subject' | 'Drop Subject';
  subjectCode: string;
  subjectTitle: string;
  facultyInstructor: string;
  edpControlNumber: string;
  officerName: string;
  remarks: string;
  formReference: string; // e.g. "QF-REG-03 (Adding/Changing/Dropping Form)"
}

// Student Data matching Part 2 of QF-PAR-01
export interface Student {
  id: string;
  studentNumber: string; // e.g. 2023-0184-A
  lastName: string;
  firstName: string;
  middleInitial: string;
  fullName: string;
  courseYearSection: string; // e.g. BSIT 3-A
  program: string; // e.g. BS Information Technology
  yearLevel: string; // e.g. 3rd Year
  section: string; // e.g. A
  academicYear: string; // e.g. 2025-2026
  currentSemester: string; // e.g. 1st Semester
  collegeCode?: string; // e.g. CICT, CEA, CIT, CAS, COE
  campus: ISATUCampus;
  college?: IloiloCityCollege; // For Iloilo City Campus
  civilStatus: CivilStatus;
  completeAddress: string;
  contactNo: string;
  emailAddress: string;
  fbAccount: string;
  parentIds: string[];
  // Class Schedule for Parent Monitoring
  classSchedule?: ClassScheduleItem[];
  academicAdviser?: {
    name: string;
    email?: string;
    office?: string;
  };
  // Moral values and guidance monitoring
  moralValues: MoralValuesAssessment;
  guidanceStanding: GuidanceStanding;
  behavioralRating: BehavioralRating;
  guidanceClearanceStatus: ClearanceStatus;
  overallAttendanceRate: number;
  totalAbsences: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  studentStrengths: string[];
  recommendedParentSupport: string[];
  counselor: {
    name: string;
    email: string;
    office: string;
    contact: string;
  };
  counselingRecords: CounselingRecord[];
  notes?: string;
}

// Spouse Data matching Part 1B of QF-PAR-01
export interface SpouseData {
  hasSpouse: boolean;
  nameOfSpouse?: string;
  educationalAttainment?: string;
  contactNumber?: string;
  emailAddress?: string;
  facebookAccount?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  affiliation?: AffiliationType;
  natureOfWork?: NatureOfWork[];
  nameOfEmployer?: string;
  addressOfEmployer?: string;
  specialSkills?: string;
}

// Parent/Guardian matching Part 1A & Document Header of QF-PAR-01
export interface Parent {
  id: string;
  documentCode: 'QF-PAR-01';
  revNo: '02';
  effectiveDate: 'April 15, 2026';
  // Part 1A
  lastName: string;
  firstName: string;
  middleName: string;
  fullName: string;
  respondentType: RespondentType;
  respondentOtherSpecify?: string;
  completeAddress: string;
  civilStatus: CivilStatus;
  educationalAttainment: string;
  contactNumber: string;
  emailAddress: string;
  facebookAccount: string;
  religiousAffiliation: string;
  sex: 'Male' | 'Female';
  employmentStatus: EmploymentStatus;
  employmentType?: EmploymentType;
  affiliation?: AffiliationType;
  socioEconomicStatus: SocioEconomicBracket | string;
  monthlyIncomeAmount?: number;
  natureOfWork: NatureOfWork[];
  natureOfWorkOtherSpecify?: string;
  nameOfEmployer?: string;
  addressOfEmployer?: string;
  unemployedSourceOfIncome?: string; // e.g. 4Ps, Tulong Dunong, Sponsorship
  specialSkills: string;
  // Part 1B
  spouse: SpouseData;
  // Linkages & Monitoring
  studentIds: string[];
  returnSlipSubmitted: boolean;
  returnSlipVerifiedAt?: string;
  returnSlipCode?: string;
  verificationStatus?: 'Verified & Accepted' | 'Pending Review' | 'Needs Correction';
  isArchived?: boolean;
  involvementScore: number; // 0 - 100
  involvementStatus: InvolvementTier;
  preferredNotification: 'all' | 'push' | 'email' | 'sms';
  pushSubscribed: boolean;
  registeredAt: string;
  lastActiveAt: string;
  notes?: string;
  // Aliases / helper properties for convenience
  email?: string;
  address?: any;
  relationship?: string;
  occupation?: string;
}

export interface InvolvementRecord {
  id: string;
  parentId: string;
  parentName: string;
  studentName?: string;
  title: string;
  type:
    | 'GPTA Assembly'
    | 'College PTA Meeting'
    | 'Parents Affairs and Relations Forum'
    | 'Parent-Teacher Conference'
    | 'University Foundation Week'
    | 'Moral Values & Guidance Dialogue'
    | 'Community Extension';
  date: string;
  time?: string;
  status: 'Attended' | 'Excused' | 'Absent' | 'Virtual Attendance';
  verifiedBy: string;
  feedback?: string;
  eventId?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  category:
    | 'PTA Assembly'
    | 'Parents Affairs Forum'
    | 'Academic Calendar'
    | 'University Event'
    | 'Moral Values & Guidance'
    | 'Technology Fair';
  date: string;
  time: string;
  venue: string;
  targetCampus: 'All Campuses' | ISATUCampus;
  targetAudience: 'All Parents' | IloiloCityCollege | 'Graduating Batch';
  isMandatory: boolean;
  rsvpCount: number;
  notificationSent: boolean;
  pushSentAt?: string;
  emailSentAt?: string;
}

export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  channel: 'push' | 'email' | 'sms' | 'both' | 'all';
  type:
    | 'event_alert'
    | 'guidance_advisory'
    | 'attendance_warning'
    | 'pta_announcement'
    | 'par_form_notice'
    | 'needs_assessment_invite'
    | 'sms_broadcast';
  targetScope: 'all' | 'college' | 'campus' | 'income_bracket' | 'unemployed_cohort' | 'moral_values_followup' | 'guidance_cases' | 'single_parent';
  targetFilter?: string;
  recipientCount: number;
  sentAt: string;
  deliveryStatus: 'Sent' | 'Delivered' | 'Read';
  readByParentIds: string[];
  linkedEventId?: string;
  smsCarrierBreakdown?: {
    smartTnt: number;
    globeTm: number;
    dito: number;
    other: number;
  };
  smsSenderId?: string;
}

export interface NeedsAssessmentSeminarProposal {
  id: string;
  title: string;
  category: 'Livelihood & Skills' | 'Financial Empowerment' | 'Parenting & Values' | 'Digital Literacy' | 'Health & Wellness';
  objective: string;
  targetCohortDescription: string;
  targetEstimatedParents: number;
  matchedParentSkill?: string;
  suggestedDuration: string;
  suggestedResourcePersons: string;
  priority: 'High Priority' | 'Recommended' | 'Routine';
  status: 'Proposed' | 'Approved by PAR Director' | 'Scheduled';
}

export interface ISO25010Evaluation {
  id: string;
  evaluatorName: string;
  evaluatorRole: 'PAR Director' | 'Administrator' | 'Staff/Coordinator' | 'Parent Evaluator';
  functionalSuitability: number; // 1-5
  performanceEfficiency: number; // 1-5
  usability: number; // 1-5
  compatibility: number; // 1-5
  reliability: number; // 1-5
  security: number; // 1-5
  maintainability: number; // 1-5
  portability: number; // 1-5
  feedback: string;
  evaluatedAt: string;
}

export interface DatabaseBackupSnapshot {
  id: string;
  timestamp: string;
  academicYear: string;
  parentCount: number;
  studentCount: number;
  notificationCount: number;
  fileSize: string;
  backupNote: string;
  createdBy: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'admin' | 'faculty' | 'mis_edp';
  parentId?: string;
  title?: string;
  department?: string;
}

export interface ConsultationRequest {
  id: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  preferredDate: string;
  timeSlot: string;
  agenda: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Declined';
  counselorName: string;
  meetingLink?: string;
  createdAt: string;
}
