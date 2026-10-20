import { Student, ClassScheduleItem, DayOfWeek } from '../types';

export const BSIT_3A_SCHEDULE: ClassScheduleItem[] = [
  {
    id: 'sched-it-311',
    subjectCode: 'IT 311',
    subjectTitle: 'Advanced Database Systems & Big Data Architecture',
    days: ['Monday', 'Wednesday'],
    startTime: '07:30 AM',
    endTime: '09:30 AM',
    room: 'CICT Computer Lab 302',
    building: 'New Information & Communications Tech Building',
    instructor: 'Engr. Leo Villaruz, MIT',
    instructorEmail: 'leo.villaruz@isatu.edu.ph',
    facultyTitle: 'Associate Professor II · Lead Database Architect',
    facultyDepartment: 'Department of Computer Studies',
    consultationHours: 'Mon/Wed 1:00 PM – 3:30 PM (Lab 302)',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'blue',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-IT01',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-it-312',
    subjectCode: 'IT 312',
    subjectTitle: 'Web Systems and Technologies 2 (Full-Stack Frameworks)',
    days: ['Monday', 'Wednesday'],
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    room: 'CICT Software Engineering Lab 304',
    building: 'New Information & Communications Tech Building',
    instructor: 'Prof. Mary Grace Ramos, DIT',
    instructorEmail: 'marygrace.ramos@isatu.edu.ph',
    facultyTitle: 'Professor III · Web Systems Department Chair',
    facultyDepartment: 'Department of Information Technology',
    consultationHours: 'Tue/Thu 9:00 AM – 11:30 AM (Room 304)',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'emerald',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-IT02',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-it-313',
    subjectCode: 'IT 313',
    subjectTitle: 'Mobile Application Development (Android & Cross-Platform)',
    days: ['Tuesday', 'Thursday'],
    startTime: '08:30 AM',
    endTime: '11:00 AM',
    room: 'Mobile Dev Lab 201',
    building: 'Science & Technology Complex',
    instructor: 'Prof. Reynaldo Celis, MSIT',
    instructorEmail: 'reynaldo.celis@isatu.edu.ph',
    facultyTitle: 'Assistant Professor IV · Mobile Computing Specialist',
    facultyDepartment: 'Department of Computer Studies',
    consultationHours: 'Wednesday 1:00 PM – 4:00 PM (Lab 201)',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'purple',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-IT03',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-it-314',
    subjectCode: 'IT 314',
    subjectTitle: 'Information Assurance and Cybersecurity Defense 1',
    days: ['Tuesday', 'Thursday'],
    startTime: '01:00 PM',
    endTime: '02:30 PM',
    room: 'CICT Lecture Hall 103',
    building: 'New Information & Communications Tech Building',
    instructor: 'Engr. Arvin Kyle Bedia, CISSP',
    instructorEmail: 'arvin.bedia@isatu.edu.ph',
    facultyTitle: 'Instructor III · Certified Information Systems Security Officer',
    facultyDepartment: 'Department of Computer Systems & Networks',
    consultationHours: 'Friday 9:00 AM – 12:00 PM (Hall 103)',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'rose',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-IT04',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-it-315',
    subjectCode: 'IT 315',
    subjectTitle: 'Integrative Programming & Technologies (Microservices & APIs)',
    days: ['Friday'],
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    room: 'Systems Integration Lab 401',
    building: 'New Information & Communications Tech Building',
    instructor: 'Prof. Ronald De Leon, MIT',
    instructorEmail: 'ronald.deleon@isatu.edu.ph',
    facultyTitle: 'Associate Professor I · Cloud & Systems Architecture',
    facultyDepartment: 'Department of Information Technology',
    consultationHours: 'Monday 2:00 PM – 5:00 PM (Lab 401)',
    units: 4.0,
    type: 'Laboratory',
    colorTheme: 'indigo',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-IT05',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-ge-108',
    subjectCode: 'GEC 108',
    subjectTitle: 'Science, Technology, Society & Digital Ethics',
    days: ['Monday', 'Wednesday'],
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    room: 'CAS Audio-Visual Hall 2',
    building: 'College of Arts and Sciences Hall',
    instructor: 'Dr. Jocelyn Fernandez, Ph.D.',
    instructorEmail: 'jocelyn.fernandez@isatu.edu.ph',
    facultyTitle: 'Professor I · Ethics & General Education Faculty',
    facultyDepartment: 'College of Arts and Sciences (CAS)',
    consultationHours: 'Thursday 10:00 AM – 12:00 PM (CAS Rm 204)',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'amber',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-GE08',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-it-cap1',
    subjectCode: 'CAP 311',
    subjectTitle: 'Capstone Project and Research 1 (Methodology & Defense)',
    days: ['Friday'],
    startTime: '01:00 PM',
    endTime: '04:00 PM',
    room: 'Research & Innovation Hub 2nd Flr',
    building: 'ISAT U Research Center',
    instructor: 'Prof. Arthur Magbanua, RGC, MIT',
    instructorEmail: 'arthur.magbanua@isatu.edu.ph',
    facultyTitle: 'Associate Professor II · Research & Guidance Coordinator',
    facultyDepartment: 'CICT & Guidance Center',
    consultationHours: 'Mon/Thu 3:00 PM – 5:00 PM (Guidance Rm 201)',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'sky',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-CP01',
    edpVerifiedAt: '2026-01-08',
  },
  {
    id: 'sched-pe-3',
    subjectCode: 'PE 3',
    subjectTitle: 'Individual & Dual Sports / Physical Wellness',
    days: ['Saturday'],
    startTime: '07:30 AM',
    endTime: '09:30 AM',
    room: 'University Gymnasium Courts',
    building: 'ISAT U Sports & Wellness Complex',
    instructor: 'Coach Danilo Villanueva, MPE',
    instructorEmail: 'danilo.villanueva@isatu.edu.ph',
    facultyTitle: 'Sports Instructor II · University Athletics Coach',
    facultyDepartment: 'Department of Physical Education & Sports',
    consultationHours: 'Saturday 10:00 AM – 12:00 PM (Gymnasium Office)',
    units: 2.0,
    type: 'PE/NSTP',
    colorTheme: 'emerald',
    enrollmentStatus: 'Enrolled',
    edpControlNumber: 'EDP-2026-PE03',
    edpVerifiedAt: '2026-01-08',
  },
];

