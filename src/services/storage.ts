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
  },
  {
    id: 'AKHA-2026-0006',
    registeredDate: '2026-03-12',
    memberType: 'ถาวร',
    status: 'อนุมัติแล้ว',
    fullName: 'นาย สุรชัย อาหมี่',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1988-06-19',
    age: 37,
    idCard: '5500100432190',
    education: 'ปริญญาตรี',
    occupation: 'ผู้ประกอบการแปรรูปผลไม้เมืองหนาว',
    position: 'กรรมการฝ่ายส่งเสริมอาชีพเครือข่ายเชียงใหม่',
    village: 'บ้านห้วยศาลา (หมู่ 8)',
    houseNo: '56',
    soi: '',
    road: 'สายฝาง-แม่อาย',
    subdistrict: 'แม่อาย',
    district: 'แม่อาย',
    province: 'เชียงใหม่',
    postalCode: '50280',
    phone: '082-341-9988',
    email: 'surachai.armi@chiangmai-akha.org',
    facebook: 'Surachai Armi Northern Farmer',
    lineId: 'armi_cm',
    skills: 'กาแฟพิเศษและการแปรรูปผลไม้, การจัดตั้งกลุ่มวิสาหกิจเพื่อสังคม, การท่องเที่ยวเชิงวัฒนธรรม',
    notes: 'เครือข่ายสมาคมอ่าข่าโซนเชียงใหม่ตอนบน'
  },
  {
    id: 'AKHA-2026-0007',
    registeredDate: '2026-03-15',
    memberType: 'รายปี',
    status: 'อนุมัติแล้ว',
    fullName: 'นางสาว มยุรี เบียะปา',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'หญิง',
    birthDate: '1992-09-08',
    age: 33,
    idCard: '5580200331122',
    education: 'ปริญญาตรี',
    occupation: 'ครูภูมิปัญญาสมุนไพรและผ้าทอ',
    position: 'วิทยากรศูนย์เรียนรู้วัฒนธรรมปาย',
    village: 'บ้านหมอกจำแป่ (หมู่ 1)',
    houseNo: '23/4',
    soi: 'ซอยริมธาร',
    road: 'สายปาย-แม่ฮ่องสอน',
    subdistrict: 'หมอกจำแป่',
    district: 'เมืองแม่ฮ่องสอน',
    province: 'แม่ฮ่องสอน',
    postalCode: '58000',
    phone: '084-556-7812',
    email: 'mayuree.beapa@mhs-culture.org',
    facebook: 'Mayuree Beapa Crafts',
    lineId: 'mayuree_craft',
    skills: 'การย้อมผ้าด้วยสีธรรมชาติ, หัตถกรรมเครื่องเงิน, การบันทึกภาษาอ่าข่าอักษรไทย',
    notes: 'ร่วมมือกับโรงเรียนในพื้นที่จัดหลักสูตรท้องถิ่น'
  },
  {
    id: 'AKHA-2026-0008',
    registeredDate: '2026-03-18',
    memberType: 'ถาวร',
    status: 'อนุมัติแล้ว',
    fullName: 'นาย ชัยพร มาเยอะ',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1981-12-03',
    age: 44,
    idCard: '5560100776655',
    education: 'ปริญญาโท',
    occupation: 'นักวิชาการพัฒนาชุมชน',
    position: 'ที่ปรึกษากลุ่มสัจจะออมทรัพย์',
    village: 'บ้านห้วยตาด (หมู่ 6)',
    houseNo: '109',
    soi: '',
    road: 'พะเยา-ป่าแดด',
    subdistrict: 'ดงเจน',
    district: 'ภูกามยาว',
    province: 'พะเยา',
    postalCode: '56000',
    phone: '081-889-4455',
    email: 'chaiporn.maye@phayao-community.org',
    facebook: 'Chaiporn Maye Phayao Network',
    lineId: 'chaiporn_py',
    skills: 'การจัดทำผังชุมชน, สิทธิมนุษยชนและชนกลุ่มน้อย, การตลาดดิจิทัลสินค้าหัตถกรรม',
    notes: 'ผู้ประสานงานความร่วมมือกับมหาวิทยาลัยพะเยา'
  },
  {
    id: 'AKHA-2026-0009',
    registeredDate: '2026-03-20',
    memberType: 'รายปี',
    status: 'อนุมัติแล้ว',
    fullName: 'นาย ปรัชญา อาจือ',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1995-04-17',
    age: 31,
    idCard: '1100200334455',
    education: 'ปริญญาตรี',
    occupation: 'วิศวกรซอฟต์แวร์ / ผู้ประกอบการเทคโนโลยี',
    position: 'เลขาธิการชมรมเยาวชนอ่าข่าในกรุงเทพฯ',
    village: 'คอนโดลุมพินีวิลล์ อ่อนนุช-ลาดกระบัง',
    houseNo: '88/142',
    soi: 'ลาดกระบัง 24/1',
    road: 'ลาดกระบัง',
    subdistrict: 'ลาดกระบัง',
    district: 'ลาดกระบัง',
    province: 'กรุงเทพมหานคร',
    postalCode: '10520',
    phone: '092-445-1200',
    email: 'pratchaya.arju@tech-akha.dev',
    facebook: 'Pratchaya Arju Tech',
    lineId: 'pratchaya_dev',
    skills: 'การพัฒนาเว็บไซต์และแอปพลิเคชัน, การสอนเทคโนโลยีดิจิทัลแก่ชุมชน, การประสานงานเครือข่าย',
    notes: 'ดูแลระบบฐานข้อมูลและเทคโนโลยีการสื่อสารของสมาคม'
  },
  {
    id: 'AKHA-2026-0010',
    registeredDate: '2026-03-22',
    memberType: 'รายปี',
    status: 'อนุมัติแล้ว',
    fullName: 'นางสาว ชลธิชา อาแหวะ',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'หญิง',
    birthDate: '1998-10-25',
    age: 27,
    idCard: '5630300123987',
    education: 'ปริญญาตรี',
    occupation: 'นักการตลาดเกษตรอินทรีย์ / ผู้จัดการสหกรณ์',
    position: 'ผู้ประสานงานเครือข่ายเกษตรกรรุ่นใหม่ภาคตะวันตก',
    village: 'บ้านห้วยน้ำนัก (หมู่ 5)',
    houseNo: '72/1',
    soi: '',
    road: 'สายแม่สอด-อุ้มผาง',
    subdistrict: 'พบพระ',
    district: 'พบพระ',
    province: 'ตาก',
    postalCode: '63160',
    phone: '086-112-9900',
    email: 'chonticha.arwae@tak-organic.org',
    facebook: 'Chonticha Arwae Tak Farm',
    lineId: 'chonticha_tak',
    skills: 'การจัดการห่วงโซ่อุปทานเกษตร, การรับรองมาตรฐานเกษตรอินทรีย์, ภาษาอังกฤษและการสื่อสาร',
    notes: 'เชื่อมโยงผลผลิตกาแฟและอะโวคาโดจากยอดดอยสู่ตลาดพรีเมียม'
  },
  {
    id: 'AKHA-2026-0011',
    registeredDate: '2026-03-25',
    memberType: 'รายปี',
    status: 'รอการอนุมัติ',
    fullName: 'นาย ธนกฤต ลาหู่เชอมือ',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=533&q=80',
    gender: 'ชาย',
    birthDate: '1983-08-11',
    age: 42,
    idCard: '5520100889922',
    education: 'ปริญญาตรี',
    occupation: 'ช่างศิลป์หัตถกรรมดินเผาและเซรามิก',
    position: 'วิทยากรการออกแบบลวดลายชาติพันธุ์ร่วมสมัย',
    village: 'บ้านศาลาดงลาน (หมู่ 2)',
    houseNo: '34',
    soi: 'ซอยช่างปั้น',
    road: 'พหลโยธิน',
    subdistrict: 'ศาลา',
    district: 'เกาะคา',
    province: 'ลำปาง',
    postalCode: '52130',
    phone: '085-334-1122',
    email: 'thanakrit.ceramik@lampang-art.org',
    facebook: 'Thanakrit Ceramic Art Akha',
    lineId: 'thanakrit_lp',
    skills: 'เซรามิกศิลาดล, การออกแบบอัตลักษณ์ชาติพันธุ์บนภาชนะ, การถ่ายทอดศิลปะแก่เยาวชน',
    notes: 'ขอเข้าร่วมเป็นสมาชิกเพื่อจัดนิทรรศการศิลปะร่วมสมัยอ่าข่าสัญจร'
  }
];

export function getStoredMembers(): Member[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // If user had previous 5 members, seamlessly merge new province sample members
      if (parsed.length > 0 && parsed.length < INITIAL_MEMBERS.length) {
        const existingIds = new Set(parsed.map((m: any) => m.id));
        const newItemsToAdd = INITIAL_MEMBERS.filter(m => !existingIds.has(m.id));
        if (newItemsToAdd.length > 0) {
          const merged = [...parsed, ...newItemsToAdd];
          localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(merged));
          return merged;
        }
      }
      return parsed;
    }
    return INITIAL_MEMBERS;
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

