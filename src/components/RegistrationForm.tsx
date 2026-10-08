import React, { useState, useRef } from 'react';
import { Member, MemberType, Gender } from '../types/member';
import { calculateAge, validateThaiNationalId, compressImageTo2InchDataUrl } from '../services/storage';
import { AssociationLogo } from './AssociationLogo';
import { 
  UserPlus, 
  User, 
  Calendar, 
  CreditCard, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Award,
  Clock,
  Printer,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (member: Member) => Promise<boolean>;
  onViewCard: (member: Member) => void;
  isSaving: boolean;
  hasSheetConnected: boolean;
  memberCount: number;
}

const COMMON_SKILLS = [
  'ภาษาและวรรณกรรมอ่าข่า',
  'การปักผ้าและชุดชนเผ่าอ่าข่า',
  'เครื่องเงินและหัตถกรรมอูหม่อ',
  'กาแฟพิเศษและการเกษตรพื้นที่สูง',
  'ดนตรีพื้นบ้านและการขับลำนำ',
  'สมุนไพรและหมอยาพื้นบ้าน',
  'พิธีกรรมโบราณและประเพณีโล้ชิงช้า',
  'การศึกษาและกิจกรรมพัฒนาเยาวชน',
  'สื่อดิจิทัลและการถ่ายภาพ',
  'การท่องเที่ยวชุมชนเชิงอนุรักษ์'
];

const NORTHERN_PROVINCES = [
  'เชียงราย',
  'เชียงใหม่',
  'แม่ฮ่องสอน',
  'พะเยา',
  'ลำปาง',
  'ลำพูน',
  'แพร่',
  'น่าน',
  'ตาก',
  'กรุงเทพมหานคร'
];

const EDUCATION_LEVELS = [
  'ประถมศึกษา',
  'มัธยมศึกษาตอนต้น',
  'มัธยมศึกษาตอนปลาย / ปวช.',
  'อนุปริญญา / ปวส.',
  'ปริญญาตรี',
  'ปริญญาโท',
  'ปริญญาเอก',
  'การศึกษานอกระบบ / ภูมิปัญญาท้องถิ่น'
];