export const BSECE_4B_SCHEDULE: ClassScheduleItem[] = [
  {
    id: 'sched-ece-411',
    subjectCode: 'ECE 411',
    subjectTitle: 'Communications Engineering 2 & Satellite Networks',
    days: ['Monday', 'Wednesday'],
    startTime: '07:30 AM',
    endTime: '09:30 AM',
    room: 'CEA Telecom Lab 102',
    building: 'Engineering & Architecture Complex',
    instructor: 'Engr. Ramon Delgado, PECE',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'blue',
  },
  {
    id: 'sched-ece-412',
    subjectCode: 'ECE 412',
    subjectTitle: 'Digital Signal Processing with MATLAB',
    days: ['Tuesday', 'Thursday'],
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    room: 'CEA DSP Lab 205',
    building: 'Engineering & Architecture Complex',
    instructor: 'Engr. Katherine Solinap, M.Eng',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'purple',
  },
  {
    id: 'sched-ece-413',
    subjectCode: 'ECE 413',
    subjectTitle: 'Microprocessor & Microcontroller Embedded Systems',
    days: ['Monday', 'Wednesday'],
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    room: 'Robotics & Embedded Systems Lab',
    building: 'Engineering & Architecture Complex',
    instructor: 'Engr. Dennis Alcala, PECE',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'amber',
  },
  {
    id: 'sched-ece-414',
    subjectCode: 'ECE 414',
    subjectTitle: 'Seminars, Field Trips & Engineering Professional Ethics',
    days: ['Friday'],
    startTime: '01:00 PM',
    endTime: '04:00 PM',
    room: 'CEA Audio-Visual Amphitheater',
    building: 'Engineering & Architecture Complex',
    instructor: 'Dean Roberto Gomez, Ph.D.',
    units: 2.0,
    type: 'Lecture',
    colorTheme: 'indigo',
  },
];

export const BSED_2A_SCHEDULE: ClassScheduleItem[] = [
  {
    id: 'sched-ed-211',
    subjectCode: 'EDUC 211',
    subjectTitle: 'Facilitating Learner-Centered Teaching',
    days: ['Monday', 'Wednesday'],
    startTime: '08:30 AM',
    endTime: '10:00 AM',
    room: 'COE Hall 101',
    building: 'College of Education Building',
    instructor: 'Dr. Elena Santos, Ed.D.',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'emerald',
  },
  {
    id: 'sched-ed-212',
    subjectCode: 'EDUC 212',
    subjectTitle: 'Assessment of Learning 1',
    days: ['Tuesday', 'Thursday'],
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    room: 'COE Hall 104',
    building: 'College of Education Building',
    instructor: 'Prof. Maria Garcia, MAEd',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'blue',
  },
  {
    id: 'sched-ed-213',
    subjectCode: 'EDUC 213',
    subjectTitle: 'Technology for Teaching and Learning 1',
    days: ['Monday', 'Wednesday'],
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    room: 'EdTech Multi-Media Lab',
    building: 'College of Education Building',
    instructor: 'Prof. Carlo Mendoza, MS',
    units: 3.0,
    type: 'Laboratory',
    colorTheme: 'purple',
  },
];

