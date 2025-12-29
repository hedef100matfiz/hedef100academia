
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export type ExamType = 'YKS' | 'LGS' | 'KPSS' | 'ALES' | 'GENEL' | 'UNIVERSITE';
export type EvaluationType = 'test' | 'score';

// Fix: Added Todo interface
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Fix: Added AcademicEvent interface
export interface AcademicEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'assignment' | 'other';
}

export interface ErrorBreakdown {
  knowledge: number;
  attention: number;
  calculation: number;
  time: number;
  other: number;
}

export interface SubjectDefinition {
  id: string;
  name: string;
  color: string;
  evaluationType: EvaluationType;
}

export interface SubjectResult {
  correct?: number;
  wrong?: number;
  score?: number;
}

export interface CoachingRequest {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  isGlobal: boolean;
}

export interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
}

export interface ExamResult {
  id: string;
  studentId: string;
  date: string;
  title: string;
  subjectResults: Record<string, SubjectResult>;
  totalNet?: number;
  averageScore?: number;
  errorBreakdown?: ErrorBreakdown;
}

export interface WeeklySchedule {
  studentId: string;
  teacherId: string;
  days: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  examType: ExamType;
  branch?: string; // New: Specialization for teachers
  subjects: SubjectDefinition[];
  targetNet: number;
  targetGPA: number;
  streak: number;
  lastEntryDate?: string;
  isCoachingOpen?: boolean;
  assignedTeacherId?: string;
}

export interface AppState {
  users: User[];
  examResults: ExamResult[];
  announcements: Announcement[];
  adminMessages: AdminMessage[];
  coachingRequests: CoachingRequest[];
  weeklySchedules: WeeklySchedule[];
  currentUser: User | null;
  settings: {
    isDarkMode: boolean;
    sidebarCollapsed: boolean;
  };
}