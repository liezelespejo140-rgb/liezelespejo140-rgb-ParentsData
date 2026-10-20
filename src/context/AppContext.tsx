import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Parent,
  Student,
  SchoolEvent,
  NotificationMessage,
  InvolvementRecord,
  UserAccount,
  ConsultationRequest,
  CounselingRecord,
  GuidanceStanding,
  ClearanceStatus,
  BehavioralRating,
  NeedsAssessmentSeminarProposal,
  ISO25010Evaluation,
  DatabaseBackupSnapshot,
  ClassScheduleItem
} from '../types';
import {
  INITIAL_PARENTS,
  INITIAL_STUDENTS,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INVOLVEMENT,
  INITIAL_ACCOUNTS,
  INITIAL_CONSULTATIONS,
  INITIAL_SEMINAR_PROPOSALS,
  INITIAL_ISO_EVALUATIONS,
  INITIAL_BACKUPS,
} from '../data/mockData';

export function detectPhilippineCarrier(phoneNumber: string): 'SMART' | 'GLOBE' | 'DITO' | 'OTHER' {
  const cleaned = (phoneNumber || '').replace(/\D/g, '');
  let prefix = '';
  if (cleaned.startsWith('63')) {
    prefix = '0' + cleaned.slice(2, 5);
  } else if (cleaned.startsWith('0')) {
    prefix = cleaned.slice(0, 4);
  }
  const smartPrefixes = ['0918', '0919', '0920', '0921', '0928', '0929', '0939', '0947', '0949', '0998', '0999', '0908', '0910', '0912'];
  const globePrefixes = ['0917', '0915', '0916', '0905', '0906', '0926', '0927', '0935', '0936', '0945', '0956', '0965', '0966', '0967', '0975', '0977', '0978', '0979', '0995', '0997'];
  const ditoPrefixes = ['0991', '0992', '0993', '0994', '0895', '0896', '0897', '0898'];
  if (smartPrefixes.includes(prefix)) return 'SMART';
  if (globePrefixes.includes(prefix)) return 'GLOBE';
  if (ditoPrefixes.includes(prefix)) return 'DITO';
  return 'OTHER';
}