export const GENERIC_DEFAULT_SCHEDULE: ClassScheduleItem[] = [
  {
    id: 'sched-gen-101',
    subjectCode: 'TECH 101',
    subjectTitle: 'Applied Technology & Industrial Workshop Principles',
    days: ['Monday', 'Wednesday'],
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    room: 'Main Tech Workshop Rm 12',
    building: 'Industrial Technology Building',
    instructor: 'Prof. Joel Alcantara',
    units: 3.0,
    type: 'Shop',
    colorTheme: 'blue',
  },
  {
    id: 'sched-gen-102',
    subjectCode: 'MATH 101',
    subjectTitle: 'Mathematics in the Modern World',
    days: ['Tuesday', 'Thursday'],
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    room: 'SciTech Rm 203',
    building: 'SciTech Complex',
    instructor: 'Prof. Sharon Morales, M.Sc.',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'emerald',
  },
  {
    id: 'sched-gen-103',
    subjectCode: 'ENG 101',
    subjectTitle: 'Purposive Communication & Technical Writing',
    days: ['Tuesday', 'Thursday'],
    startTime: '01:00 PM',
    endTime: '02:30 PM',
    room: 'CAS Rm 102',
    building: 'Arts and Sciences Building',
    instructor: 'Prof. Cristina Valderrama',
    units: 3.0,
    type: 'Lecture',
    colorTheme: 'amber',
  },
  {
    id: 'sched-gen-104',
    subjectCode: 'PRACT 101',
    subjectTitle: 'Supervised Laboratory & Occupational Safety Practices',
    days: ['Friday'],
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    room: 'Safety Simulation Lab',
    building: 'ISAT U Technology Complex',
    instructor: 'Engr. Fernando Lopez',
    units: 4.0,
    type: 'Laboratory',
    colorTheme: 'rose',
  },
];

export const getScheduleForStudent = (student: Student): ClassScheduleItem[] => {
  if (student.classSchedule && student.classSchedule.length > 0) {
    return student.classSchedule;
  }

  const prog = (student.program || '').toLowerCase();
  const cys = (student.courseYearSection || '').toLowerCase();

  if (prog.includes('information technology') || cys.includes('bsit') || student.id === 'stud-1') {
    return BSIT_3A_SCHEDULE;
  }

  if (prog.includes('electronics') || cys.includes('bsece') || student.id === 'stud-2') {
    return BSECE_4B_SCHEDULE;
  }

  if (prog.includes('education') || cys.includes('bsed') || student.id === 'stud-3') {
    return BSED_2A_SCHEDULE;
  }

  return GENERIC_DEFAULT_SCHEDULE;
};

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const getClassesForDay = (
  schedule: ClassScheduleItem[],
  day: DayOfWeek
): ClassScheduleItem[] => {
  return schedule.filter((item) => item.days.includes(day));
};

export const calculateTotalUnits = (schedule: ClassScheduleItem[]) => {
  const total = schedule.reduce((sum, item) => sum + item.units, 0);
  const lab = schedule
    .filter((item) => item.type === 'Laboratory' || item.type === 'Shop')
    .reduce((sum, item) => sum + item.units, 0);
  const lec = total - lab;
  return { total, labUnits: lab, lecUnits: lec };
};

export const getCurrentOrNextClass = (
  schedule: ClassScheduleItem[]
): {
  currentClass?: ClassScheduleItem;
  nextClass?: ClassScheduleItem;
  todayName: DayOfWeek;
  todayClasses: ClassScheduleItem[];
} => {
  const now = new Date();
  const dayNames: DayOfWeek[] = [
    'Saturday', // 0: Sunday (fallback to Monday/Saturday)
    'Monday',   // 1
    'Tuesday',  // 2
    'Wednesday',// 3
    'Thursday', // 4
    'Friday',   // 5
    'Saturday', // 6
  ];
  const dayIndex = now.getDay();
  const todayName: DayOfWeek = dayIndex === 0 ? 'Monday' : dayNames[dayIndex];
  const todayClasses = getClassesForDay(schedule, todayName);

  // Return today classes plus the first upcoming class
  return {
    currentClass: todayClasses[0],
    nextClass: todayClasses[1] || todayClasses[0],
    todayName,
    todayClasses,
  };
};
