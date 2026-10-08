import React, { useState, useRef } from 'react';
import { Member, MemberType, MemberStatus, Gender } from '../types/member';
import { calculateAge, compressImageTo2InchDataUrl } from '../services/storage';
import { AssociationLogo } from './AssociationLogo';
import { X, Save, Edit3, AlertCircle, Camera, Upload, Trash2, RefreshCw } from 'lucide-react';

interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
  onSave: (updated: Member) => Promise<void>;
  isProcessing: boolean;
}

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

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  onClose,
  onSave,
  isProcessing
}) => {
  const [formData, setFormData] = useState<Member>({ ...member });
  const [confirmStep, setConfirmStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof Member, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'birthDate' && value) {
        next.age = calculateAge(value);
      }
      return next;
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const dataUrl = await compressImageTo2InchDataUrl(file);
      handleChange('photoUrl', dataUrl);
    } catch (err) {
      console.error('Photo processing error:', err);
      setError('ไม่สามารถประมวลผลรูปภาพได้');
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('กรุณาระบุชื่อ - สกุล');
      return;
    }
    if (!formData.phone.trim()) {
      setError('กรุณาระบุเบอร์โทรศัพท์');
      return;
    }
    setError(null);
    setConfirmStep(true);
  };

  const handleFinalConfirm = async () => {
    await onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <AssociationLogo variant="badge" theme="green" className="w-10 h-10 flex-shrink-0 shadow-xs" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                แก้ไขข้อมูลสมาชิก
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                {member.id}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Confirmation State Dialog */}
        {confirmStep ? (
          <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              ยืนยันการบันทึกการแก้ไขข้อมูล?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              คุณกำลังจะอัปเดตข้อมูลของ <strong>{formData.fullName}</strong> ในฐานข้อมูลและใน Google Sheets โปรดตรวจสอบความถูกต้องก่อนดำเนินการ
            </p>
            <div className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-3 mb-2">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="รูป 2 นิ้ว" className="w-10 h-13 object-cover rounded-md border border-emerald-500" />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-slate-200 text-slate-500 flex items-center justify-center text-xs">ไม่มีรูป</div>
                )}
                <div>
                  <div className="font-bold text-slate-900">{formData.fullName}</div>
                  <div className="text-slate-500 text-[11px]">{formData.memberType} • {formData.status}</div>
                </div>
              </div>
              <div><strong>หมู่บ้าน/ตำบล:</strong> {formData.village} ต.{formData.subdistrict} จ.{formData.province}</div>
              <div><strong>เบอร์ติดต่อ:</strong> {formData.phone}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmStep(false)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                กลับไปแก้ไขต่อ
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                {isProcessing ? 'กำลังบันทึก...' : 'ยืนยันและบันทึกข้อมูล'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInitialSubmit} className="space-y-5">
            
            {/* 2-Inch Photo Edit Area */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <div className="relative w-16 h-22 rounded-xl bg-white border border-emerald-400 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="รูปสมาชิก" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <span className="text-xs font-semibold text-slate-800 block">
                  รูปถ่ายหน้าตรงขนาด 2 นิ้ว (3:4)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formData.photoUrl ? 'เปลี่ยนรูป' : 'อัปโหลดรูป 2 นิ้ว'}</span>
                  </button>
                  {formData.photoUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('photoUrl', '')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-600 text-xs"
                    >
                      ลบรูป
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Member Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ประเภทสมาชิก</label>
                <select
                  value={formData.memberType}
                  onChange={(e) => handleChange('memberType', e.target.value as MemberType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="รายปี">รายปี</option>
                  <option value="ถาวร">ถาวร</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">สถานะสมาชิก</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as MemberStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
                  <option value="รอการอนุมัติ">รอการอนุมัติ</option>
                  <option value="หมดอายุ">หมดอายุ</option>
                  <option value="ยกเลิก">ยกเลิก</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ - สกุล</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">เพศ</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              {/* Birth Date & Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">วัน/เดือน/ปีเกิด</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* ID Card */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">เลขประจำตัวประชาชน (13 หลัก)</label>
                <input
                  type="text"
                  maxLength={13}
                  value={formData.idCard}
                  onChange={(e) => handleChange('idCard', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ระดับการศึกษา</label>
                <select
                  value={formData.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  {EDUCATION_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">อาชีพ</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Village */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">หมู่ / หมู่บ้าน</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleChange('village', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Subdistrict & District */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ตำบล</label>
                <input
                  type="text"
                  value={formData.subdistrict}
                  onChange={(e) => handleChange('subdistrict', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">อำเภอ</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Province */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">จังหวัด</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">อีเมล์</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* LINE ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ไอดีไลน์</label>
                <input
                  type="text"
                  value={formData.lineId}
                  onChange={(e) => handleChange('lineId', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อเฟสบุ๊ค</label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Skills */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">ความถนัด/ความเชี่ยวชาญ/ความสนใจ</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>ตรวจสอบและบันทึก</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