interface AppContextType {
  parents: Parent[];
  students: Student[];
  events: SchoolEvent[];
  notifications: NotificationMessage[];
  involvements: InvolvementRecord[];
  consultations: ConsultationRequest[];
  accounts: UserAccount[];
  currentUser: UserAccount;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  // Auth & Account
  switchAccount: (account: UserAccount) => void;
  loginUser: (email: string) => boolean;
  logout: () => void;
  // Push Notifications
  pushPermission: NotificationPermission | 'unsupported';
  isPushActive: boolean;
  togglePushNotifications: () => Promise<void>;
  latestPushBanner: { title: string; body: string; id: string; channel: string } | null;
  clearLatestPushBanner: () => void;
  markNotificationRead: (id: string) => void;
  // Parent Operations
  addParentWithStudent: (parent: Omit<Parent, 'id'>, student?: Omit<Student, 'id' | 'parentIds'>) => void;
  updateParent: (parent: Parent) => void;
  deleteParent: (id: string) => void;
  restoreParent: (id: string) => void;
  verifyParentForm: (parentId: string, status: 'Verified & Accepted' | 'Pending Review' | 'Needs Correction') => void;
  resolveDuplicateParent: (keepId: string, removeId: string) => void;
  detectDuplicates: () => { parentA: Parent; parentB: Parent; reason: string }[];
  // Student & Guidance Operations
  updateStudent: (student: Student) => void;
  addCounselingRecord: (studentId: string, session: Omit<CounselingRecord, 'id'>) => void;
  updateGuidanceStatus: (
    studentId: string,
    standing: GuidanceStanding,
    clearance: ClearanceStatus,
    behavioral: BehavioralRating
  ) => void;
  // Schedule Operations for Parent Monitoring
  updateStudentSchedule: (studentId: string, schedule: ClassScheduleItem[]) => void;
  addClassScheduleItem: (studentId: string, item: Omit<ClassScheduleItem, 'id'>) => void;
  deleteClassScheduleItem: (studentId: string, itemId: string) => void;
  // Involvement Operations
  addInvolvementRecord: (record: Omit<InvolvementRecord, 'id'>) => void;
  // Events Operations
  addSchoolEvent: (event: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'notificationSent'>, autoNotify: boolean) => void;
  updateSchoolEvent: (event: SchoolEvent) => void;
  deleteSchoolEvent: (id: string) => void;
  toggleEventRSVP: (eventId: string) => void;
  // Notification & SMS Dispatch
  dispatchNotification: (payload: {
    title: string;
    body: string;
    channel: 'push' | 'email' | 'sms' | 'both' | 'all';
    targetScope: 'all' | 'college' | 'campus' | 'income_bracket' | 'unemployed_cohort' | 'guidance_cases' | 'single_parent';
    targetFilter?: string;
    linkedEventId?: string;
    smsSenderId?: string;
  }) => void;
  // Consultation
  createConsultation: (data: Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: ConsultationRequest['status']) => void;
  // Needs Assessment Proposals (QP-PAR 02)
  seminarProposals: NeedsAssessmentSeminarProposal[];
  addSeminarProposal: (proposal: Omit<NeedsAssessmentSeminarProposal, 'id'>) => void;
  updateProposalStatus: (id: string, status: NeedsAssessmentSeminarProposal['status']) => void;
  // ISO 25010 & 9001:2015 Evaluation
  isoEvaluations: ISO25010Evaluation[];
  submitISOEvaluation: (evaluation: Omit<ISO25010Evaluation, 'id' | 'evaluatedAt'>) => void;
  // Database Backup & Access Control
  databaseBackups: DatabaseBackupSnapshot[];
  createBackupSnapshot: (note?: string) => DatabaseBackupSnapshot;
  exportDatabaseJSON: () => void;
  exportParentsCSV: () => void;
  isIntakeOpen: boolean;
  toggleIntakePeriod: () => void;
  // Database Reset
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PARENTS: 'isatu_parents_guidance_v2',
  STUDENTS: 'isatu_students_guidance_v2',
  EVENTS: 'isatu_events_guidance_v2',
  NOTIFICATIONS: 'isatu_notifications_guidance_v2',
  INVOLVEMENTS: 'isatu_involvements_guidance_v2',
  CONSULTATIONS: 'isatu_consultations_guidance_v2',
  CURRENT_USER: 'isatu_current_user_guidance_v2',
  PUSH_ACTIVE: 'isatu_push_active_guidance_v2',
  SEMINAR_PROPOSALS: 'isatu_seminar_proposals_v2',
  ISO_EVALUATIONS: 'isatu_iso_evaluations_v2',
  BACKUPS: 'isatu_database_backups_v2',
  INTAKE_OPEN: 'isatu_intake_open_v2',
};

