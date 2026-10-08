import { Member, SheetConfig } from '../types/member';

const LOCAL_STORAGE_MEMBERS_KEY = 'akha_association_members_v1';
const LOCAL_STORAGE_CONFIG_KEY = 'akha_association_sheet_config_v1';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'AKHA-2026-0001',
    registeredDate: '2026-01-15',
    memberType: 'ถาวร',
    status: 'อนุมัติแล้ว',
    fullName: 'อาจารย์ อาเจอะ ลาเชอะ',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1978-04-12',
    age: 48,
    idCard: '5570100234561',
    education: 'ปริญญาโท',
    occupation: 'อาจารย์/นักวิจัยอิสระ',
    position: 'ประธานฝ่ายศิลปวัฒนธรรม',
    village: 'บ้านแม่สลองนอก (หมู่ 1)',
    houseNo: '88/2',
    soi: 'ซอยสันติสุข',
    road: 'สายแม่จัน-ท่าตอน',
    subdistrict: 'แม่สลองนอก',
    district: 'แม่ฟ้าหลวง',
    province: 'เชียงราย',
    postalCode: '57110',
    phone: '081-992-3451',
    email: 'ajeo.lache@akha-culture.org',
    facebook: 'Ajeo Lache Akha',
    lineId: 'ajeo_akha',
    skills: 'ภาษาและวรรณกรรมอ่าข่า, พิธีกรรมโบราณ, การแปลคัมภีร์ขับลำนำ',
    notes: 'ผู้เชี่ยวชาญด้านประวัติศาสตร์และตระกูลสายบรรพบุรุษอ่าข่า'
  },
  {
    id: 'AKHA-2026-0002',
    registeredDate: '2026-02-01',
    memberType: 'ถาวร',
    status: 'อนุมัติแล้ว',
    fullName: 'นาง มีแหว่อะ เบเชกู่',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'หญิง',
    birthDate: '1985-09-23',
    age: 40,
    idCard: '5570200876542',
    education: 'ปริญญาตรี',
    occupation: 'วิสาหกิจชุมชนหัตถกรรมชนเผ่า',
    position: 'กรรมการบริหารกองทุนผ้าทอ',
    village: 'บ้านห้วยส้าน (หมู่ 4)',
    houseNo: '124',
    soi: '',
    road: 'พหลโยธิน',
    subdistrict: 'ห้วยไคร้',
    district: 'แม่สาย',
    province: 'เชียงราย',
    postalCode: '57220',
    phone: '089-755-6678',
    email: 'mewea.akha.craft@gmail.com',
    facebook: 'Mewea Bechegu Akha Heritage',
    lineId: 'mewea_craft',
    skills: 'การปักผ้าลายโบราณอ่าข่า, การทำเครื่องเงินประดับศีรษะ (อูหม่อ), การย้อมสีธรรมชาติ',
    notes: 'วิทยากรสอนเย็บปักผ้าอ่าข่าให้แก่เยาวชนรุ่นใหม่'
  },
  {
    id: 'AKHA-2026-0003',
    registeredDate: '2026-02-18',
    memberType: 'รายปี',
    status: 'อนุมัติแล้ว',
    fullName: 'นาย พงษ์ศิริ เมียะจอ (อาจู)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1996-11-05',
    age: 29,
    idCard: '5570301122334',
    education: 'ปริญญาตรี',
    occupation: 'เกษตรกรผู้ปลูกกาแฟพิเศษ / บาริสต้า',
    position: 'ตัวแทนกลุ่มเกษตรกรรุ่นใหม่',
    village: 'บ้านดอยช้าง (หมู่ 3)',
    houseNo: '45/1',
    soi: 'ซอยกาแฟยอดดอย',
    road: 'ดอยช้าง-วาวี',
    subdistrict: 'วาวี',
    district: 'แม่สรวย',
    province: 'เชียงราย',
    postalCode: '57180',
    phone: '095-432-8899',
    email: 'pongsiri.arju@doychang-coffee.com',
    facebook: 'Arju Akha Coffee Maker',
    lineId: 'arju_akha96',
    skills: 'การแปรรูปกาแฟบนพื้นที่สูง, เทคโนโลยีการเกษตรยั่งยืน, การตลาดออนไลน์และการถ่ายภาพ',
    notes: 'สนับสนุนการเชื่อมโยงวัฒนธรรมอ่าข่ากับการท่องเที่ยวเชิงอนุรักษ์'
  },
  {
    id: 'AKHA-2026-0004',
    registeredDate: '2026-03-02',
    memberType: 'รายปี',
    status: 'อนุมัติแล้ว',
    fullName: 'นางสาว นาโบ เบียะซอ',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'หญิง',
    birthDate: '2001-07-14',
    age: 24,
    idCard: '5570400554433',
    education: 'กำลังศึกษาระดับปริญญาตรี',
    occupation: 'นักศึกษา / นักกิจกรรมสื่อสร้างสรรค์',
    position: 'คณะทำงานเยาวชนอ่าข่า',
    village: 'บ้านป่าคาสุขใจ (หมู่ 5)',
    houseNo: '19',
    soi: '',
    road: 'แม่จัน-เชียงราย',
    subdistrict: 'แม่สลองนอก',
    district: 'แม่ฟ้าหลวง',
    province: 'เชียงราย',
    postalCode: '57110',
    phone: '093-211-9087',
    email: 'nabo.beasor@gmail.com',
    facebook: 'Nabo Beasor Youth Voice',
    lineId: 'nabo_youth',
    skills: 'การผลิตสื่อดิจิทัลและพอดแคสต์ภาษาอ่าข่า, การแสดงดนตรีซึงและขลุ่ยอ่าข่า, การสอนภาษาอังกฤษ',
    notes: 'ตัวแทนเยาวชนเข้าร่วมเวทีการศึกษาพหุวัฒนธรรมระดับนานาชาติ'
  },
  {
    id: 'AKHA-2026-0005',
    registeredDate: '2026-03-10',
    memberType: 'รายปี',
    status: 'รอการอนุมัติ',
    fullName: 'นาย อูผะ เชอมือกู่',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1968-01-30',
    age: 58,
    idCard: '5570500998877',
    education: 'ประถมศึกษา',
    occupation: 'ปราชญ์ชุมชน / หมอยาพื้นบ้าน',
    position: 'ผู้อาวุโสประจำหมู่บ้าน',
    village: 'บ้านห้วยหม้อ (หมู่ 2)',
    houseNo: '10',
    soi: '',
    road: 'สายเทอดไทย',
    subdistrict: 'เทอดไทย',
    district: 'แม่ฟ้าหลวง',
    province: 'เชียงราย',
    postalCode: '57240',
    phone: '087-654-3210',
    email: 'oopa.cher@gmail.com',
    facebook: 'Oopa Chermurgu Elder',
    lineId: '',
    skills: 'สมุนไพรพื้นบ้านชาวเขา, การจักสานเครื่องใช้ไม้ไผ่, พิธีกรรมโล้ชิงช้า (แย้ขู่อ่าเผ่ว)',
    notes: 'สมัครสมาชิกเพื่อร่วมถ่ายทอดองค์ความรู้สมุนไพรแก่เยาวชน'
  }
];

