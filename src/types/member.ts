export type MemberType = 'รายปี' | 'ถาวร';
export type MemberStatus = 'อนุมัติแล้ว' | 'รอการอนุมัติ' | 'หมดอายุ' | 'ยกเลิก';
export type Gender = 'ชาย' | 'หญิง' | 'อื่นๆ';

export interface Member {
  id: string; // e.g. AKHA-2026-0001
  registeredDate: string; // YYYY-MM-DD
  memberType: MemberType;
  status: MemberStatus;
  
  // ข้อมูลส่วนบุคคล
  fullName: string;
  photoUrl?: string; // รูปถ่ายหน้าตรงขนาด 2 นิ้ว
  gender: Gender;
  birthDate: string;
  age: number;
  idCard: string;
  
  // การศึกษาและอาชีพ
  education: string;
  occupation: string;
  position: string;
  
  // ที่อยู่
  village: string; // หมู่/หมู่บ้าน
  houseNo: string;
  soi: string;
  road: string;
  subdistrict: string; // ตำบล
  district: string; // อำเภอ
  province: string; // จังหวัด
  postalCode: string;
  
  // การติดต่อ
  phone: string;
  email: string;
  facebook: string;
  lineId: string;
  
  // ความถนัดและความสนใจ
  skills: string;
  notes?: string;

  // ตำแหน่งแถวใน Google Sheet (เริ่มต้นที่ 2 สำหรับข้อมูลแถวแรกหลังจากหัวตาราง)
  rowIndex?: number;
}

export interface SheetConfig {
  spreadsheetId: string | null;
  spreadsheetName: string;
  spreadsheetUrl: string | null;
  lastSyncedAt: string | null;
  autoSync: boolean;
}

export type ActiveTab = 'overview' | 'register' | 'manage' | 'reports' | 'map';
