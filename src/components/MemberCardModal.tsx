import React, { useRef, useState } from 'react';
import { Member } from '../types/member';
import { AssociationLogo } from './AssociationLogo';
import { MemberApplicationDocument } from './MemberApplicationDocument';
import { exportElementToPdf } from '../services/pdfExport';
import { 
  X, 
  Printer, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Award, 
  CreditCard, 
  ShieldCheck, 
  Share2, 
  QrCode,
  Calendar,
  FileText,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface MemberCardModalProps {
  member: Member;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({
  member,
  onClose,
  onEdit
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const applicationDocRef = useRef<HTMLDivElement>(null);
  const [isExportingApp, setIsExportingApp] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handlePrintApplication = async () => {
    if (!applicationDocRef.current) return;
    setIsExportingApp(true);
    setExportSuccess(false);

    try {
      const filename = `ใบสมัครสมาชิก_${member.id}_${member.fullName.replace(/\s+/g, '_')}.pdf`;
      await exportElementToPdf(
        applicationDocRef.current,
        filename,
        `ใบสมัครสมาชิก - ${member.fullName} (${member.id})`,
        'portrait'
      );
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to export member application PDF:', error);
      // Fallback: use window.print
      window.print();
    } finally {
      setIsExportingApp(false);
    }
  };

  // Mask national ID: e.g. 5-5701-xxxx-xx-1
  const maskedIdCard = member.idCard && member.idCard.length === 13
    ? `${member.idCard.slice(0, 1)}-${member.idCard.slice(1, 5)}-XXXXX-${member.idCard.slice(10, 12)}-${member.idCard.slice(12)}`
    : member.idCard || '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title with Association Logo */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <AssociationLogo variant="badge" theme="green" className="w-11 h-11 shadow-xs" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                บัตรประจำตัวสมาชิกดิจิทัล (AFECT Digital ID)
              </h2>
              <p className="text-xs text-slate-500">
                สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า เชียงราย
              </p>
            </div>
          </div>
        </div>

        {/* --- OFFICIAL AKHA MEMBER CARD DISPLAY --- */}
        <div 
          ref={cardRef} 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border-2 border-emerald-400/50"
        >
          {/* Subtle Akha geometric watermarks & official logo watermark */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
          
          {/* Faded Authentic Logo Watermark in Background of Card */}
          <div className="absolute right-2 bottom-4 w-72 opacity-15 pointer-events-none mix-blend-screen">
            <AssociationLogo variant="full" theme="white" />
          </div>

          {/* Card Top Header with Official Association Logo */}
          <div className="relative z-10 flex items-start justify-between border-b border-emerald-800/60 pb-4 mb-5">
            <div className="flex items-center gap-3.5">
              <AssociationLogo 
                variant="badge" 
                theme="white"
                className="w-14 h-14 flex-shrink-0 shadow-lg" 
              />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight">
                  สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า
                </h3>
                <p className="text-[11px] text-emerald-300 font-light">
                  ASSOCIATION FOR AKHA EDUCATION AND CULTURE (AFECT) • เชียงราย
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${
                member.memberType === 'ถาวร'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-600 text-white'
              }`}>
                สมาชิก{member.memberType}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-5 items-center">
            
            {/* 2-Inch Photo Display */}
            <div className="sm:col-span-1 flex flex-col items-center">
              <div className="w-28 h-36 rounded-xl bg-gradient-to-b from-slate-900 to-emerald-950 border-2 border-emerald-400/70 flex flex-col items-center justify-center text-center shadow-lg overflow-hidden relative group">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-700/80 text-white flex items-center justify-center font-bold text-lg mb-1 shadow-inner">
                      {member.fullName.replace(/^(นาย|นาง|นางสาว|อาจารย์)\s*/, '').charAt(0)}
                    </div>
                    <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold mt-1">
                      MEMBER
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 py-0.5 bg-emerald-600 text-white text-[9px] font-bold text-center">
                  {member.status}
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div className="sm:col-span-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-emerald-200/80 uppercase tracking-wider block">ชื่อ - นามสกุล</span>
                  <h4 className="text-lg sm:text-xl font-extrabold text-amber-200">
                    {member.fullName}
                  </h4>
                </div>

                {/* Official Circular Seal Stamp */}
                <div className="hidden sm:block flex-shrink-0 -mt-1 -mr-1">
                  <AssociationLogo variant="seal" theme="white" className="w-18 h-18 drop-shadow-lg opacity-95" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-emerald-200/70 text-[11px] block">รหัสประจำตัวสมาชิก:</span>
                  <span className="font-mono font-bold text-sm text-white tracking-wider">
                    {member.id}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-200/70 text-[11px] block">เลขประจำตัว ปชช.:</span>
                  <span className="font-mono text-slate-300">
                    {maskedIdCard}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-emerald-200/70 text-[11px] block">ชุมชน / ภูมิลำเนา:</span>
                  <span className="text-slate-200 truncate block">
                    {member.village || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-200/70 text-[11px] block">จังหวัด:</span>
                  <span className="text-slate-200">
                    {member.province || 'เชียงราย'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-200/70 pt-1 border-t border-emerald-900/60">
                <span>วันที่ออกบัตร: {member.registeredDate}</span>
                <span>อายุบัตร: {member.memberType === 'ถาวร' ? 'ตลอดชีพ' : '1 ปีนับจากวันอนุมัติ'}</span>
              </div>
            </div>

          </div>

          {/* Card Bottom Bar */}
          <div className="relative z-10 mt-5 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>บัตรสมาชิกทางการ สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 text-[10px]">AFECT-VERIFIED</span>
              <div className="sm:hidden">
                <AssociationLogo variant="seal" theme="white" className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Profile Information */}
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
          <h4 className="text-sm font-bold text-slate-900">ข้อมูลรายละเอียดผู้ถือบัตร</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="text-slate-500 font-medium">ข้อมูลส่วนตัวและอาชีพ:</div>
              <div className="text-slate-800">
                <strong>เพศ:</strong> {member.gender} | <strong>อายุ:</strong> {member.age} ปี | <strong>วันเกิด:</strong> {member.birthDate || '-'}
              </div>
              <div className="text-slate-800">
                <strong>การศึกษา:</strong> {member.education}
              </div>
              <div className="text-slate-800">
                <strong>อาชีพ:</strong> {member.occupation} {member.position ? `(${member.position})` : ''}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="text-slate-500 font-medium">ที่อยู่และติดต่อ:</div>
              <div className="text-slate-800">
                {member.houseNo} {member.village} ต.{member.subdistrict} อ.{member.district} จ.{member.province} {member.postalCode}
              </div>
              <div className="text-slate-800">
                <strong>โทร:</strong> {member.phone} | <strong>Email:</strong> {member.email || '-'}
              </div>
              <div className="text-slate-800">
                <strong>LINE:</strong> {member.lineId || '-'} | <strong>Facebook:</strong> {member.facebook || '-'}
              </div>
            </div>
          </div>

          {member.skills && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs">
              <span className="font-bold text-amber-900">ความถนัดและความสนใจ: </span>
              <span className="text-amber-800">{member.skills}</span>
            </div>
          )}

          {member.notes && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
              <span className="font-semibold text-slate-700">หมายเหตุ: </span>
              {member.notes}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            แก้ไขข้อมูลสมาชิก
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              ปิดหน้าต่าง
            </button>

            {/* ปุ่มพิมพ์ใบสมัคร (A4 Official Application Document) */}
            <button
              type="button"
              onClick={handlePrintApplication}
              disabled={isExportingApp}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border font-bold text-xs transition-all shadow-xs ${
                exportSuccess
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-emerald-50/80 text-emerald-800 border-emerald-600/70 active:scale-95'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              title="พิมพ์เอกสารใบสมัครสมาชิกขนาด A4 พร้อมข้อมูลทางการ"
            >
              {isExportingApp ? (
                <>
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>กำลังสร้างเอกสาร A4...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ดาวน์โหลดใบสมัครแล้ว</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>พิมพ์ใบสมัคร (A4)</span>
                </>
              )}
            </button>

            {/* ปุ่มพิมพ์บัตรสมาชิก (ID Card) */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>พิมพ์บัตรสมาชิก</span>
            </button>
          </div>
        </div>

      </div>

      {/* Hidden container for rendering official A4 Member Application Document for PDF export */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: '-9999px', 
          width: '794px', 
          backgroundColor: '#ffffff',
          zIndex: -100,
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        <div ref={applicationDocRef}>
          <MemberApplicationDocument member={member} />
        </div>
      </div>
    </div>
  );
};