export function getStoredMembers(): Member[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored members:', e);
    return INITIAL_MEMBERS;
  }
}

export function saveStoredMembers(members: Member[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving stored members:', e);
  }
}

export function getStoredConfig(): SheetConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading sheet config:', e);
  }
  return {
    spreadsheetId: null,
    spreadsheetName: 'ทะเบียนสมาชิกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า',
    spreadsheetUrl: null,
    lastSyncedAt: null,
    autoSync: true
  };
}

export function saveStoredConfig(config: SheetConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving sheet config:', e);
  }
}

/**
 * คำนวณอายุจาก วัน/เดือน/ปีเกิด (YYYY-MM-DD)
 */
export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : 0;
}

/**
 * ตรวจสอบความถูกต้องของเลขประจำตัวประชาชน 13 หลักของไทย
 */
export function validateThaiNationalId(id: string): { isValid: boolean; message: string } {
  const cleanId = id.replace(/[-\s]/g, '');
  if (!cleanId) return { isValid: false, message: 'กรุณากรอกเลขประจำตัวประชาชน' };
  if (!/^\d{13}$/.test(cleanId)) return { isValid: false, message: 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก' };

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanId.charAt(i), 10) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  if (checkDigit !== parseInt(cleanId.charAt(12), 10)) {
    return { isValid: false, message: 'รูปแบบเลขประจำตัวประชาชนไม่ถูกต้องตามหลักการคำนวณ' };
  }
  return { isValid: true, message: 'เลขบัตรประชาชนถูกต้อง' };
}

/**
 * ปรับขนาดและครอบตัดรูปภาพให้อยู่ในอัตราส่วน 3:4 (ขนาดรูป 2 นิ้วมาตรฐาน) พร้อมบีบอัดให้มีขนาดเล็กและคมชัด
 */
export async function compressImageTo2InchDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetWidth = 360;
        const targetHeight = 480; // 3:4 aspect ratio (2 inch standard)
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Calculate aspect fill & center crop
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight; // 0.75

        let drawWidth = img.width;
        let drawHeight = img.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > targetAspect) {
          // Source is wider -> crop horizontally
          drawWidth = img.height * targetAspect;
          offsetX = (img.width - drawWidth) / 2;
        } else {
          // Source is taller -> crop vertically
          drawHeight = img.width / targetAspect;
          offsetY = (img.height - drawHeight) / 2;
        }

        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw cropped and centered image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, targetWidth, targetHeight);

        // Convert to lightweight JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

