import React, { useState, useMemo, useRef } from 'react';
import { Member, MemberType, MemberStatus } from '../types/member';
import { AssociationLogo } from './AssociationLogo';
import { exportElementToPdf } from '../services/pdfExport';
import { 
  BarChart3, 
  Users, 
  Award, 
  Clock, 
  PieChart, 
  TrendingUp, 
  MapPin, 
  Printer, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  Calendar,
  Download,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Table as TableIcon,
  Phone,
  RotateCcw
} from 'lucide-react';

interface ReportsProps {
  members: Member[];
}

export const Reports: React.FC<ReportsProps> = ({ members }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);
  
  // Table search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MemberType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const total = members.length || 1; // avoid divide by 0

  // 1. Membership Types
  const lifetime = members.filter(m => m.memberType === 'ถาวร').length;
  const annual = members.filter(m => m.memberType === 'รายปี').length;

  // 2. Statuses
  const approved = members.filter(m => m.status === 'อนุมัติแล้ว').length;
  const pending = members.filter(m => m.status === 'รอการอนุมัติ').length;
  const expired = members.filter(m => m.status === 'หมดอายุ').length;

  // 3. Gender
  const male = members.filter(m => m.gender === 'ชาย').length;
  const female = members.filter(m => m.gender === 'หญิง').length;
  const otherGender = members.filter(m => m.gender === 'อื่นๆ').length;

  // 4. Age Groups
  const ageUnder20 = members.filter(m => m.age > 0 && m.age < 20).length;
  const age20to35 = members.filter(m => m.age >= 20 && m.age <= 35).length;
  const age36to50 = members.filter(m => m.age >= 36 && m.age <= 50).length;
  const age51to65 = members.filter(m => m.age >= 51 && m.age <= 65).length;
  const ageOver65 = members.filter(m => m.age > 65).length;

  // 5. Provinces
  const provinceCounts: Record<string, number> = {};
  members.forEach(m => {
    const prov = m.province || 'ไม่ระบุ';
    provinceCounts[prov] = (provinceCounts[prov] || 0) + 1;
  });
  const sortedProvinces = Object.entries(provinceCounts)
    .sort((a, b) => b[1] - a[1]);

  const uniqueProvinces = useMemo(() => {
    return Array.from(new Set(members.map(m => m.province).filter(Boolean))).sort();
  }, [members]);

  // 6. Districts
  const districtCounts: Record<string, number> = {};
  members.forEach(m => {
    if (m.district) {
      districtCounts[m.district] = (districtCounts[m.district] || 0) + 1;
    }
  });
  const sortedDistricts = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 7. Education
  const educationCounts: Record<string, number> = {};
  members.forEach(m => {
    const edu = m.education || 'ไม่ระบุ';
    educationCounts[edu] = (educationCounts[edu] || 0) + 1;
  });
  const sortedEducation = Object.entries(educationCounts)
    .sort((a, b) => b[1] - a[1]);

  // 8. Top Occupations
  const occupationCounts: Record<string, number> = {};
  members.forEach(m => {
    if (m.occupation && m.occupation !== 'ไม่ได้ระบุ') {
      occupationCounts[m.occupation] = (occupationCounts[m.occupation] || 0) + 1;
    }
  });
  const sortedOccupations = Object.entries(occupationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Filtered members for table
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const search = searchTerm.toLowerCase().trim();
      const matchSearch = !search || (
        m.fullName.toLowerCase().includes(search) ||
        m.id.toLowerCase().includes(search) ||
        (m.village && m.village.toLowerCase().includes(search)) ||
        (m.district && m.district.toLowerCase().includes(search)) ||
        (m.subdistrict && m.subdistrict.toLowerCase().includes(search)) ||
        (m.province && m.province.toLowerCase().includes(search)) ||
        (m.occupation && m.occupation.toLowerCase().includes(search)) ||
        m.phone.includes(search)
      );

      const matchType = typeFilter === 'all' || m.memberType === typeFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchProvince = provinceFilter === 'all' || m.province === provinceFilter;

      return matchSearch && matchType && matchStatus && matchProvince;
    });
  }, [members, searchTerm, typeFilter, statusFilter, provinceFilter]);

  const handlePrintReport = () => {
    window.print();
  };

  // Download PDF Handler
  const handleDownloadPdf = async () => {
    if (!pdfContainerRef.current) return;
    try {
      setIsGeneratingPdf(true);
      setPdfNotification('กำลังจัดเตรียมข้อมูลและเรนเดอร์เอกสาร PDF...');
      
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `รายงานทะเบียนสมาชิก_สมาคมอ่าข่า_AFECT_${dateStr}.pdf`;

      await exportElementToPdf(
        pdfContainerRef.current,
        filename,
        'รายงานทะเบียนสมาชิก สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)'
      );

      setPdfNotification('ดาวน์โหลดไฟล์รายงานสมาชิก PDF เรียบร้อยแล้ว!');
      setTimeout(() => setPdfNotification(null), 4000);
    } catch (err: any) {
      console.error('PDF generation failed:', err);
      setPdfNotification('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ' + (err?.message || 'โปรดลองใหม่อีกครั้ง'));
      setTimeout(() => setPdfNotification(null), 5000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setProvinceFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || typeFilter !== 'all' || statusFilter !== 'all' || provinceFilter !== 'all';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast Notification */}
      {pdfNotification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in slide-in-from-top duration-200 max-w-md">
          <div className="p-4 rounded-2xl shadow-xl bg-slate-900 text-white border border-emerald-500/50 flex items-center gap-3">
            {isGeneratingPdf ? (
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium leading-snug">
              {pdfNotification}
            </span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <AssociationLogo 
            variant="badge" 
            theme="green"
            className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 drop-shadow-xs" 
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                รายงานสถิติและข้อมูลสมาชิก
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                AFECT STATS & ROSTER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH')})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
            title="Export ข้อมูลสมาชิกในตารางออกเป็นไฟล์ PDF ทางการ"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-emerald-100" />
            )}
            <span>ดาวน์โหลดรายงานสมาชิก</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">PDF</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>พิมพ์รายงานฉบับนี้</span>
          </button>
        </div>
      </div>

      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>สมาชิกรวมทั้งหมด</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{members.length}</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            อนุมัติแล้ว {Math.round((approved / total) * 100)}% ({approved} ท่าน)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>สมาชิกถาวร</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">{lifetime}</div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((lifetime / total) * 100)}% ของสมาชิกรวม
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>สมาชิกรายปี</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-teal-700">{annual}</div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((annual / total) * 100)}% ของสมาชิกรวม
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>รอการอนุมัติ</span>
            <TrendingUp className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-3xl font-extrabold text-yellow-600">{pending}</div>
          <div className="text-xs text-slate-500 mt-1">
            ใบสมัครใหม่รอดำเนินการ
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Gender Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-700" />
              <span>สัดส่วนเพศของสมาชิก</span>
            </h3>
            <span className="text-xs text-slate-400">ทั้งหมด {members.length} ท่าน</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">ชาย ({male} ท่าน)</span>
                <span className="text-emerald-700">{Math.round((male / total) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-700 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(male / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">หญิง ({female} ท่าน)</span>
                <span className="text-teal-600">{Math.round((female / total) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(female / total) * 100}%` }}
                ></div>
              </div>
            </div>

            {otherGender > 0 && (
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">อื่นๆ ({otherGender} ท่าน)</span>
                  <span className="text-slate-600">{Math.round((otherGender / total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(otherGender / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Age Demographics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>การกระจายตามกลุ่มอายุ</span>
            </h3>
            <span className="text-xs text-slate-400">ช่วงวัย</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'ต่ำกว่า 20 ปี (เยาวชน)', count: ageUnder20, color: 'bg-emerald-500' },
              { label: '20 - 35 ปี (วัยหนุ่มสาว/คนทำงาน)', count: age20to35, color: 'bg-indigo-600' },
              { label: '36 - 50 ปี (วัยกลางคน/ผู้นำ)', count: age36to50, color: 'bg-amber-500' },
              { label: '51 - 65 ปี (ผู้ใหญ่)', count: age51to65, color: 'bg-rose-500' },
              { label: 'มากกว่า 65 ปี (ผู้อาวุโส/ปราชญ์)', count: ageOver65, color: 'bg-purple-600' }
            ].map(group => (
              <div key={group.label}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{group.label} ({group.count} ท่าน)</span>
                  <span className="text-slate-600">{Math.round((group.count / total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${group.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(group.count / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Education Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>ระดับการศึกษาของสมาชิก</span>
            </h3>
          </div>

          <div className="space-y-2.5 pt-1">
            {sortedEducation.map(([edu, count]) => (
              <div key={edu}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 truncate max-w-[220px]">{edu}</span>
                  <span className="text-slate-500">{count} ท่าน ({Math.round((count / total) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${(count / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Geographic Spread */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>การกระจายตามพื้นที่และชุมชน</span>
            </h3>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">จังหวัดหลัก:</span>
            <div className="space-y-2 mb-4">
              {sortedProvinces.map(([prov, count]) => (
                <div key={prov}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">จ.{prov}</span>
                    <span className="text-rose-600">{count} ท่าน</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full" 
                      style={{ width: `${(count / total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {sortedDistricts.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">อำเภอที่มีสมาชิกมากที่สุด:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sortedDistricts.map(([dist, count]) => (
                    <span key={dist} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      อ.{dist}: <strong className="text-slate-900">{count}</strong> ท่าน
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Top Occupations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Briefcase className="w-4 h-4 text-amber-600" />
          <span>กลุ่มอาชีพและความถนัดเด่นของสมาชิกในสมาคม</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedOccupations.map(([occ, count]) => (
            <div key={occ} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-slate-800">{occ}</div>
                <div className="text-xs text-slate-500 mt-0.5">สมาชิกในเครือข่าย</div>
              </div>
              <div className="text-xl font-extrabold text-indigo-700 bg-white w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 shadow-xs">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION: ตารางรายงานข้อมูลสมาชิก และปุ่มดาวน์โหลดรายงานสมาชิก PDF */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <TableIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  ตารางรายงานข้อมูลสมาชิกสมาคมฯ
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {filteredMembers.length} รายการ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ตารางข้อมูลทะเบียนสมาชิกฉบับสมบูรณ์ พร้อมดาวน์โหลดเป็นเอกสาร PDF ทางการสำหรับนำไปพิมพ์หรือส่งต่อ
              </p>
            </div>
          </div>

          {/* Export PDF Button on Table Header */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-center disabled:opacity-50"
            title="ดาวน์โหลดรายงานสมาชิกที่อยู่ในตารางเป็นไฟล์ PDF"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>ดาวน์โหลดรายงานสมาชิก</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">PDF</span>
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัส, ชุมชน, โทร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
            >
              <option value="all">ประเภทสมาชิก: ทั้งหมด</option>
              <option value="ถาวร">สมาชิกถาวร (ตลอดชีพ)</option>
              <option value="รายปี">สมาชิกรายปี</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
            >
              <option value="all">สถานะ: ทั้งหมด</option>
              <option value="อนุมัติแล้ว">อนุมัติแล้ว (Approved)</option>
              <option value="รอการอนุมัติ">รอการอนุมัติ (Pending)</option>
              <option value="หมดอายุ">หมดอายุ (Expired)</option>
            </select>
          </div>

          {/* Province Filter & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
            >
              <option value="all">จังหวัด: ทั้งหมด</option>
              {uniqueProvinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
                title="ล้างตัวกรองทั้งหมด"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Member Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">ลำดับ</th>
                <th className="py-3.5 px-4">รหัสสมาชิก</th>
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4">ประเภท</th>
                <th className="py-3.5 px-4">เพศ/อายุ</th>
                <th className="py-3.5 px-4">ชุมชน / จังหวัด</th>
                <th className="py-3.5 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3.5 px-4">วันที่สมัคร</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-sm text-slate-600">ไม่พบข้อมูลสมาชิกตามเงื่อนไขที่เลือก</p>
                    <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูข้อมูลทั้งหมด</p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        ล้างตัวกรอง
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m, index) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {m.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {m.fullName.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800">{m.fullName}</div>
                          {m.occupation && m.occupation !== 'ไม่ได้ระบุ' && (
                            <div className="text-[11px] text-slate-500">{m.occupation}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        m.memberType === 'ถาวร'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {m.memberType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span>{m.gender || '-'}</span>
                      {m.age > 0 && <span className="text-slate-400 ml-1">({m.age} ปี)</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{m.village || '-'}</div>
                      <div className="text-[11px] text-slate-400">
                        {[m.district && `อ.${m.district}`, m.province && `จ.${m.province}`].filter(Boolean).join(' ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {m.phone || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {m.registeredDate || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        m.status === 'อนุมัติแล้ว'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : m.status === 'รอการอนุมัติ'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-2">
          <div>
            แสดงผล <strong>{filteredMembers.length}</strong> จากทั้งหมด <strong>{members.length}</strong> สมาชิก
            {hasActiveFilters && <span className="text-emerald-700 font-medium ml-1">(กรองข้อมูลอยู่)</span>}
          </div>
          <div className="flex items-center gap-2">
            <span>เอกสารพร้อมสำหรับการออกรายงานทางการ</span>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* DEDICATED EXPORTABLE PDF REPORT CONTAINER                      */}
      {/* (Captures crisp A4 Landscape document with AFECT Official Seal)*/}
      {/* ============================================================== */}
      <div 
        ref={pdfContainerRef}
        style={{
          position: 'fixed',
          left: isGeneratingPdf ? '0' : '-99999px',
          top: 0,
          width: '1280px',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          padding: '36px 44px',
          fontFamily: "'Prompt', sans-serif",
          zIndex: isGeneratingPdf ? 9999 : -1,
          opacity: isGeneratingPdf ? 1 : 0,
          pointerEvents: 'none'
        }}
      >
        {/* Letterhead Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #065f46', paddingBottom: '18px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <AssociationLogo variant="badge" theme="green" style={{ width: '80px', height: '80px', flexShrink: 0 }} className="" />
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#064e3b', margin: 0, letterSpacing: '-0.02em' }}>
                สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า
              </h1>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                ASSOCIATION FOR AKHA EDUCATION AND CULTURE (AFECT) • ทะเบียนเลขที่ 4/2539
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                รายงานทะเบียนและข้อมูลสมาชิก (Official Member Roster Report) • ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <AssociationLogo variant="seal" theme="green" style={{ width: '96px', height: '96px', flexShrink: 0 }} className="" />
        </div>

        {/* Executive Stats Bar in PDF */}
        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '12px', fontWeight: 600 }}>
          <div style={{ color: '#0f172a' }}>
            สมาชิกรวมทั้งหมด: <strong style={{ color: '#065f46', fontSize: '14px' }}>{members.length}</strong> ท่าน
          </div>
          <div style={{ color: '#b45309' }}>
            สมาชิกถาวร: <strong>{lifetime}</strong> ท่าน
          </div>
          <div style={{ color: '#0f766e' }}>
            สมาชิกรายปี: <strong>{annual}</strong> ท่าน
          </div>
          <div style={{ color: '#059669' }}>
            อนุมัติแล้ว: <strong>{approved}</strong> ท่าน ({Math.round((approved / total) * 100)}%)
          </div>
          <div style={{ color: '#334155' }}>
            ชาย: <strong>{male}</strong> | หญิง: <strong>{female}</strong>
          </div>
        </div>

        {/* Members Table in PDF */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#064e3b', color: '#ffffff' }}>
              <th style={{ padding: '8px 10px', width: '40px', textAlign: 'center', border: '1px solid #064e3b' }}>ลำดับ</th>
              <th style={{ padding: '8px 10px', width: '120px', border: '1px solid #064e3b' }}>รหัสสมาชิก</th>
              <th style={{ padding: '8px 10px', width: '180px', border: '1px solid #064e3b' }}>ชื่อ - นามสกุล</th>
              <th style={{ padding: '8px 10px', width: '80px', border: '1px solid #064e3b', textAlign: 'center' }}>ประเภท</th>
              <th style={{ padding: '8px 10px', width: '70px', border: '1px solid #064e3b', textAlign: 'center' }}>เพศ/อายุ</th>
              <th style={{ padding: '8px 10px', border: '1px solid #064e3b' }}>ชุมชน / อำเภอ / จังหวัด</th>
              <th style={{ padding: '8px 10px', width: '100px', border: '1px solid #064e3b' }}>เบอร์โทรศัพท์</th>
              <th style={{ padding: '8px 10px', width: '85px', border: '1px solid #064e3b', textAlign: 'center' }}>วันที่สมัคร</th>
              <th style={{ padding: '8px 10px', width: '85px', border: '1px solid #064e3b', textAlign: 'center' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {(filteredMembers.length > 0 ? filteredMembers : members).map((m, idx) => (
              <tr key={m.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '7px 8px', textAlign: 'center', border: '1px solid #cbd5e1', color: '#64748b' }}>
                  {idx + 1}
                </td>
                <td style={{ padding: '7px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#065f46', border: '1px solid #cbd5e1' }}>
                  {m.id}
                </td>
                <td style={{ padding: '7px 8px', fontWeight: 700, color: '#1e293b', border: '1px solid #cbd5e1' }}>
                  {m.fullName}
                  {m.occupation && m.occupation !== 'ไม่ได้ระบุ' && (
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 400 }}>{m.occupation}</div>
                  )}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontSize: '10px', 
                    fontWeight: 700,
                    background: m.memberType === 'ถาวร' ? '#fef3c7' : '#ccfbf1',
                    color: m.memberType === 'ถาวร' ? '#92400e' : '#115e59'
                  }}>
                    {m.memberType}
                  </span>
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#334155', border: '1px solid #cbd5e1' }}>
                  {m.gender || '-'} {m.age > 0 ? `(${m.age}ปี)` : ''}
                </td>
                <td style={{ padding: '7px 8px', color: '#334155', border: '1px solid #cbd5e1' }}>
                  {[m.village, m.subdistrict && `ต.${m.subdistrict}`, m.district && `อ.${m.district}`, m.province && `จ.${m.province}`].filter(Boolean).join(' ')}
                </td>
                <td style={{ padding: '7px 8px', fontFamily: 'monospace', color: '#334155', border: '1px solid #cbd5e1' }}>
                  {m.phone || '-'}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', fontFamily: 'monospace', fontSize: '10px', color: '#475569', border: '1px solid #cbd5e1' }}>
                  {m.registeredDate || '-'}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontSize: '10px', 
                    fontWeight: 700,
                    background: m.status === 'อนุมัติแล้ว' ? '#dcfce7' : m.status === 'รอการอนุมัติ' ? '#fef3c7' : '#fee2e2',
                    color: m.status === 'อนุมัติแล้ว' ? '#166534' : m.status === 'รอการอนุมัติ' ? '#854d0e' : '#991b1b'
                  }}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Official Sign-off and Seal in PDF */}
        <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '380px' }}>
            <div style={{ fontWeight: 700, color: '#334155', marginBottom: '3px' }}>
              การรับรองเอกสารทะเบียนสมาชิกสมาคมฯ
            </div>
            <div>
              เอกสารฉบับนี้พิมพ์จากฐานข้อมูลระบบทะเบียนสมาชิกดิจิทัล สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) รับรองความถูกต้องของข้อมูลตามข้อบังคับสมาคมฯ
            </div>
          </div>

          <div style={{ display: 'flex', gap: '48px', textAlign: 'center', fontSize: '11px', color: '#334155' }}>
            <div>
              <div style={{ borderBottom: '1px dotted #94a3b8', width: '180px', height: '36px', margin: '0 auto' }}></div>
              <div style={{ marginTop: '6px', fontWeight: 700 }}>( .................................................... )</div>
              <div style={{ color: '#64748b', fontSize: '10px', marginTop: '2px' }}>นายทะเบียนสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า</div>
            </div>

            <div>
              <div style={{ borderBottom: '1px dotted #94a3b8', width: '180px', height: '36px', margin: '0 auto' }}></div>
              <div style={{ marginTop: '6px', fontWeight: 700 }}>( .................................................... )</div>
              <div style={{ color: '#64748b', fontSize: '10px', marginTop: '2px' }}>นายกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