// Play polite university notification chime using Web Audio API
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // First note (G5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second note (C6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {
    // Audio context may be restricted before gesture
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parents, setParents] = useState<Parent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARENTS);
    return saved ? JSON.parse(saved) : INITIAL_PARENTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [notifications, setNotifications] = useState<NotificationMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [involvements, setInvolvements] = useState<InvolvementRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOLVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_INVOLVEMENT;
  });

  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  const [seminarProposals, setSeminarProposals] = useState<NeedsAssessmentSeminarProposal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEMINAR_PROPOSALS);
    return saved ? JSON.parse(saved) : INITIAL_SEMINAR_PROPOSALS;
  });

  const [isoEvaluations, setIsoEvaluations] = useState<ISO25010Evaluation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ISO_EVALUATIONS);
    return saved ? JSON.parse(saved) : INITIAL_ISO_EVALUATIONS;
  });

  const [databaseBackups, setDatabaseBackups] = useState<DatabaseBackupSnapshot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BACKUPS);
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTAKE_OPEN);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS[0]; // Liezel Espejo default
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>('stud-1');

  const [isPushActive, setIsPushActive] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PUSH_ACTIVE);
    return saved ? JSON.parse(saved) : true;
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [latestPushBanner, setLatestPushBanner] = useState<{ title: string; body: string; id: string; channel: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOLVEMENTS, JSON.stringify(involvements));
  }, [involvements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PUSH_ACTIVE, JSON.stringify(isPushActive));
  }, [isPushActive]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEMINAR_PROPOSALS, JSON.stringify(seminarProposals));
  }, [seminarProposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISO_EVALUATIONS, JSON.stringify(isoEvaluations));
  }, [isoEvaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(databaseBackups));
  }, [databaseBackups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTAKE_OPEN, JSON.stringify(isIntakeOpen));
  }, [isIntakeOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission('unsupported');
    }
  }, []);

  const clearLatestPushBanner = () => {
    setLatestPushBanner(null);
  };

  const togglePushNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        setIsPushActive(perm === 'granted');
      } else if (Notification.permission === 'granted') {
        setIsPushActive(!isPushActive);
      } else {
        setIsPushActive(false);
      }
    } else {
      setIsPushActive(!isPushActive);
    }
  };

  const showPushAlert = (title: string, body: string, channel: 'push' | 'email' | 'both' | 'sms' | 'all') => {
    playChime();

    const notifId = 'banner-' + Date.now();
    setLatestPushBanner({
      id: notifId,
      title,
      body,
      channel,
    });

    if (isPushActive && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback handled by in-app banner
      }
    }
  };

  const switchAccount = (account: UserAccount) => {
    setCurrentUser(account);
    if (account.role === 'parent' && account.parentId) {
      const parent = parents.find((p) => p.id === account.parentId);
      if (parent && parent.studentIds.length > 0) {
        setSelectedStudentId(parent.studentIds[0]);
      }
      setActiveView('dashboard');
    } else {
      setActiveView('parents');
    }
  };

  const loginUser = (email: string): boolean => {
    const acc = INITIAL_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (acc) {
      switchAccount(acc);
      return true;
    }
    const p = parents.find(
      (parent) => (parent.emailAddress || parent.email || '').toLowerCase() === email.toLowerCase()
    );
    if (p) {
      const parentEmail = p.emailAddress || p.email || email;
      const newAcc: UserAccount = {
        id: `acc-${p.id}`,
        email: parentEmail,
        name: p.fullName,
        role: 'parent',
        parentId: p.id,
      };
      switchAccount(newAcc);
      return true;
    }
    return false;
  };

  const logout = () => {
    const defaultAcc = INITIAL_ACCOUNTS[0];
    setCurrentUser(defaultAcc);
    setActiveView('dashboard');
  };

  const markNotificationRead = (id: string) => {
    if (!currentUser.parentId) return;
    const parentId = currentUser.parentId;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.readByParentIds.includes(parentId)) {
          return {
            ...n,
            readByParentIds: [...n.readByParentIds, parentId],
          };
        }
        return n;
      })
    );
  };

  const addParentWithStudent = (
    parentData: Omit<Parent, 'id'>,
    studentData?: Omit<Student, 'id' | 'parentIds'>
  ) => {
    const parentId = `parent-${Date.now()}`;
    let newStudentId = '';

    if (studentData) {
      newStudentId = `stud-${Date.now()}`;
      const newStudent: Student = {
        ...studentData,
        id: newStudentId,
        parentIds: [parentId],
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    const newParent: Parent = {
      ...parentData,
      id: parentId,
      studentIds: newStudentId ? [newStudentId, ...(parentData.studentIds || [])] : (parentData.studentIds || []),
    };

    setParents((prev) => [newParent, ...prev]);

    showPushAlert(
      'New ISAT U Parent Profile Registered',
      `${newParent.fullName} has been registered and linked to student guidance inventory.`,
      'both'
    );
  };

  const updateParent = (updatedParent: Parent) => {
    setParents((prev) => prev.map((p) => (p.id === updatedParent.id ? updatedParent : p)));
  };

  const deleteParent = (id: string) => {
    // Thesis Limitation (Chapter I, page 6): "does not cover financial transactions, academic grading, student disciplinary records, or a delete function for stored data."
    // Implemented as secure institutional archiving with audit trail
    setParents((prev) => prev.map((p) => (p.id === id ? { ...p, isArchived: true } : p)));
    showPushAlert('Parent Record Archived', 'Record marked as archived in compliance with ISAT U audit retention guidelines.', 'both');
  };

  const restoreParent = (id: string) => {
    setParents((prev) => prev.map((p) => (p.id === id ? { ...p, isArchived: false } : p)));
    showPushAlert('Parent Record Restored', 'Record restored to active PAR database directory.', 'both');
  };

  const verifyParentForm = (parentId: string, status: 'Verified & Accepted' | 'Pending Review' | 'Needs Correction') => {
    setParents((prev) =>
      prev.map((p) => {
        if (p.id === parentId) {
          return {
            ...p,
            verificationStatus: status,
            returnSlipVerifiedAt: status === 'Verified & Accepted' ? new Date().toISOString().split('T')[0] : p.returnSlipVerifiedAt,
            returnSlipCode: p.returnSlipCode || `PAR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          };
        }
        return p;
      })
    );
    showPushAlert('QF-PAR-01 Form Verified', `Verification status updated: ${status}`, 'both');
  };

  const resolveDuplicateParent = (keepId: string, removeId: string) => {
    const removedParent = parents.find((p) => p.id === removeId);
    setParents((prev) =>
      prev.map((p) => {
        if (p.id === keepId && removedParent) {
          const mergedStudents = Array.from(new Set([...p.studentIds, ...removedParent.studentIds]));
          return { ...p, studentIds: mergedStudents };
        }
        if (p.id === removeId) {
          return {
            ...p,
            isArchived: true,
            notes: `[Deduplicated & merged into ${keepId} on ${new Date().toISOString().split('T')[0]}] ${p.notes || ''}`,
          };
        }
        return p;
      })
    );
    showPushAlert('Deduplication Complete', 'Duplicate parent response resolved and archived.', 'both');
  };

  const detectDuplicates = () => {
    const dups: { parentA: Parent; parentB: Parent; reason: string }[] = [];
    const activeParents = parents.filter((p) => !p.isArchived);
    for (let i = 0; i < activeParents.length; i++) {
      for (let j = i + 1; j < activeParents.length; j++) {
        const a = activeParents[i];
        const b = activeParents[j];
        const sharedStudent = a.studentIds.some((sid) => b.studentIds.includes(sid));
        const cleanPhoneA = a.contactNumber.replace(/\D/g, '');
        const cleanPhoneB = b.contactNumber.replace(/\D/g, '');
        const phoneMatch = cleanPhoneA && cleanPhoneB && cleanPhoneA === cleanPhoneB;
        const nameMatch =
          a.lastName.toLowerCase().trim() === b.lastName.toLowerCase().trim() &&
          a.firstName.toLowerCase().trim() === b.firstName.toLowerCase().trim();

        if (sharedStudent && (phoneMatch || nameMatch)) {
          dups.push({ parentA: a, parentB: b, reason: `Shared student profile and matching ${phoneMatch ? 'contact number' : 'name'}` });
        } else if (phoneMatch) {
          dups.push({ parentA: a, parentB: b, reason: 'Identical contact number registered across responses' });
        } else if (nameMatch && sharedStudent) {
          dups.push({ parentA: a, parentB: b, reason: 'Same parent name registered multiple times for same student' });
        }
      }
    }
    return dups;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const addCounselingRecord = (studentId: string, sessionData: Omit<CounselingRecord, 'id'>) => {
    const newRecord: CounselingRecord = {
      ...sessionData,
      id: `coun-${Date.now()}`,
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            counselingRecords: [newRecord, ...s.counselingRecords],
          };
        }
        return s;
      })
    );

    const student = students.find((s) => s.id === studentId);
    showPushAlert(
      `Guidance Session Logged: ${student?.fullName}`,
      `Category: ${sessionData.category}. Counselor notes recorded in university inventory.`,
      'both'
    );
  };

  const updateGuidanceStatus = (
    studentId: string,
    standing: GuidanceStanding,
    clearance: ClearanceStatus,
    behavioral: BehavioralRating
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            guidanceStanding: standing,
            guidanceClearanceStatus: clearance,
            behavioralRating: behavioral,
          };
        }
        return s;
      })
    );

    const student = students.find((s) => s.id === studentId);
    showPushAlert(
      `Guidance Standing Updated: ${student?.fullName}`,
      `New Standing: ${standing} (${clearance}). Official record synchronized.`,
      'both'
    );
  };

  const updateStudentSchedule = (studentId: string, schedule: ClassScheduleItem[]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, classSchedule: schedule } : s))
    );
    showPushAlert('Class Schedule Updated', 'Student timetable has been saved to the parents monitoring record.', 'push');
  };

  const addClassScheduleItem = (studentId: string, item: Omit<ClassScheduleItem, 'id'>) => {
    const newItem: ClassScheduleItem = {
      ...item,
      id: `sched-${Date.now()}`,
    };
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const current = s.classSchedule || [];
          return { ...s, classSchedule: [...current, newItem] };
        }
        return s;
      })
    );
    showPushAlert('Class Added to Schedule', `Subject ${item.subjectCode} (${item.days.join('/')}) added.`, 'push');
  };

  const deleteClassScheduleItem = (studentId: string, itemId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const current = s.classSchedule || [];
          return { ...s, classSchedule: current.filter((i) => i.id !== itemId) };
        }
        return s;
      })
    );
    showPushAlert('Schedule Entry Removed', 'Selected course has been removed from the schedule.', 'push');
  };

  const addInvolvementRecord = (record: Omit<InvolvementRecord, 'id'>) => {
    const newRecord: InvolvementRecord = {
      ...record,
      id: `inv-${Date.now()}`,
    };
    setInvolvements((prev) => [newRecord, ...prev]);

    setParents((prev) =>
      prev.map((p) => {
        if (p.id === record.parentId) {
          const newScore = Math.min(100, p.involvementScore + (record.status === 'Attended' ? 8 : 2));
          let tier: Parent['involvementStatus'] = 'Active';
          if (newScore >= 90) tier = 'Highly Engaged';
          else if (newScore >= 70) tier = 'Active';
          else if (newScore >= 50) tier = 'Moderate';
          else if (newScore >= 35) tier = 'Needs Follow-up';
          else tier = 'Inactive';
          return {
            ...p,
            involvementScore: newScore,
            involvementStatus: tier,
            lastActiveAt: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const addSchoolEvent = (
    eventData: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'notificationSent'>,
    autoNotify: boolean
  ) => {
    const eventId = `evt-${Date.now()}`;
    const newEvent: SchoolEvent = {
      ...eventData,
      id: eventId,
      rsvpCount: 0,
      notificationSent: autoNotify,
      pushSentAt: autoNotify ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
      emailSentAt: autoNotify ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
    };

    setEvents((prev) => [newEvent, ...prev]);

    if (autoNotify) {
      const targetScope = eventData.targetAudience === 'All Parents' ? 'all' : 'college';
      const targetFilter = eventData.targetAudience !== 'All Parents' ? eventData.targetAudience : undefined;

      const newNotif: NotificationMessage = {
        id: `notif-${Date.now()}`,
        title: `Upcoming Event: ${eventData.title}`,
        body: `${eventData.description} Date: ${eventData.date} at ${eventData.time} (${eventData.venue}).`,
        channel: 'both',
        type: 'event_alert',
        targetScope,
        targetFilter,
        recipientCount: eventData.targetAudience === 'All Parents' ? parents.length * 90 : 85,
        sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        deliveryStatus: 'Delivered',
        readByParentIds: [],
        linkedEventId: eventId,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      showPushAlert(
        `Upcoming School Event: ${eventData.title}`,
        `Date: ${eventData.date} @ ${eventData.venue}. Automated notification dispatched to parents.`,
        'both'
      );
    }
  };

  const updateSchoolEvent = (updatedEvent: SchoolEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const deleteSchoolEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEventRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return { ...e, rsvpCount: e.rsvpCount + 1 };
        }
        return e;
      })
    );
  };

  const dispatchNotification = (payload: {
    title: string;
    body: string;
    channel: 'push' | 'email' | 'sms' | 'both' | 'all';
    targetScope: 'all' | 'college' | 'campus' | 'income_bracket' | 'unemployed_cohort' | 'guidance_cases' | 'single_parent';
    targetFilter?: string;
    linkedEventId?: string;
    smsSenderId?: string;
  }) => {
    let recCount = parents.filter((p) => !p.isArchived).length;
    if (payload.targetScope === 'college') recCount = Math.max(1, Math.round(recCount * 0.35));
    if (payload.targetScope === 'campus') recCount = Math.max(1, Math.round(recCount * 0.4));
    if (payload.targetScope === 'income_bracket') recCount = Math.max(1, Math.round(recCount * 0.25));
    if (payload.targetScope === 'unemployed_cohort') recCount = Math.max(1, parents.filter((p) => p.employmentStatus === 'Unemployed').length);
    if (payload.targetScope === 'guidance_cases') recCount = 4;
    if (payload.targetScope === 'single_parent') recCount = 1;

    // Calculate simulated telco carrier distribution
    let smart = 0;
    let globe = 0;
    let dito = 0;
    let other = 0;
    parents.forEach((p) => {
      const c = detectPhilippineCarrier(p.contactNumber);
      if (c === 'SMART') smart++;
      else if (c === 'GLOBE') globe++;
      else if (c === 'DITO') dito++;
      else other++;
    });

    const newNotif: NotificationMessage = {
      id: `notif-${Date.now()}`,
      title: payload.title,
      body: payload.body,
      channel: payload.channel,
      type: payload.channel === 'sms' ? 'sms_broadcast' : (payload.linkedEventId ? 'event_alert' : 'pta_announcement'),
      targetScope: payload.targetScope,
      targetFilter: payload.targetFilter,
      recipientCount: recCount,
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      deliveryStatus: 'Delivered',
      readByParentIds: [],
      linkedEventId: payload.linkedEventId,
      smsCarrierBreakdown: { smartTnt: smart, globeTm: globe, dito: dito, other: other },
      smsSenderId: payload.smsSenderId || 'ISATU-PAR',
    };

    setNotifications((prev) => [newNotif, ...prev]);

    showPushAlert(
      payload.channel === 'sms' ? `[SMS Broadcast: ${payload.smsSenderId || 'ISATU-PAR'}] ${payload.title}` : payload.title,
      payload.body,
      payload.channel
    );
  };

  const addSeminarProposal = (proposal: Omit<NeedsAssessmentSeminarProposal, 'id'>) => {
    const newProp: NeedsAssessmentSeminarProposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
    };
    setSeminarProposals((prev) => [newProp, ...prev]);
    showPushAlert(
      'New Seminar Proposal Lodged (QP-PAR 02)',
      `Proposal "${newProp.title}" drafted for ${newProp.targetEstimatedParents} parents.`,
      'both'
    );
  };

  const updateProposalStatus = (id: string, status: NeedsAssessmentSeminarProposal['status']) => {
    setSeminarProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    showPushAlert('Proposal Status Updated', `Status changed to: ${status}`, 'both');
  };

  const submitISOEvaluation = (evaluation: Omit<ISO25010Evaluation, 'id' | 'evaluatedAt'>) => {
    const newEval: ISO25010Evaluation = {
      ...evaluation,
      id: `iso-${Date.now()}`,
      evaluatedAt: new Date().toISOString().split('T')[0],
    };
    setIsoEvaluations((prev) => [newEval, ...prev]);
    showPushAlert(
      'ISO 25010 Evaluation Recorded',
      `Audit review saved for evaluator: ${newEval.evaluatorName} (${newEval.evaluatorRole}).`,
      'both'
    );
  };

  const createBackupSnapshot = (note?: string): DatabaseBackupSnapshot => {
    const payload = { parents, students, events, notifications, seminarProposals, isoEvaluations };
    const snap: DatabaseBackupSnapshot = {
      id: `bak-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      academicYear: '2025-2026',
      parentCount: parents.length,
      studentCount: students.length,
      notificationCount: notifications.length,
      fileSize: `${(JSON.stringify(payload).length / 1024 / 1024).toFixed(2)} MB`,
      backupNote: note || `Manual Database Backup by ${currentUser.name}`,
      createdBy: `${currentUser.title || currentUser.role} (${currentUser.name})`,
    };
    setDatabaseBackups((prev) => [snap, ...prev]);
    showPushAlert('Database Backup Created', `Annual snapshot created successfully (${snap.fileSize}).`, 'both');
    return snap;
  };

  const exportDatabaseJSON = () => {
    const data = {
      system: 'ISAT U Parents/Guardians Web-based Management System (PGWBMS)',
      department: 'Parents Affairs and Relations Office',
      institution: 'Iloilo Science and Technology University',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.name,
      documentStandards: ['QF-PAR-01', 'QP-PAR-02', 'ISO 9001:2015', 'ISO/IEC 25010'],
      parents,
      students,
      events,
      notifications,
      seminarProposals,
      isoEvaluations,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ISATU_PGWBMS_Annual_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showPushAlert('Database Export Complete', 'Full institutional JSON archive downloaded.', 'both');
  };

  const exportParentsCSV = () => {
    const headers = [
      'Parent ID',
      'Return Slip Code',
      'Verification Status',
      'Full Name',
      'Last Name',
      'First Name',
      'Respondent Type',
      'Complete Address',
      'Civil Status',
      'Educational Attainment',
      'Contact Number',
      'Philippine Carrier',
      'Email Address',
      'Sex',
      'Employment Status',
      'Socio-Economic Bracket',
      'Nature of Work',
      'Employer',
      'Special Skills',
      '4Ps or Financial Support',
      'Linked Student',
      'Student Campus',
      'Student College/Course',
    ];

    const rows = parents.map((p) => {
      const student = students.find((s) => p.studentIds.includes(s.id));
      const carrier = detectPhilippineCarrier(p.contactNumber);
      return [
        `"${p.id}"`,
        `"${p.returnSlipCode || 'N/A'}"`,
        `"${p.verificationStatus || 'Verified & Accepted'}"`,
        `"${p.fullName}"`,
        `"${p.lastName}"`,
        `"${p.firstName}"`,
        `"${p.respondentType}"`,
        `"${p.completeAddress.replace(/"/g, '""')}"`,
        `"${p.civilStatus}"`,
        `"${p.educationalAttainment}"`,
        `"${p.contactNumber}"`,
        `"${carrier}"`,
        `"${p.emailAddress}"`,
        `"${p.sex}"`,
        `"${p.employmentStatus}"`,
        `"${p.socioEconomicStatus}"`,
        `"${p.natureOfWork.join('; ')}"`,
        `"${(p.nameOfEmployer || '').replace(/"/g, '""')}"`,
        `"${(p.specialSkills || '').replace(/"/g, '""')}"`,
        `"${(p.unemployedSourceOfIncome || '').replace(/"/g, '""')}"`,
        `"${student?.fullName || 'N/A'}"`,
        `"${student?.campus || 'N/A'}"`,
        `"${student?.courseYearSection || student?.program || 'N/A'}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ISATU_QF_PAR_01_Directory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showPushAlert('CSV Export Complete', 'QF-PAR-01 Master Database exported to CSV.', 'both');
  };

  const toggleIntakePeriod = () => {
    setIsIntakeOpen((prev) => {
      const next = !prev;
      showPushAlert(
        next ? 'QF-PAR-01 Intake Opened' : 'QF-PAR-01 Intake Closed',
        next
          ? 'Parents can now submit and update digital QF-PAR-01 intake forms.'
          : 'Intake window closed for official semester encoding review by PAR Office.',
        'both'
      );
      return next;
    });
  };

  const createConsultation = (data: Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ConsultationRequest = {
      ...data,
      id: `cons-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setConsultations((prev) => [newReq, ...prev]);

    showPushAlert(
      'Consultation Requested',
      `Your meeting request with ${data.counselorName} for ${data.preferredDate} has been lodged.`,
      'both'
    );
  };

  const updateConsultationStatus = (id: string, status: ConsultationRequest['status']) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const resetDatabase = () => {
    localStorage.removeItem(STORAGE_KEYS.PARENTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.INVOLVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.CONSULTATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SEMINAR_PROPOSALS);
    localStorage.removeItem(STORAGE_KEYS.ISO_EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.BACKUPS);
    localStorage.removeItem(STORAGE_KEYS.INTAKE_OPEN);
    setParents(INITIAL_PARENTS);
    setStudents(INITIAL_STUDENTS);
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setInvolvements(INITIAL_INVOLVEMENT);
    setConsultations(INITIAL_CONSULTATIONS);
    setSeminarProposals(INITIAL_SEMINAR_PROPOSALS);
    setIsoEvaluations(INITIAL_ISO_EVALUATIONS);
    setDatabaseBackups(INITIAL_BACKUPS);
    setIsIntakeOpen(true);
    setCurrentUser(INITIAL_ACCOUNTS[0]);
    setSelectedStudentId('stud-1');
    setActiveView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        parents,
        students,
        events,
        notifications,
        involvements,
        consultations,
        accounts: INITIAL_ACCOUNTS,
        currentUser,
        activeView,
        setActiveView,
        selectedStudentId,
        setSelectedStudentId,
        switchAccount,
        loginUser,
        logout,
        pushPermission,
        isPushActive,
        togglePushNotifications,
        latestPushBanner,
        clearLatestPushBanner,
        markNotificationRead,
        addParentWithStudent,
        updateParent,
        deleteParent,
        restoreParent,
        verifyParentForm,
        resolveDuplicateParent,
        detectDuplicates,
        updateStudent,
        addCounselingRecord,
        updateGuidanceStatus,
        updateStudentSchedule,
        addClassScheduleItem,
        deleteClassScheduleItem,
        addInvolvementRecord,
        addSchoolEvent,
        updateSchoolEvent,
        deleteSchoolEvent,
        toggleEventRSVP,
        dispatchNotification,
        createConsultation,
        updateConsultationStatus,
        seminarProposals,
        addSeminarProposal,
        updateProposalStatus,
        isoEvaluations,
        submitISOEvaluation,
        databaseBackups,
        createBackupSnapshot,
        exportDatabaseJSON,
        exportParentsCSV,
        isIntakeOpen,
        toggleIntakePeriod,
        resetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