const SAMPLE_AVATARS = [
  { label: 'รูปสุภาพบุรุษ 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=533&q=80' },
  { label: 'รูปสุภาพสตรี 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=533&q=80' },
  { label: 'รูปคนรุ่นใหม่ 1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=533&q=80' },
  { label: 'รูปคนรุ่นใหม่ 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=533&q=80' }
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onViewCard,
  isSaving,
  hasSheetConnected,
  memberCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [memberType, setMemberType] = useState<MemberType>('รายปี');
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [gender, setGender] = useState<Gender>('ชาย');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [idCard, setIdCard] = useState('');
  
  const [education, setEducation] = useState('ปริญญาตรี');
  const [occupation, setOccupation] = useState('');
  const [position, setPosition] = useState('');
  
  const [village, setVillage] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [soi, setSoi] = useState('');
  const [road, setRoad] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('เชียงราย');
  const [postalCode, setPostalCode] = useState('');
  
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [lineId, setLineId] = useState('');
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState('');
  const [notes, setNotes] = useState('');

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);

  // Handle Birth Date Change -> Auto calculate Age
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthDate(val);
    if (val) {
      const calculated = calculateAge(val);
      setAge(calculated);
    }
  };

  // Toggle Skill Tag
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Format ID Card input
  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 13);
    setIdCard(raw);
    if (errors.idCard) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.idCard;
        return next;
      });
    }
  };

  // Handle 2-Inch Photo File Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPG, PNG, WEBP)');
      return;
    }

    try {
      setIsProcessingPhoto(true);
      const compressedDataUrl = await compressImageTo2InchDataUrl(file);
      setPhotoUrl(compressedDataUrl);
    } catch (err) {
      console.error('Error processing photo:', err);
      alert('ไม่สามารถประมวลผลรูปภาพได้ โปรดลองใหม่อีกครั้ง');
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'กรุณากรอกชื่อ - สกุล';
    }

    if (!birthDate) {
      newErrors.birthDate = 'กรุณาระบุวัน/เดือน/ปีเกิด';
    }

    if (!idCard) {
      newErrors.idCard = 'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก';
    } else {
      const idCheck = validateThaiNationalId(idCard);
      if (!idCheck.isValid) {
        newErrors.idCard = idCheck.message;
      }
    }

    if (!village.trim() && !houseNo.trim()) {
      newErrors.village = 'กรุณาระบุชื่อหมู่บ้านหรือบ้านเลขที่';
    }

    if (!subdistrict.trim()) {
      newErrors.subdistrict = 'กรุณาระบุตำบล';
    }

    if (!district.trim()) {
      newErrors.district = 'กรุณาระบุอำเภอ';
    }

    if (!province.trim()) {
      newErrors.province = 'กรุณาระบุจังหวัด';
    }

    if (!phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์ติดต่อ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = Object.keys(errors)[0];
      const el = document.getElementById(firstError);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Combine skills
    const allSkillsList = [...selectedSkills];
    if (customSkills.trim()) {
      allSkillsList.push(customSkills.trim());
    }
    const combinedSkills = allSkillsList.join(', ');

    // Generate unique ID: AKHA-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const sequence = String(memberCount + 1).padStart(4, '0');
    const newId = `AKHA-${currentYear}-${sequence}`;

    const newMember: Member = {
      id: newId,
      registeredDate: new Date().toISOString().split('T')[0],
      memberType,
      status: 'รอการอนุมัติ',
      fullName: fullName.trim(),
      photoUrl: photoUrl.trim() || undefined,
      gender,
      birthDate,
      age: typeof age === 'number' ? age : 0,
      idCard: idCard.trim(),
      education,
      occupation: occupation.trim() || 'ไม่ได้ระบุ',
      position: position.trim() || '-',
      village: village.trim(),
      houseNo: houseNo.trim(),
      soi: soi.trim(),
      road: road.trim(),
      subdistrict: subdistrict.trim(),
      district: district.trim(),
      province: province.trim(),
      postalCode: postalCode.trim(),
      phone: phone.trim(),
      email: email.trim(),
      facebook: facebook.trim(),
      lineId: lineId.trim(),
      skills: combinedSkills || 'สนใจทั่วไป',
      notes: notes.trim()
    };

    const success = await onSubmit(newMember);
    if (success) {
      setRegisteredMember(newMember);
    }
  };

  const handleResetForm = () => {
    setRegisteredMember(null);
    setFullName('');
    setPhotoUrl('');
    setBirthDate('');
    setAge('');
    setIdCard('');
    setOccupation('');
    setPosition('');
    setVillage('');
    setHouseNo('');
    setSoi('');
    setRoad('');
    setSubdistrict('');
    setDistrict('');
    setPostalCode('');
    setPhone('');
    setEmail('');
    setFacebook('');
    setLineId('');
    setSelectedSkills([]);
    setCustomSkills('');
    setNotes('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      
      {/* Page Header (Green Palette) */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center justify-center mb-3">
          <AssociationLogo 
            variant="badge" 
            theme="green"
            className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md mb-2 hover:scale-105 transition-transform" 
          />
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) • ระบบดิจิทัล</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          หน้ารับสมัครสมาชิกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
          กรุณากรอกข้อมูลและแนบรูปถ่ายหน้าตรงขนาด 2 นิ้วให้ครบถ้วน ข้อมูลทั้งหมดจะถูกส่งเข้าสู่ระบบฐานข้อมูลสมาคมและจัดเก็บบน Google Sheets
        </p>

        {hasSheetConnected && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>เชื่อมต่อ Google Sheets แล้ว ข้อมูลจะถูกบันทึกลงตารางทันที</span>
          </div>
        )}
      </div>

      {/* Success Modal / Banner when registered */}
      {registeredMember && (
        <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-500 rounded-3xl shadow-lg animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10 pointer-events-none w-32">
            <AssociationLogo variant="badge" theme="green" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              {registeredMember.photoUrl ? (
                <img
                  src={registeredMember.photoUrl}
                  alt={registeredMember.fullName}
                  className="w-14 h-18 object-cover rounded-xl border-2 border-emerald-600 shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">ลงทะเบียนสำเร็จเรียบร้อย</span>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold">
                    <AssociationLogo variant="icon" theme="green" className="w-3.5 h-3.5" />
                    AFECT
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  ยินดีต้อนรับคุณ {registeredMember.fullName}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  รหัสสมาชิกของคุณคือ: <strong className="text-emerald-700 font-mono text-base">{registeredMember.id}</strong> (ประเภท{registeredMember.memberType})
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  สถานะ: รอการตรวจสอบอนุมัติโดยนายทะเบียนสมาคม
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => onViewCard(registeredMember)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-emerald-300" />
                <span>ดู/พิมพ์บัตรสมาชิก</span>
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium transition-all"
              >
                สมัครสมาชิกเพิ่มอีกท่าน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Membership Type Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-emerald-700" />
            <h2>1. ประเภทการสมัครสมาชิก (Membership Type)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Annual Member */}
            <label 
              onClick={() => setMemberType('รายปี')}
              className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                memberType === 'รายปี'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center mt-1 flex-shrink-0">
                {memberType === 'รายปี' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900">สมาชิกรายปี</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">ต่ออายุทุกปี</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  สำหรับบุคคลทั่วไปหรือผู้สนใจร่วมกิจกรรมสมาคม ค่าบำรุงประจำปี ร่วมรับข่าวสารและการประชุมสามัญ
                </p>
              </div>
            </label>

            {/* Lifetime Member */}
            <label 
              onClick={() => setMemberType('ถาวร')}
              className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                memberType === 'ถาวร'
                  ? 'border-teal-700 bg-teal-50/60 shadow-md ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-5 h-5 rounded-full border-2 border-teal-700 flex items-center justify-center mt-1 flex-shrink-0">
                {memberType === 'ถาวร' && <div className="w-2.5 h-2.5 rounded-full bg-teal-700"></div>}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900">สมาชิกถาวร (ตลอดชีพ)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-medium">ตลอดชีพ</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  สำหรับผู้มีเชื้อสายอ่าข่าและผู้ร่วมก่อตั้ง/สนับสนุนถาวร มีสิทธิออกเสียงเลือกตั้งคณะกรรมการสมาคม
                </p>
              </div>
            </label>

          </div>
        </div>

        {/* Section 2: 2-Inch Portrait Photo Upload */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <Camera className="w-5 h-5 text-emerald-700" />
              <h2>2. รูปถ่ายหน้าตรงขนาด 2 นิ้ว (Member 2-Inch Photo)</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium">
              สัดส่วนมาตรฐาน 3:4
            </span>
          </div>

          <p className="text-xs text-slate-500">
            โปรดอัปโหลดรูปถ่ายหน้าตรง ครึ่งตัว หน้าชัดเจน เพื่อใช้สำหรับออกบัตรประจำตัวสมาชิกดิจิทัล (ระบบจะครอบตัดเป็นสัดส่วน 3:4 อัตโนมัติ)
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
            
            {/* 2-Inch Photo Frame Preview */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-32 h-44 rounded-2xl bg-slate-100 border-2 border-dashed border-emerald-400 overflow-hidden flex flex-col items-center justify-center shadow-inner group">
                {photoUrl ? (
                  <>
                    <img 
                      src={photoUrl} 
                      alt="รูปถ่ายหน้าตรง 2 นิ้ว" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs"
                        title="เปลี่ยนรูปภาพ"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs"
                        title="ลบรูปภาพ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <User className="w-10 h-10 mx-auto text-slate-300 mb-1" />
                    <span className="text-[11px] text-slate-500 font-medium block">
                      รูปถ่าย 2 นิ้ว
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      (ขนาด 3:4)
                    </span>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-800/80 text-white text-[9px] font-semibold backdrop-blur-xs">
                  2 นิ้ว
                </div>
              </div>
            </div>

            {/* Photo Action Controls */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-emerald-200" />
                  <span>{photoUrl ? 'เปลี่ยนรูปถ่าย 2 นิ้ว' : 'อัปโหลดรูปถ่ายหน้าตรง'}</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>ลบรูป</span>
                  </button>
                )}
              </div>

              {/* Sample Avatar Presets for Quick Testing */}
              <div className="pt-2">
                <span className="text-xs text-slate-500 block mb-2 font-medium">
                  หรือเลือกจากตัวอย่างภาพถ่ายจำลอง:
                </span>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {SAMPLE_AVATARS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(sample.url)}
                      className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white transition-all text-xs text-slate-700"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-6 h-8 object-cover rounded-md border border-slate-200"
                      />
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Section 3: Personal Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-emerald-700" />
            <h2>3. ข้อมูลส่วนบุคคล (Personal Information)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อ - สกุล (พร้อมคำนำหน้า เช่น นาย/นาง/นางสาว/อาจารย์) <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="เช่น นาย สมศักดิ์ ลาเชอะ (อาจู)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เพศ <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ชาย', 'หญิง', 'อื่นๆ'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                      gender === g 
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="birthDate" className="block text-xs font-semibold text-slate-700 mb-1.5">
                วัน/เดือน/ปีเกิด <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.birthDate ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                  }`}
                />
              </div>
              {errors.birthDate && <p className="text-xs text-rose-500 mt-1">{errors.birthDate}</p>}
            </div>

            {/* Age (Auto-calculated) */}
            <div>
              <label htmlFor="age" className="block text-xs font-semibold text-slate-700 mb-1.5">
                อายุ (ปี) <span className="text-slate-400 font-normal">คำนวณอัตโนมัติ</span>
              </label>
              <input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder="คำนวณจากวันเกิด"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* National ID Card (13 digits) */}
            <div>
              <label htmlFor="idCard" className="block text-xs font-semibold text-slate-700 mb-1.5">
                เลขประจำตัวประชาชน (13 หลัก) <span className="text-rose-500">*</span>
              </label>
              <input
                id="idCard"
                type="text"
                maxLength={13}
                placeholder="เลข 13 หลัก ไม่มีขีด"
                value={idCard}
                onChange={handleIdCardChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 transition-all ${
                  errors.idCard ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.idCard && <p className="text-xs text-rose-500 mt-1">{errors.idCard}</p>}
            </div>

          </div>
        </div>

        {/* Section 4: Education & Occupation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <h2>4. การศึกษาและการประกอบอาชีพ (Education & Occupation)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Education Level */}
            <div>
              <label htmlFor="education" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ระดับการศึกษา
              </label>
              <select
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 bg-white"
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-xs font-semibold text-slate-700 mb-1.5">
                อาชีพ
              </label>
              <input
                id="occupation"
                type="text"
                placeholder="เช่น เกษตรกร, ค้าขาย, ข้าราชการ, นักศึกษา"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ตำแหน่ง / ภาระหน้าที่
              </label>
              <input
                id="position"
                type="text"
                placeholder="เช่น ผู้ใหญ่บ้าน, กรรมการชุมชน, เจ้าของกิจการ"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Address Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <Home className="w-5 h-5 text-teal-700" />
            <h2>5. ภูมิลำเนาและที่อยู่ปัจจุบัน (Address & Community)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Village */}
            <div className="sm:col-span-2">
              <label htmlFor="village" className="block text-xs font-semibold text-slate-700 mb-1.5">
                หมู่ / ชื่อหมู่บ้าน (สำคัญมากสำหรับชุมชนอ่าข่า) <span className="text-rose-500">*</span>
              </label>
              <input
                id="village"
                type="text"
                placeholder="เช่น บ้านแม่สลองนอก (หมู่ 1), บ้านดอยช้าง"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.village ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.village && <p className="text-xs text-rose-500 mt-1">{errors.village}</p>}
            </div>

            {/* House No */}
            <div>
              <label htmlFor="houseNo" className="block text-xs font-semibold text-slate-700 mb-1.5">
                บ้านเลขที่
              </label>
              <input
                id="houseNo"
                type="text"
                placeholder="เช่น 124/2"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* Soi */}
            <div>
              <label htmlFor="soi" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ซอย
              </label>
              <input
                id="soi"
                type="text"
                placeholder="เช่น ซอย 3"
                value={soi}
                onChange={(e) => setSoi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* Road */}
            <div>
              <label htmlFor="road" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ถนน
              </label>
              <input
                id="road"
                type="text"
                placeholder="เช่น พหลโยธิน"
                value={road}
                onChange={(e) => setRoad(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* Subdistrict */}
            <div>
              <label htmlFor="subdistrict" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ตำบล <span className="text-rose-500">*</span>
              </label>
              <input
                id="subdistrict"
                type="text"
                placeholder="เช่น แม่สลองนอก, วาวี"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.subdistrict ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.subdistrict && <p className="text-xs text-rose-500 mt-1">{errors.subdistrict}</p>}
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="block text-xs font-semibold text-slate-700 mb-1.5">
                อำเภอ <span className="text-rose-500">*</span>
              </label>
              <input
                id="district"
                type="text"
                placeholder="เช่น แม่ฟ้าหลวง, แม่สรวย"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.district ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.district && <p className="text-xs text-rose-500 mt-1">{errors.district}</p>}
            </div>

            {/* Province */}
            <div>
              <label htmlFor="province" className="block text-xs font-semibold text-slate-700 mb-1.5">
                จังหวัด <span className="text-rose-500">*</span>
              </label>
              <select
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 bg-white"
              >
                {NORTHERN_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-xs font-semibold text-slate-700 mb-1.5">
                รหัสไปรษณีย์
              </label>
              <input
                id="postalCode"
                type="text"
                maxLength={5}
                placeholder="เช่น 57110"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

          </div>
        </div>

        {/* Section 6: Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-emerald-700" />
            <h2>6. ช่องทางการติดต่อ (Contact Information)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="เช่น 081-234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                อีเมล์ (Email)
              </label>
              <input
                id="email"
                type="email"
                placeholder="เช่น yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* Facebook */}
            <div>
              <label htmlFor="facebook" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อเฟสบุ๊ค (Facebook)
              </label>
              <input
                id="facebook"
                type="text"
                placeholder="เช่น Somchai Akha หรือลิงก์โพรไฟล์"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>

            {/* LINE ID */}
            <div>
              <label htmlFor="lineId" className="block text-xs font-semibold text-slate-700 mb-1.5">
                ไอดีไลน์ (LINE ID)
              </label>
              <input
                id="lineId"
                type="text"
                placeholder="เช่น akha_somchai"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 7: Skills, Expertise & Interests */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2>7. ความถนัด / ความเชี่ยวชาญ / ความสนใจ (Skills & Interests)</h2>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-3">
              เลือกทักษะหรือความสนใจที่ท่านต้องการมีส่วนร่วมสนับสนุนสมาคม (เลือกได้มากกว่า 1 ข้อ):
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            <label htmlFor="customSkills" className="block text-xs font-semibold text-slate-700 mb-1.5">
              ความถนัดหรือความสนใจเพิ่มเติมอื่นๆ:
            </label>
            <input
              id="customSkills"
              type="text"
              placeholder="เช่น การเป็นล่ามภาษาอังกฤษ-อ่าข่า, กฎหมายที่ดิน, ช่างซ่อมบำรุง"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
              หมายเหตุ / ความประสงค์เพิ่มเติม (ถ้ามี):
            </label>
            <textarea
              id="notes"
              rows={2}
              placeholder="ระบุข้อความหรือข้อมูลเพิ่มเติมสำหรับนายทะเบียนสมาคม"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600"
            ></textarea>
          </div>
        </div>

        {/* Submit Actions Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            * ข้อมูลและรูปถ่ายจะถูกบันทึกเพื่อใช้ในกิจการสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่าเท่านั้น
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
            >
              ล้างแบบฟอร์ม
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-sm font-bold shadow-lg shadow-emerald-950/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังบันทึกลงระบบ...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-emerald-300" />
                  <span>บันทึกการสมัครสมาชิก</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
