import React from 'react';
import { Member } from '../types/member';
import { AssociationLogo } from './AssociationLogo';

interface MemberApplicationDocumentProps {
  member: Member;
}

/**
 * เอกสารทางการแบบฟอร์มใบสมัครและทะเบียนประวัติสมาชิก สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)
 * จัดวางสำหรับกระดาษมาตรฐาน A4 สวยงาม ทางการ มีตราสัญลักษณ์ ข้อมูลผู้สมัคร ลายมือชื่อ และส่วนการรับรอง
 */
export const MemberApplicationDocument: React.FC<MemberApplicationDocumentProps> = ({ member }) => {
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const registeredDateFormatted = (() => {
    try {
      if (!member.registeredDate) return '-';
      const parts = member.registeredDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return member.registeredDate;
    } catch {
      return member.registeredDate;
    }
  })();

  const birthDateFormatted = (() => {
    try {
      if (!member.birthDate) return '-';
      const parts = member.birthDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return member.birthDate;
    } catch {
      return member.birthDate;
    }
  })();

  return (
    <div
      id="member-application-a4-form"
      style={{
        width: '794px', // 210mm at 96 DPI
        minHeight: '1123px', // 297mm at 96 DPI
        boxSizing: 'border-box',
        padding: '38px 46px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Sarabun', 'Noto Sans Thai', 'TH Sarabun New', sans-serif",
        position: 'relative',
        lineHeight: 1.5,
        fontSize: '13px'
      }}
    >
      {/* Background Watermark Seal */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <AssociationLogo variant="full" theme="green" className="w-[450px] h-[450px]" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Document Header with Logos */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2.5px solid #065f46',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <AssociationLogo variant="badge" theme="green" className="w-20 h-20 flex-shrink-0" />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', letterSpacing: '-0.3px' }}>
                สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)
              </div>
              <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, letterSpacing: '0.4px', marginTop: '1px' }}>
                ASSOCIATION FOR AKHA EDUCATION AND CULTURE IN THAILAND
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                สำนักงานใหญ่: อำเภอเมืองเชียงราย จังหวัดเชียงราย 57000 • ทะเบียนสมาคมเลขที่ จ. 289/2544
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: 'right',
              border: '1.5px solid #065f46',
              borderRadius: '10px',
              padding: '8px 14px',
              backgroundColor: '#f0fdf4'
            }}
          >
            <div style={{ fontSize: '10px', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>
              ใบสมัครและทะเบียนสมาชิก
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
              {member.id}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
              ประเภท: <strong>สมาชิก{member.memberType}</strong>
            </div>
          </div>
        </div>

        {/* Title of Document */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#065f46',
              margin: '0 0 4px 0',
              textDecoration: 'underline',
              textUnderlineOffset: '4px'
            }}
          >
            ใบสมัครสมาชิกและทะเบียนประวัติสมาชิกสมาคม
          </h1>
          <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
            คำขอสมัครเข้าเป็นสมาชิก / ทะเบียนประวัติอย่างเป็นทางการของสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า
          </p>
        </div>

        {/* Main Content Layout (Left Details + Right Photo/Meta Box) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '24px', marginBottom: '18px' }}>
          <div>
            {/* Status and Registration Date Header Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '14px',
                fontSize: '12px'
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>วันที่ยื่นคำขอ/ขึ้นทะเบียน: </span>
                <strong style={{ color: '#0f172a' }}>{registeredDateFormatted}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>สถานภาพปัจจุบัน: </span>
                <span
                  style={{
                    backgroundColor: member.status === 'อนุมัติแล้ว' ? '#dcfce7' : '#fef9c3',
                    color: member.status === 'อนุมัติแล้ว' ? '#166534' : '#854d0e',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '11px',
                    border: '1px solid ' + (member.status === 'อนุมัติแล้ว' ? '#86efac' : '#fde047')
                  }}
                >
                  {member.status}
                </span>
              </div>
            </div>

            {/* Section 1: Personal Profile */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#065f46',
                  backgroundColor: '#ecfdf5',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #059669'
                }}
              >
                หมวดที่ ๑: ข้อมูลส่วนบุคคล (Personal Information)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 18px', padding: '0 6px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>ชื่อ-นามสกุล (ผู้สมัคร):</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{member.fullName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>เลขประจำตัวประชาชน (๑๓ หลัก):</span>
                  <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                    {member.idCard || '-'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>เพศ:</span>
                  <span style={{ fontWeight: 600 }}>{member.gender || '-'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>วัน/เดือน/ปีเกิด (อายุ):</span>
                  <span>{birthDateFormatted} ({member.age || '-'} ปี)</span>
                </div>
              </div>
            </div>

            {/* Section 2: Education & Occupation */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#065f46',
                  backgroundColor: '#ecfdf5',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #059669'
                }}
              >
                หมวดที่ ๒: ระดับการศึกษาและอาชีพ (Education & Career)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 18px', padding: '0 6px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>ระดับการศึกษาสูงสุด:</span>
                  <span style={{ fontWeight: 600 }}>{member.education || '-'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>อาชีพปัจจุบัน:</span>
                  <span style={{ fontWeight: 600 }}>
                    {member.occupation || '-'} {member.position ? `(${member.position})` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2.5 Photo Box & Official Seal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '130px',
                height: '165px',
                border: '1.5px dashed #059669',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '10px', color: '#64748b' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>👤</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>รูปถ่ายหน้าตรง</div>
                  <div style={{ fontSize: '10px' }}>ขนาด ๑.๕ - ๒ นิ้ว</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>(ถ่ายไม่เกิน ๖ เดือน)</div>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <AssociationLogo variant="seal" theme="green" className="w-20 h-20 opacity-80" />
              <div style={{ fontSize: '9px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>
                ตราสมาคมเพื่อการรับรอง
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Residential Address */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              padding: '5px 12px',
              borderRadius: '6px',
              marginBottom: '10px',
              borderLeft: '4px solid #059669'
            }}
          >
            หมวดที่ ๓: ภูมิลำเนาและที่อยู่ตามทะเบียนราษฎร์ (Residential Address)
          </div>
          <div style={{ padding: '0 6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 18px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>บ้านเลขที่ / ซอย / ถนน:</span>
              <span>
                {[member.houseNo && `เลขที่ ${member.houseNo}`, member.soi && `ซอย${member.soi}`, member.road && `ถ.${member.road}`].filter(Boolean).join(' ') || '-'}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>หมู่บ้าน / ชุมชน:</span>
              <span style={{ fontWeight: 600 }}>{member.village || '-'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>ตำบล / แขวง:</span>
              <span>{member.subdistrict || '-'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>อำเภอ / เขต:</span>
              <span>{member.district || '-'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>จังหวัด:</span>
              <span style={{ fontWeight: 600 }}>{member.province || 'เชียงราย'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>รหัสไปรษณีย์:</span>
              <span style={{ fontFamily: 'monospace' }}>{member.postalCode || '-'}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Social Media */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              padding: '5px 12px',
              borderRadius: '6px',
              marginBottom: '10px',
              borderLeft: '4px solid #059669'
            }}
          >
            หมวดที่ ๔: ข้อมูลการติดต่อ (Contact & Communication)
          </div>
          <div style={{ padding: '0 6px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px 14px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>โทรศัพท์ติดต่อ:</span>
              <span style={{ fontWeight: 700, color: '#065f46' }}>{member.phone || '-'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>อีเมล (E-mail):</span>
              <span>{member.email || '-'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>LINE ID:</span>
              <span>{member.lineId || '-'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Facebook:</span>
              <span>{member.facebook || '-'}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Skills & Special Interests */}
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              padding: '5px 12px',
              borderRadius: '6px',
              marginBottom: '10px',
              borderLeft: '4px solid #059669'
            }}
          >
            หมวดที่ ๕: ความถนัด ศิลปวัฒนธรรม และความสนใจร่วมกิจกรรม
          </div>
          <div style={{ padding: '0 6px', fontSize: '12px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>ความชำนาญ/ความถนัด: </span>
              <span style={{ color: '#0f172a' }}>{member.skills || 'ไม่มีระบุ'}</span>
            </div>
            {member.notes && (
              <div style={{ backgroundColor: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>บันทึกเพิ่มเติมจากเจ้าหน้าที่: </span>
                <span style={{ color: '#334155' }}>{member.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Declaration and Signature Section */}
        <div
          style={{
            borderTop: '1.5px solid #cbd5e1',
            paddingTop: '16px',
            marginTop: '16px',
            pageBreakInside: 'avoid'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#475569', textAlign: 'justify', lineHeight: 1.6, marginBottom: '22px' }}>
            ข้าพเจ้าขอรับรองว่า ข้อมูลรายละเอียดที่ระบุไว้ในแบบคำขอสมัครสมาชิกนี้เป็นความจริงทุกประการ ข้าพเจ้ายินดีปฏิบัติตามระเบียบข้อบังคับ 
            และมุ่งมั่นที่จะมีส่วนร่วมในการส่งเสริมการศึกษา อนุรักษ์สืบสานมรดกวัฒนธรรมและภูมิปัญญาของชาวอ่าข่าร่วมกับทางสมาคมฯ อย่างต่อเนื่อง
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', marginTop: '10px' }}>
            {/* Applicant Signature Box */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '32px' }}>
                ลงชื่อ ................................................................................
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>
                ( {member.fullName} )
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                ผู้ยื่นคำขอสมัครสมาชิก
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                วันที่ {registeredDateFormatted}
              </div>
            </div>

            {/* Association Authority Signature & Seal Box */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '32px' }}>
                ลงชื่อ ................................................................................
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>
                ( ................................................................................ )
              </div>
              <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 600, marginTop: '4px' }}>
                นายกสมาคมฯ / นายทะเบียนสมาชิก AFECT
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                วันที่พิมพ์เอกสาร {currentDate}
              </div>
            </div>
          </div>
        </div>

        {/* Document Footer Note */}
        <div
          style={{
            marginTop: '26px',
            paddingTop: '10px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#94a3b8'
          }}
        >
          <div>
            AFECT OFFICIAL REGISTRATION FORM • รหัสเอกสาร: AFECT-REG-{member.id}
          </div>
          <div>
            ระบบสารสนเทศสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (พิมพ์เมื่อ: {currentDate})
          </div>
        </div>
      </div>
    </div>
  );
};
