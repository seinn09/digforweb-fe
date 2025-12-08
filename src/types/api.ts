// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'petugas' | 'viewer';
  created_at: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  role: 'petugas' | 'viewer';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPetugasData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterViewerData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Victim (Korban) Types - Using actual backend field names
export interface Victim {
  id: number;
  nama: string;
  kontak?: string;
  lokasi?: string;
  tgl_laporan?: string;
  deskripsi_laporan?: string;
  created_at: string;
  updated_at: string;
}

export interface VictimCreateData {
  nama: string;
  kontak?: string;
  lokasi?: string;
  tgl_laporan?: string;
  deskripsi_laporan?: string;
}

export interface VictimUpdateData extends Partial<VictimCreateData> {}

// Case (Kasus) Types - Using actual backend field names
export interface Case {
  id: number;
  korban_id: number;
  jenis_kasus: string;
  tanggal_kejadian: string;
  ringkasan_kasus?: string;
  status_kasus: string;
  created_at: string;
  updated_at: string;
  korban?: Victim; // Nested victim data
}

export interface CaseCreateData {
  korban_id: number;
  jenis_kasus: string;
  tanggal_kejadian: string;
  ringkasan_kasus?: string;
  status_kasus: string;
}

export interface CaseUpdateData extends Partial<CaseCreateData> {}

// Evidence Types - Using actual backend field names
export interface Evidence {
  id: number;
  case_id: number;
  jenis_bukti: string;
  lokasi_penyimpanan: string;
  hash_value?: string;
  waktu_pengambilan_bukti?: string;
  created_at: string;
  updated_at: string;
  kasus?: Case; // Nested case data
}

export interface EvidenceCreateData {
  case_id: number;
  jenis_bukti: string;
  lokasi_penyimpanan: string;
  hash_value?: string;
  waktu_pengambilan_bukti?: string;
}

export interface EvidenceUpdateData extends Partial<EvidenceCreateData> {}

// Forensic Action (Tindakan) Types - Using actual backend field names
export interface ForensicAction {
  id: number;
  case_id: number;
  tahap_forensik: string;
  desk_tindakan?: string;
  waktu_pelaksanaan?: string;
  pic?: string; // Person In Charge
  status_tindakan: string;
  created_at: string;
  updated_at: string;
  kasus?: Case; // Nested case data
}

export interface ForensicActionCreateData {
  case_id: number;
  tahap_forensik: string;
  desk_tindakan?: string;
  waktu_pelaksanaan?: string;
  pic?: string;
  status_tindakan: string;
}

export interface ForensicActionUpdateData extends Partial<ForensicActionCreateData> {}
