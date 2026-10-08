import React, { useState } from 'react';
import { Member, SheetConfig, ActiveTab } from '../types/member';
import { AssociationLogo } from './AssociationLogo';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Sparkles, 
  UserPlus, 
  SlidersHorizontal, 
  BarChart3, 
  FileSpreadsheet, 
  ExternalLink, 
  MapPin, 
  Award, 
  BookOpen, 
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Lock,
  ShieldCheck,
  Search,
  CreditCard,
  AlertCircle,
  GraduationCap,
  Briefcase,
  PieChart,
  Layers,
  Compass
} from 'lucide-react';

interface OverviewProps {
  members: Member[];
  sheetConfig: SheetConfig;
  onNavigate: (tab: ActiveTab) => void;
  onSelectMember: (member: Member) => void;
  onApproveMember: (memberId: string) => void;
  onManualSync: () => void;
  isSyncing: boolean;
  hasToken: boolean;
  onLogin: () => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  members,
  sheetConfig,
  onNavigate,
  onSelectMember,
  onApproveMember,
  onManualSync,
  isSyncing,
  hasToken,
  onLogin,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Member | null | 'not_found'>(null);

  const totalCount = members.length;
  const lifetimeCount = members.filter(m => m.memberType === 'ถาวร').length;
  const annualCount = members.filter(m => m.memberType === 'รายปี').length;
  const approvedCount = members.filter(m => m.status === 'อนุมัติแล้ว').length;
  const pendingCount = members.filter(m => m.status === 'รอการอนุมัติ').length;

  // Distinct villages & provinces
  const uniqueVillages = new Set(members.map(m => m.village).filter(Boolean)).size;
  const uniqueProvinces = new Set(members.map(m => m.province).filter(Boolean)).size;

  // 1. Gender Distribution
  const maleCount = members.filter(m => m.gender === 'ชาย').length;
  const femaleCount = members.filter(m => m.gender === 'หญิง').length;
  const otherGenderCount = members.filter(m => m.gender === 'อื่นๆ').length;
  const malePercent = totalCount ? Math.round((maleCount / totalCount) * 100) : 0;
  const femalePercent = totalCount ? Math.round((femaleCount / totalCount) * 100) : 0;
  const otherGenderPercent = totalCount ? Math.round((otherGenderCount / totalCount) * 100) : 0;

  // 2. Age Distribution
  const ageUnder20 = members.filter(m => m.age > 0 && m.age < 20).length;
  const age20to35 = members.filter(m => m.age >= 20 && m.age <= 35).length;
  const age36to50 = members.filter(m => m.age >= 36 && m.age <= 50).length;
  const age51to65 = members.filter(m => m.age >= 51 && m.age <= 65).length;
  const ageOver65 = members.filter(m => m.age > 65).length;

  const ageGroups = [
    { label: 'ต่ำกว่า 20 ปี', count: ageUnder20, desc: 'เยาวชนและนักเรียน/นักศึกษา' },
    { label: '20 - 35 ปี', count: age20to35, desc: 'คนรุ่นใหม่และวัยเริ่มต้นทำงาน' },
    { label: '36 - 50 ปี', count: age36to50, desc: 'วัยทำงานหลักและหัวหน้าครอบครัว' },
    { label: '51 - 65 ปี', count: age51to65, desc: 'ผู้นำชุมชนและปราชญ์ท้องถิ่น' },
    { label: 'มากกว่า 65 ปี', count: ageOver65, desc: 'ผู้สูงอายุและผู้อาวุโสชนเผ่า' },
  ];

  // 3. Province Distribution & Top Province
  const provinceCounts: Record<string, number> = {};
  members.forEach(m => {
    const prov = m.province?.trim() || 'ไม่ระบุ';
    provinceCounts[prov] = (provinceCounts[prov] || 0) + 1;
  });
  const sortedProvinces = Object.entries(provinceCounts)
    .sort((a, b) => b[1] - a[1]);
  const topProvince = sortedProvinces[0] || ['เชียงราย', 0];

