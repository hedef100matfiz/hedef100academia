
import { ExamType, SubjectDefinition } from './types';

export const COLORS = {
  orange: '#f97316',
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  slate: '#64748b',
  navy: '#0f172a'
};

// Fix: Added SUBJECT_LABELS
export const SUBJECT_LABELS: Record<string, string> = {
  mat: 'Matematik',
  tur: 'Türkçe',
  fiz: 'Fizik',
  kim: 'Kimya',
  biy: 'Biyoloji',
  fen: 'Fen Bilimleri',
  gy: 'Genel Yetenek',
  gk: 'Genel Kültür',
  say: 'Sayısal',
  soz: 'Sözel',
  ders1: 'Ders 1',
  vize: 'Vize',
  final: 'Final'
};

// Fix: Added ERROR_LABELS
export const ERROR_LABELS: Record<string, string> = {
  knowledge: 'Bilgi Eksikliği',
  attention: 'Dikkat Hatası',
  calculation: 'İşlem Hatası',
  time: 'Yetiştirememe',
  other: 'Diğer'
};

// Fix: Added MOTIVATION_QUOTES
export const MOTIVATION_QUOTES = [
  "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.",
  "Gelecek, bugünden hazırlananlara aittir.",
  "Zorluklar, başarının değerini artıran süslerdir.",
  "Durmadığın sürece ne kadar yavaş gittiğinin bir önemi yoktur.",
  "En büyük risk, hiç risk almamaktır.",
  "Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır."
];

export const TEACHER_BRANCHES = [
  "Matematik",
  "Fizik",
  "Kimya",
  "Biyoloji",
  "Türkçe / Edebiyat",
  "Tarih",
  "Coğrafya",
  "İngilizce",
  "Rehberlik",
  "Diğer"
];

export const DAYS_LABELS: Record<string, string> = {
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar'
};

export const DEFAULT_SUBJECTS: Record<ExamType, SubjectDefinition[]> = {
  YKS: [
    { id: 'mat', name: 'Matematik', color: '#f97316', evaluationType: 'test' },
    { id: 'tur', name: 'Türkçe', color: '#3b82f6', evaluationType: 'test' },
    { id: 'fiz', name: 'Fizik', color: '#a855f7', evaluationType: 'test' },
    { id: 'kim', name: 'Kimya', color: '#22c55e', evaluationType: 'test' },
    { id: 'biy', name: 'Biyoloji', color: '#ef4444', evaluationType: 'test' }
  ],
  LGS: [
    { id: 'mat', name: 'Matematik', color: '#f97316', evaluationType: 'test' },
    { id: 'tur', name: 'Türkçe', color: '#3b82f6', evaluationType: 'test' },
    { id: 'fen', name: 'Fen Bilimleri', color: '#22c55e', evaluationType: 'test' }
  ],
  KPSS: [
    { id: 'gy', name: 'Genel Yetenek', color: '#3b82f6', evaluationType: 'test' },
    { id: 'gk', name: 'Genel Kültür', color: '#f97316', evaluationType: 'test' }
  ],
  ALES: [
    { id: 'say', name: 'Sayısal', color: '#f97316', evaluationType: 'test' },
    { id: 'soz', name: 'Sözel', color: '#3b82f6', evaluationType: 'test' }
  ],
  GENEL: [
    { id: 'ders1', name: 'Ders 1', color: '#64748b', evaluationType: 'score' }
  ],
  UNIVERSITE: [
    { id: 'vize', name: 'Vize', color: '#a855f7', evaluationType: 'score' },
    { id: 'final', name: 'Final', color: '#ef4444', evaluationType: 'score' }
  ]
};