  // 4. Village / Community Distribution
  const villageCounts: Record<string, number> = {};
  members.forEach(m => {
    if (m.village?.trim()) {
      villageCounts[m.village.trim()] = (villageCounts[m.village.trim()] || 0) + 1;
    }
  });
  const sortedVillages = Object.entries(villageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 5. Education Distribution
  const educationCounts: Record<string, number> = {};
  members.forEach(m => {
    const edu = m.education?.trim() || 'ไม่ระบุ';
    educationCounts[edu] = (educationCounts[edu] || 0) + 1;
  });
  const sortedEducation = Object.entries(educationCounts)
    .sort((a, b) => b[1] - a[1]);

  // 6. Occupations
  const occupationCounts: Record<string, number> = {};
  members.forEach(m => {
    if (m.occupation?.trim() && m.occupation !== 'ไม่ได้ระบุ') {
      occupationCounts[m.occupation.trim()] = (occupationCounts[m.occupation.trim()] || 0) + 1;
    }
  });
  const sortedOccupations = Object.entries(occupationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // 7. Notable Cultural Skills & Crafts
  const skillKeywords = [
    { label: 'การทำกาแฟพิเศษและชิมกาแฟ (Q Grader)', tag: 'กาแฟ' },
    { label: 'การเกษตรยั่งยืน/ปลูกชาและผลไม้เมืองหนาว', tag: 'เกษตร' },
    { label: 'การปักผ้าและตัดเย็บชุดชนเผ่าอ่าข่า', tag: 'ปักผ้า' },
    { label: 'งานเครื่องเงินและหัตถกรรมพื้นบ้าน', tag: 'เครื่องเงิน' },
    { label: 'ดนตรีและการขับลำนำชนเผ่าอ่าข่า', tag: 'ดนตรี' },
    { label: 'พิธีกรรม จารีตประเพณี และการโล้ชิงช้า', tag: 'พิธีกรรม' },
    { label: 'ล่ามภาษาและงานวิจัยวัฒนธรรม', tag: 'ภาษา' },
  ];
  const skillMentions: { label: string; count: number }[] = skillKeywords.map(k => {
    const count = members.filter(m => 
      m.skills && (m.skills.includes(k.tag) || m.skills.toLowerCase().includes(k.tag.toLowerCase()))
    ).length;
    return { label: k.label, count };
  }).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  // Recent 5 members
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime())
    .slice(0, 5);

  const handleSearchMemberStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const cleanDigits = q.replace(/[^0-9]/g, '');

    const found = members.find(m => {
      const matchId = m.id.toLowerCase() === q;
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchIdCard = cleanDigits.length >= 4 && m.idCard.replace(/[^0-9]/g, '') === cleanDigits;
      return matchId || matchName || matchIdCard;
    });

    setSearchResult(found || 'not_found');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Cultural Gradient & Motif */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 border border-emerald-900/50 p-6 sm:p-10 shadow-xl">
        {/* Akha Traditional Motif Background Elements */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                {isAdmin
                  ? 'ระบบบริหารจัดการฐานข้อมูล • โหมดผู้ดูแลระบบ (Admin)'
                  : 'ระบบฐานข้อมูลสมาชิกทางการ • สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              สืบสานภูมิปัญญา เชื่อมโยงสายสัมพันธ์ <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-300 to-amber-200 bg-clip-text text-transparent">
                ก้าวสู่อนาคตการศึกษาที่ยั่งยืน
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              {isAdmin
                ? 'ยินดีต้อนรับคุณ adminak (นายทะเบียน/ผู้ดูแลระบบ) คุณสามารถตรวจสอบ อนุมัติ แก้ไข จัดการข้อมูลสมาชิกทั้งหมด และซิงค์สเปรดชีต Google Sheets ได้อย่างสมบูรณ์'
                : 'ยินดีต้อนรับสู่ระบบสมาชิกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) ร่วมเป็นส่วนหนึ่งของเครือข่าย สมัครสมาชิกออนไลน์ได้สะดวกรวดเร็ว พร้อมรับบัตรประจำตัวสมาชิกดิจิทัลทันที'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-teal-800 text-white font-medium text-sm shadow-lg shadow-emerald-950/30 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4 text-emerald-300" />
                <span>{isAdmin ? 'รับสมัครสมาชิกใหม่' : 'สมัครสมาชิกสมาคมฯ'}</span>
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 hover:text-white font-medium text-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>แผนที่ประเทศไทย</span>
              </button>

              {isAdmin ? (
                <>
                  <button
                    onClick={() => onNavigate('manage')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <span>จัดการรายชื่อสมาชิก</span>
                  </button>

                  {sheetConfig.spreadsheetUrl ? (
                    <a
                      href={sheetConfig.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-all"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>เปิดดูใน Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ) : hasToken ? (
                    <button
                      onClick={onManualSync}
                      disabled={isSyncing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-sm font-medium transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>สร้างตารางใน Google Sheets</span>
                    </button>
                  ) : (
                    <button
                      onClick={onLogin}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-sm font-medium shadow-sm transition-all"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>เชื่อมต่อ Google Sheets</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <a
                    href="#status-checker"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-all"
                  >
                    <Search className="w-4 h-4 text-emerald-400" />
                    <span>ตรวจสอบสถานะสมาชิก</span>
                  </a>

                  {onOpenAdminLogin && (
                    <button
                      onClick={onOpenAdminLogin}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-all"
                    >
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>เข้าสู่ระบบแอดมิน</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Official Association Logo Spotlight in Hero */}
          <div className="flex flex-col items-center justify-center lg:items-end flex-shrink-0">
            <div className="bg-white p-2.5 rounded-2xl border-2 border-emerald-400/80 shadow-2xl hover:scale-105 transition-transform duration-300 w-56 sm:w-64">
              <AssociationLogo variant="full" theme="green" />
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-2 font-mono tracking-wider">
              OFFICIAL EMBLEM • AFECT
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {isAdmin ? (
        /* ADMIN KPI GRID */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Members */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">สมาชิกทั้งหมด</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{totalCount.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>อนุมัติแล้ว {approvedCount} ท่าน</span>
            </div>
          </div>

          {/* Lifetime Members */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">สมาชิกถาวร</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-700 mb-1">{lifetimeCount.toLocaleString()}</div>
            <div className="text-xs text-slate-500">
              คิดเป็น {totalCount ? Math.round((lifetimeCount / totalCount) * 100) : 0}% ของทั้งหมด
            </div>
          </div>

          {/* Annual Members */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">สมาชิกรายปี</span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-rose-700 mb-1">{annualCount.toLocaleString()}</div>
            <div className="text-xs text-slate-500">
              คิดเป็น {totalCount ? Math.round((annualCount / totalCount) * 100) : 0}% ของทั้งหมด
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">รอการอนุมัติ</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-yellow-600 mb-1">{pendingCount.toLocaleString()}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>ครอบคลุม {uniqueVillages} หมู่บ้าน ({uniqueProvinces} จังหวัด)</span>
            </div>
          </div>
        </div>
      ) : (
        /* PUBLIC COMMUNITY STATS (เท่าที่จำเป็นเท่านั้น เพื่อความเป็นส่วนตัว) */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ครอบครัวสมาชิก</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount} ท่าน</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">เครือข่ายพี่น้องชาวอ่าข่า</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ชุมชนและหมู่บ้าน</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-800">{uniqueVillages} ชุมชน</div>
            <p className="text-[11px] text-slate-500 mt-1">จาก {uniqueProvinces} จังหวัดในภาคเหนือ</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">การสืบสานวัฒนธรรม</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">ประเพณีโล้ชิงช้า</div>
            <p className="text-[11px] text-slate-500 mt-1">หัตถกรรม ภาษา และจารีต</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">บัตรสมาชิกดิจิทัล</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700">พร้อมใช้งาน</div>
            <p className="text-[11px] text-slate-500 mt-1">สมัครออนไลน์ รับบัตรทันที</p>
          </div>
        </div>
      )}

      {/* Comprehensive Member Demographics & Community Analytics Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-xs">
              <PieChart className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>สถิติและภาพรวมโครงสร้างสมาชิกสมาคม</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  {totalCount} ท่าน
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                สัดส่วนเพศ การกระจายตามกลุ่มอายุ พื้นที่/ชุมชน จังหวัดเด่น กลุ่มอาชีพ ความถนัด และระดับการศึกษา
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>ดูรายงานฉบับเต็ม</span>
            </button>
          </div>
        </div>

        {/* 1. Top Highlight Cards: Top Province, Gender Ratio, Average Age, Top Career */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Top Province */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-medium mb-1">
              <span>จังหวัดที่มีสมาชิกมากที่สุด</span>
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              {topProvince[0]}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              จำนวน {topProvince[1]} ท่าน ({totalCount ? Math.round((topProvince[1] / totalCount) * 100) : 0}%)
            </p>
          </div>

          {/* Gender Ratio Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-200/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-indigo-700 font-medium mb-1">
              <span>สัดส่วนเพศ ชาย : หญิง</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {maleCount} <span className="text-sm font-normal text-slate-400">:</span> {femaleCount}
            </div>
            <p className="text-[11px] text-indigo-700 font-medium mt-1">
              ชาย {malePercent}% • หญิง {femalePercent}% {otherGenderCount > 0 ? `• อื่นๆ ${otherGenderPercent}%` : ''}
            </p>
          </div>

          {/* Top Career Sector */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-yellow-50/40 border border-amber-200/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-800 font-medium mb-1">
              <span>กลุ่มอาชีพที่มีสมาชิกมากที่สุด</span>
              <Briefcase className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              {sortedOccupations[0] ? sortedOccupations[0][0] : 'เกษตรกร / ทำสวนกาแฟ'}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              {sortedOccupations[0] ? `${sortedOccupations[0][1]} ท่าน (${totalCount ? Math.round((sortedOccupations[0][1] / totalCount) * 100) : 0}%)` : 'เสาหลักเศรษฐกิจชุมชน'}
            </p>
          </div>

          {/* Cultural Heritage Highlights */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 to-orange-50/40 border border-rose-200/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-rose-700 font-medium mb-1">
              <span>เครือข่ายชุมชนชาติพันธุ์</span>
              <Compass className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {uniqueVillages} <span className="text-sm font-medium text-slate-500">หมู่บ้าน</span>
            </div>
            <p className="text-[11px] text-rose-700 font-medium mt-1">
              ขยายครอบคลุม {uniqueProvinces} จังหวัดภาคเหนือ
            </p>
          </div>
        </div>

        {/* 2. Grid Section: Gender + Age Groups + Geography */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Card A: สัดส่วนเพศ (Gender Proportion) */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>สัดส่วนเพศของสมาชิก</span>
              </h3>
              <span className="text-xs text-slate-500">{totalCount} ท่าน</span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="w-full h-3.5 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
              <div 
                style={{ width: `${malePercent}%` }} 
                className="bg-sky-600 transition-all duration-500" 
                title={`ชาย: ${maleCount} คน (${malePercent}%)`}
              />
              <div 
                style={{ width: `${femalePercent}%` }} 
                className="bg-rose-500 transition-all duration-500" 
                title={`หญิง: ${femaleCount} คน (${femalePercent}%)`}
              />
              {otherGenderPercent > 0 && (
                <div 
                  style={{ width: `${otherGenderPercent}%` }} 
                  className="bg-amber-400 transition-all duration-500" 
                  title={`อื่นๆ: ${otherGenderCount} คน (${otherGenderPercent}%)`}
                />
              )}
            </div>

            {/* List breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-600"></span>
                  <span className="font-semibold text-slate-800">ชาย</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{maleCount} ท่าน</span>
                  <span className="text-slate-500 font-mono w-10 text-right">{malePercent}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-slate-800">หญิง</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{femaleCount} ท่าน</span>
                  <span className="text-slate-500 font-mono w-10 text-right">{femalePercent}%</span>
                </div>
              </div>

              {otherGenderCount > 0 && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="font-semibold text-slate-800">อื่นๆ / ไม่ระบุ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{otherGenderCount} ท่าน</span>
                    <span className="text-slate-500 font-mono w-10 text-right">{otherGenderPercent}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card B: การกระจายตามกลุ่มอายุ (Age Distribution) */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>การกระจายตามกลุ่มอายุ</span>
              </h3>
              <span className="text-xs text-slate-500">ช่วงวัย</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {ageGroups.map((group, idx) => {
                const pct = totalCount ? Math.round((group.count / totalCount) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{group.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px] hidden sm:inline">{group.desc}</span>
                        <span className="font-bold text-slate-900">{group.count} ท่าน</span>
                        <span className="text-slate-400 font-mono w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        style={{ width: `${pct}%` }} 
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 ? 'bg-teal-500' :
                          idx === 1 ? 'bg-emerald-600' :
                          idx === 2 ? 'bg-indigo-600' :
                          idx === 3 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card C: การกระจายตามพื้นที่และชุมชน (Geographic Distribution) */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>การกระจายตามพื้นที่และชุมชน</span>
              </h3>
              <span className="text-xs text-slate-500">{uniqueProvinces} จังหวัด</span>
            </div>

            {/* Top Provinces Bar List */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                จังหวัดที่มีสมาชิกมากที่สุด
              </div>
              {sortedProvinces.slice(0, 4).map(([province, count], idx) => {
                const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800">{province}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{count} ท่าน</span>
                        <span className="text-slate-400 font-mono w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Community / Village Badges */}
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                ชุมชน / หมู่บ้านชั้นนำที่มีสมาชิกสังกัด:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sortedVillages.map(([village, count], idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs font-medium"
                  >
                    <span>{village}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Link to Thailand Map */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('map')}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                <span>เปิดดูแผนที่ประเทศไทยและการกระจายตัวของสมาชิก</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </div>
          </div>

        </div>

        {/* 3. Bottom Grid: กลุ่มอาชีพ & ความถนัดเด่น + ระดับการศึกษา */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Card D: กลุ่มอาชีพและความถนัดเด่นของสมาชิกในสมาคม */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                <span>กลุ่มอาชีพและความถนัดเด่นของสมาชิก</span>
              </h3>
              <span className="text-xs text-slate-500">บทบาทในชุมชน</span>
            </div>

            {/* Top Occupations */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                กลุ่มอาชีพหลักของสมาชิก
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {sortedOccupations.map(([occ, count], idx) => {
                  const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
                  return (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-800 block truncate">{occ}</span>
                        <span className="text-[10px] text-slate-400">สัดส่วน {pct}%</span>
                      </div>
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                        {count} ท่าน
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cultural & Practical Skills of Members */}
            <div className="pt-2 border-t border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ความถนัดเด่นและภูมิปัญญาวัฒนธรรมของสมาชิก</span>
              </div>
              {skillMentions.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {skillMentions.slice(0, 5).map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-700 font-medium">{skill.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
                        {skill.count} ท่าน
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  สมาชิกมีความถนัดหลากหลาย ทั้งการทำกาแฟ การเกษตรยั่งยืน ศิลปะหัตถกรรมชนเผ่า ดนตรี และประเพณีโล้ชิงช้า
                </p>
              )}
            </div>
          </div>

          {/* Card E: ระดับการศึกษาของสมาชิก (Education Level Distribution) */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>ระดับการศึกษาของสมาชิก</span>
              </h3>
              <span className="text-xs text-slate-500">วุฒิการศึกษา</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {sortedEducation.map(([edu, count], idx) => {
                const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span className="font-semibold text-slate-800">{edu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{count} ท่าน</span>
                        <span className="text-slate-400 font-mono w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        style={{ width: `${pct}%` }} 
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 ? 'bg-emerald-600' :
                          idx === 1 ? 'bg-teal-500' :
                          idx === 2 ? 'bg-indigo-500' :
                          idx === 3 ? 'bg-sky-500' : 'bg-slate-400'
                        }`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/50 text-xs text-emerald-900 leading-relaxed">
              <strong>พันธกิจด้านการศึกษา AFECT:</strong> สมาคมฯ มุ่งสนับสนุนทุนการศึกษาแก่เยาวชนชนเผ่าอ่าข่าทุกระดับชั้น 
              รวมถึงส่งเสริมการเรียนรู้ตลอดชีวิต การพัฒนาทักษะวิชาชีพ และการศึกษานอกระบบเพื่อยกระดับคุณภาพชีวิตอย่างยั่งยืน
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Admin Recent List OR Public Status Checker & Cultural highlights */}
        {isAdmin ? (
          /* ADMIN VIEW: Recent Applications List with approve action */
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>ผู้สมัครสมาชิกล่าสุด</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                      5 รายการล่าสุด
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ตรวจสอบและอนุมัติใบสมัครสมาชิกใหม่เพื่อออกบัตรสมาชิก
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('manage')}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                >
                  <span>ดูทั้งหมด</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Members List */}
              {recentMembers.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>ยังไม่มีข้อมูลผู้สมัครสมาชิกในระบบ</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-3 px-3 rounded-xl transition-colors cursor-pointer group"
                      onClick={() => onSelectMember(member)}
                    >
                      <div className="flex items-start gap-3">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.fullName}
                            className="w-11 h-14 object-cover rounded-xl border border-emerald-500/50 shadow-xs flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-14 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white font-semibold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                            {member.fullName.replace(/^(นาย|นาง|นางสาว|อาจารย์)\s*/, '').charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {member.fullName}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              member.memberType === 'ถาวร'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {member.memberType}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              member.status === 'อนุมัติแล้ว'
                                ? 'bg-emerald-100 text-emerald-800'
                                : member.status === 'รอการอนุมัติ'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {member.village || member.subdistrict || member.province}
                            </span>
                            <span>•</span>
                            <span>อายุ {member.age} ปี</span>
                            <span>•</span>
                            <span>{member.occupation || 'ไม่ได้ระบุ'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                        {member.status === 'รอการอนุมัติ' && (
                          <button
                            onClick={() => onApproveMember(member.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>อนุมัติ</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectMember(member)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        >
                          ดูบัตรสมาชิก
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>แสดง 5 คนจากทั้งหมด {totalCount} คน</span>
              <button
                onClick={() => onNavigate('manage')}
                className="text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                เปิดหน้าจัดการสมาชิกแบบละเอียด →
              </button>
            </div>
          </div>
        ) : (
          /* PUBLIC VIEW: Status Verification Widget & Community Heritage */
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Checker Widget */}
            <div id="status-checker" className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Search className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    ตรวจสอบสถานะการสมัครสมาชิกและบัตรดิจิทัล
                  </h3>
                  <p className="text-xs text-slate-500">
                    ค้นหาด้วยเลขประจำตัวประชาชน 13 หลัก, ชื่อ-สกุล หรือรหัสสมาชิก
                  </p>
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchMemberStatus} className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="เช่น 1579900xxxxxx หรือ สมศักดิ์ หรือ AKHA-2026-xxxx"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>ค้นหาสถานะ</span>
                </button>
              </form>

              {/* Search Result Display */}
              {searchResult && searchResult !== 'not_found' && (
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3.5">
                    {searchResult.photoUrl ? (
                      <img
                        src={searchResult.photoUrl}
                        alt={searchResult.fullName}
                        className="w-12 h-16 object-cover rounded-xl border-2 border-emerald-500 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                        {searchResult.fullName.replace(/^(นาย|นาง|นางสาว|อาจารย์)\s*/, '').charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{searchResult.fullName}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          searchResult.status === 'อนุมัติแล้ว'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {searchResult.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        รหัสสมาชิก: <strong className="font-mono text-emerald-800">{searchResult.id}</strong> (ประเภท{searchResult.memberType}) • สมัครเมื่อ {searchResult.registeredDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectMember(searchResult)}
                      className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-300" />
                      <span>เปิดดูบัตรสมาชิกดิจิทัล</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchResult(null);
                        setSearchQuery('');
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-600 hover:text-slate-900 text-xs"
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              )}

              {searchResult === 'not_found' && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>ไม่พบข้อมูลสมาชิกตามที่ระบุ กรุณาตรวจสอบข้อมูลหรือสมัครสมาชิกใหม่</span>
                  </div>
                  <button
                    onClick={() => onNavigate('register')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white font-medium text-xs hover:bg-emerald-800 transition-colors self-start sm:self-auto"
                  >
                    ไปที่หน้าสมัครสมาชิก →
                  </button>
                </div>
              )}
            </div>

            {/* Cultural & Education Spotlight */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-900/40 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-48">
                <AssociationLogo variant="seal" theme="white" />
              </div>
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>มรดกภูมิปัญญาและวิถีชนเผ่าอ่าข่า</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  ร่วมเป็นส่วนหนึ่งในการขับเคลื่อนการศึกษาและวัฒนธรรม
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) มุ่งมั่นพัฒนาศักยภาพเยาวชน มอบทุนการศึกษา ส่งเสริมกาแฟพิเศษและการเกษตรยั่งยืน พร้อมทั้งสืบสานประเพณีโล้ชิงช้า ภาษา จารีตประเพณี และศิลปะหัตถกรรมให้คงอยู่สืบไป
                </p>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-emerald-200" />
                  <span>สมัครสมาชิกเข้าร่วมสมาคมฯ วันนี้</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Right 1 Col: Culture & Association Pillars */}
        <div className="space-y-6">
          
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 border border-emerald-900/40 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none w-40">
              <AssociationLogo variant="seal" theme="white" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-base text-amber-300 flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>พันธกิจสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-600/30 text-rose-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <span>ส่งเสริมการศึกษาเยาวชนและสนับสนุนทุนการศึกษาแก่ลูกหลานชาวอ่าข่า</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <span>รวบรวม สืบทอด อนุรักษ์ภาษา จารีตประเพณี และศิลปะหัตถกรรมชนเผ่า</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <span>พัฒนาองค์ความรู้ การเกษตรยั่งยืน กาแฟพิเศษ และอาชีพสร้างสรรค์</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                  <span>สร้างเครือข่ายความร่วมมือเพื่อพิทักษ์สิทธิและคุณภาพชีวิตของชุมชน</span>
                </li>
              </ul>
            </div>
          </div>

          {/* For Public: Admin Portal Card */}
          {!isAdmin && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">สำหรับคณะกรรมการสมาคม</h4>
                  <p className="text-xs text-slate-500">นายทะเบียนและผู้ดูแลระบบ (Admin)</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                เจ้าหน้าที่สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า สามารถเข้าสู่ระบบเพื่อตรวจสอบรายชื่อผู้สมัคร อนุมัติสถานะ แก้ไขข้อมูล และพิมพ์บัตรสมาชิก
              </p>

              {onOpenAdminLogin && (
                <button
                  onClick={onOpenAdminLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-950 hover:from-slate-800 hover:to-emerald-900 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>เข้าสู่ระบบแอดมิน (adminak / afectAK)</span>
                </button>
              )}
            </div>
          )}

          {/* For Admin: Google Sheets Status Information Card */}
          {isAdmin && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">พื้นที่จัดเก็บ Google Sheets</h4>
                  <p className="text-xs text-slate-500">ฐานข้อมูลบนคลาวด์มาตรฐาน Google</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                ข้อมูลสมาชิกทุกคนจะถูกนำเข้าและจัดเก็บในสเปรดชีต Google Sheets สามารถดาวน์โหลดเป็น Excel, ดูผ่านมือถือ หรือแชร์ร่วมกับคณะกรรมการบริหารสมาคมได้โดยตรง
              </p>

              {sheetConfig.spreadsheetId ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="text-slate-500 mb-1">สถานะสเปรดชีต:</div>
                    <div className="font-semibold text-slate-800 truncate">{sheetConfig.spreadsheetName}</div>
                    {sheetConfig.lastSyncedAt && (
                      <div className="text-[11px] text-slate-400 mt-1">
                        ซิงค์ล่าสุด: {new Date(sheetConfig.lastSyncedAt).toLocaleString('th-TH')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {sheetConfig.spreadsheetUrl && (
                      <a
                        href={sheetConfig.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>เปิด Sheet</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={onManualSync}
                      disabled={isSyncing}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>ซิงค์</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    ⚠️ ยังไม่ได้เชื่อมต่อ Google Sheets สมาชิกจะถูกบันทึกไว้ในอุปกรณ์นี้ชั่วคราว
                  </p>
                  <button
                    onClick={onLogin}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>เชื่อมต่อ Google Sheets ตอนนี้</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
