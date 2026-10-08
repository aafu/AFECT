import React, { useState, useMemo } from 'react';
import { Member, ActiveTab } from '../types/member';
import { 
  THAILAND_PROVINCES, 
  THAILAND_REGIONS, 
  ProvinceData, 
  ThailandRegion, 
  normalizeProvinceName 
} from '../data/thailandProvinces';
import { AssociationLogo } from './AssociationLogo';
import { 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Compass, 
  Building2, 
  Phone, 
  Award, 
  CheckCircle2, 
  Clock, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Sparkles,
  Map as MapIcon,
  Home,
  UserCheck,
  UserPlus,
  BarChart3,
  Globe,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Navigation
} from 'lucide-react';

interface ThailandMemberMapProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onEditMember?: (member: Member) => void;
  onNavigate: (tab: ActiveTab) => void;
  isAdmin: boolean;
}

export const ThailandMemberMap: React.FC<ThailandMemberMapProps> = ({
  members,
  onSelectMember,
  onEditMember,
  onNavigate,
  isAdmin
}) => {
  // State for user interactions - Default to showing all 77 provinces overview!
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('เชียงราย');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyWithMembers, setOnlyWithMembers] = useState<boolean>(false); // Show all provinces by default for full overview!
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');
  const [layoutMode, setLayoutMode] = useState<'overview' | 'split'>('overview'); // 'overview' = Full-width panoramic view, 'split' = Side-by-side
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAllLabels, setShowAllLabels] = useState<boolean>(false);

  // Group members by normalized province name
  const provinceMemberMap = useMemo(() => {
    const map = new Map<string, Member[]>();
    
    // Initialize with all standard province names
    THAILAND_PROVINCES.forEach(p => {
      map.set(p.nameTh, []);
    });

    // Populate with members
    members.forEach(member => {
      const norm = normalizeProvinceName(member.province);
      if (norm) {
        const existing = map.get(norm) || [];
        existing.push(member);
        map.set(norm, existing);
      }
    });

    return map;
  }, [members]);

  // Aggregate metrics
  const stats = useMemo(() => {
    const provincesWithMembers: { province: ProvinceData; members: Member[]; count: number }[] = [];
    const regionCounts: Record<string, number> = {};

    THAILAND_REGIONS.forEach(r => {
      regionCounts[r.id] = 0;
    });

    THAILAND_PROVINCES.forEach(p => {
      const mList = provinceMemberMap.get(p.nameTh) || [];
      if (mList.length > 0) {
        provincesWithMembers.push({
          province: p,
          members: mList,
          count: mList.length
        });
        regionCounts[p.region] = (regionCounts[p.region] || 0) + mList.length;
      }
    });

    // Sort provinces descending by member count
    provincesWithMembers.sort((a, b) => b.count - a.count);

    const topProvince = provincesWithMembers[0] || null;
    
    // Find top region
    let topRegionName = 'ภาคเหนือ';
    let topRegionCount = 0;
    Object.entries(regionCounts).forEach(([rName, count]) => {
      if (count > topRegionCount) {
        topRegionCount = count;
        topRegionName = rName;
      }
    });

    const totalMappedMembers = provincesWithMembers.reduce((acc, curr) => acc + curr.count, 0);

    return {
      activeProvincesCount: provincesWithMembers.length,
      totalProvincesCount: THAILAND_PROVINCES.length,
      topProvince,
      topRegionName,
      topRegionCount,
      totalMappedMembers,
      leaderboard: provincesWithMembers,
      regionCounts
    };
  }, [provinceMemberMap]);

  // Filter provinces according to filters & search
  const filteredProvinces = useMemo(() => {
    return THAILAND_PROVINCES.filter(p => {
      // Region filter
      if (selectedRegion !== 'all' && p.region !== selectedRegion) {
        return false;
      }

      const pMembers = provinceMemberMap.get(p.nameTh) || [];

      // Filter only provinces with members
      if (onlyWithMembers && pMembers.length === 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchNameTh = p.nameTh.toLowerCase().includes(q);
        const matchNameEn = p.nameEn.toLowerCase().includes(q);
        const matchRegion = p.region.toLowerCase().includes(q);
        const matchMember = pMembers.some(m => 
          m.fullName.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q) ||
          m.village.toLowerCase().includes(q)
        );
        return matchNameTh || matchNameEn || matchRegion || matchMember;
      }

      return true;
    });
  }, [selectedRegion, onlyWithMembers, searchQuery, provinceMemberMap]);

  // Selected province data
  const selectedProvinceMeta = useMemo(() => {
    return THAILAND_PROVINCES.find(p => p.nameTh === selectedProvinceName) || THAILAND_PROVINCES[0];
  }, [selectedProvinceName]);

  const selectedProvinceMembers = useMemo(() => {
    return provinceMemberMap.get(selectedProvinceName) || [];
  }, [selectedProvinceName, provinceMemberMap]);

  // Districts breakdown in selected province
  const districtBreakdown = useMemo(() => {
    const distMap: Record<string, number> = {};
    const villageList: string[] = [];
    selectedProvinceMembers.forEach(m => {
      if (m.district) {
        distMap[m.district] = (distMap[m.district] || 0) + 1;
      }
      if (m.village && !villageList.includes(m.village)) {
        villageList.push(m.village);
      }
    });
    return {
      districts: Object.entries(distMap).sort((a, b) => b[1] - a[1]),
      villages: villageList
    };
  }, [selectedProvinceMembers]);

  // Zoom & Overview controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);
  const handleShowCompleteOverview = () => {
    setSelectedRegion('all');
    setSearchQuery('');
    setOnlyWithMembers(false);
    setZoomLevel(1);
    setSelectedProvinceName('เชียงราย');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <AssociationLogo variant="seal" theme="white" className="w-80 h-80" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '16s' }} />
              <span>ระบบภูมิศาสตร์สมาชิกสมาคม (AFECT Member GIS)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              แผนที่ประเทศไทยและการกระจายตัวของสมาชิก
            </h1>
            
            <p className="text-emerald-100/85 text-xs sm:text-sm font-light leading-relaxed">
              สำรวจการกระจายตัวของสมาชิกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) รายจังหวัดทั่วประเทศไทย 
              แสดงชุมชน ที่ตั้ง แหล่งรวมภูมิปัญญา และเครือข่ายความร่วมมือในแต่ละภูมิภาค
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('register')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isAdmin ? 'เพิ่มสมาชิกใหม่' : 'สมัครสมาชิก'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('reports')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium transition-all"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>รายงานสถิติ</span>
              </button>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'cards' : 'map')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>{viewMode === 'map' ? 'มุมมองการ์ดภูมิภาค' : 'มุมมองแผนที่กราฟิก'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Geographic Metrics Bar (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: จังหวัดที่มีสมาชิก */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>จังหวัดที่มีสมาชิก</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.activeProvincesCount}
            </span>
            <span className="text-xs text-slate-500">
              จาก {stats.totalProvincesCount} จังหวัด
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (stats.activeProvincesCount / stats.totalProvincesCount) * 100 * 5)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: จังหวัดที่มีสมาชิกมากที่สุด */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>จังหวัดศูนย์กลาง</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-teal-900 truncate">
              {stats.topProvince ? stats.topProvince.province.nameTh : 'ไม่มีข้อมูล'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.topProvince ? (
              <span className="text-teal-700 font-semibold">{stats.topProvince.count} คน ({((stats.topProvince.count / members.length) * 100).toFixed(0)}% ของสมาชิกทั้งหมด)</span>
            ) : 'ยังไม่มีสมาชิก'}
          </p>
        </div>

        {/* Metric 3: ภูมิภาคหลัก */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>ภูมิภาคที่มีสมาชิกสูงสุด</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-900">
              {stats.topRegionName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            สมาชิกรวม <span className="font-semibold text-amber-700">{stats.topRegionCount} คน</span>
          </p>
        </div>

        {/* Metric 4: สมาชิกที่มีพิกัดจังหวัดชัดเจน */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>สมาชิกที่ระบุจังหวัด</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.totalMappedMembers}
            </span>
            <span className="text-xs text-slate-500">
              คน (100% สมบูรณ์)
            </span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>เชื่อมต่อกับระบบฐานข้อมูลเรียบร้อย</span>
          </p>
        </div>

      </div>

      {/* 3. Search and Region Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อจังหวัด, อำเภอ, ชุมชน หรือชื่อสมาชิก..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleShowCompleteOverview}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ภาพรวมทั้งประเทศ</span>
            </button>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={onlyWithMembers}
                onChange={(e) => setOnlyWithMembers(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
              <span className="font-medium">แสดงเฉพาะที่มีสมาชิก ({stats.activeProvincesCount})</span>
            </label>

            {!onlyWithMembers && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>แสดงครบทั้ง 77 จังหวัด</span>
              </span>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>แผนที่พิกัด</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>การ์ดรายจังหวัด</span>
              </button>
            </div>
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 flex items-center gap-1 pr-1 font-medium whitespace-nowrap">
            <Filter className="w-3 h-3" />
            <span>ภูมิภาค:</span>
          </span>

          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedRegion === 'all'
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกภูมิภาค ({THAILAND_PROVINCES.length} จังหวัด)
          </button>

          {THAILAND_REGIONS.map((reg) => {
            const countInRegion = stats.regionCounts[reg.id] || 0;
            const isSelected = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{reg.shortLabel}</span>
                {countInRegion > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {countInRegion} คน
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive 6 Regions Geographic Overview Dashboard */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              ภาพรวม 6 ภูมิภาคทั่วประเทศไทย (Thailand 6 Regions Geographic Overview)
            </h3>
          </div>
          <button
            onClick={handleShowCompleteOverview}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <span>รีเซ็ตเป็นภาพรวมทั้งหมด</span>
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {THAILAND_REGIONS.map((region) => {
            const regProvinces = THAILAND_PROVINCES.filter(p => p.region === region.id);
            const regMembersCount = stats.regionCounts[region.id] || 0;
            const regProvincesWithMembers = regProvinces.filter(p => (provinceMemberMap.get(p.nameTh) || []).length > 0).length;
            const isSelected = selectedRegion === region.id;
            const percentage = members.length > 0 ? ((regMembersCount / members.length) * 100).toFixed(0) : '0';

            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(isSelected ? 'all' : region.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' 
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-800'}`}>
                    {region.shortLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {regProvinces.length} จว.
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900">
                    {regMembersCount}
                  </span>
                  <span className="text-xs text-slate-500">คน</span>
                  {regMembersCount > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold ml-auto">
                      ({percentage}%)
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                  <span>มีสมาชิก {regProvincesWithMembers}/{regProvinces.length}</span>
                  {isSelected && <span className="text-emerald-700 font-bold">เลือก</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Main Geographic Explorer Layout */}
      <div className={`grid grid-cols-1 ${layoutMode === 'split' ? 'lg:grid-cols-12' : 'lg:grid-cols-12'} gap-8 items-start`}>
        
        {/* Interactive Thailand SVG Map or Card Grid */}
        <div className={`${layoutMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          
          {viewMode === 'map' ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-4 sm:p-6 text-white relative overflow-hidden">
              
              {/* Map Header & Multi-action Controls */}
              <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-800/80 mb-3 gap-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                      <span>แผนที่แสดงพิกัดประเทศไทย (Interactive Thailand Map)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      แสดงภาพรวมทั้ง 77 จังหวัดทั่วประเทศ พร้อมพิกัดเครือข่ายสมาชิกสมาคม
                    </p>
                  </div>
                </div>

                {/* Map Control Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Button: ภาพรวมทั้งประเทศ */}
                  <button
                    onClick={handleShowCompleteOverview}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                    title="แสดงภาพรวมแผนที่ทั้งหมด ทุก 77 จังหวัด"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>ภาพรวมทั้งประเทศ</span>
                  </button>

                  {/* Toggle: แสดงชื่อทุกจังหวัด */}
                  <button
                    onClick={() => setShowAllLabels(!showAllLabels)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      showAllLabels 
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300' 
                        : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                    title={showAllLabels ? 'ซ่อนชื่อจังหวัดที่ยังไม่มีสมาชิก' : 'แสดงชื่อครบทุก 77 จังหวัด'}
                  >
                    {showAllLabels ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{showAllLabels ? 'ชื่อทุกจังหวัด' : 'เฉพาะที่มีสมาชิก'}</span>
                  </button>

                  {/* Toggle: รูปแบบการแสดงผล (ภาพรวมเต็มความกว้าง / แบ่งหน้าจอ) */}
                  <button
                    onClick={() => setLayoutMode(layoutMode === 'overview' ? 'split' : 'overview')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all"
                    title={layoutMode === 'overview' ? 'เปลี่ยนเป็นมุมมองแบ่งหน้าจอด้านข้าง' : 'เปลี่ยนเป็นมุมมองภาพรวมเต็มความกว้าง'}
                  >
                    {layoutMode === 'overview' ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">แบ่งหน้าจอคู่</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">ภาพรวมเต็มจอ</span>
                      </>
                    )}
                  </button>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-0.5 bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/60">
                    <button
                      onClick={handleZoomIn}
                      title="ซูมเข้า"
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      title="ซูมออก"
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      title="รีเซ็ตระดับการซูม"
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

              {/* Thailand Interactive SVG Container - Optimized to fit all of Thailand */}
              <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[800px] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center select-none border border-slate-800/70">
                
                {/* Background Grid & Compass Accents */}
                <svg
                  viewBox="0 0 700 1080"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                >
                  <defs>
                    {/* Grid Pattern */}
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.25" />
                    </pattern>

                    {/* Gradient for Pulsing Nodes */}
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="activeNodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Grid background */}
                  <rect width="700" height="1080" fill="url(#grid)" />

                  {/* Water Body Labels */}
                  <g opacity="0.35" pointerEvents="none">
                    <text x="430" y="690" fill="#64748b" fontSize="15" fontWeight="bold" letterSpacing="4" textAnchor="middle">
                      อ่าวไทย (GULF OF THAILAND)
                    </text>
                    <text x="90" y="820" fill="#64748b" fontSize="13" fontWeight="bold" letterSpacing="3" transform="rotate(-30 90 820)" textAnchor="middle">
                      ทะเลอันดามัน (ANDAMAN SEA)
                    </text>
                    <text x="560" y="210" fill="#475569" fontSize="12" letterSpacing="2" textAnchor="middle">
                      แม่น้ำโขง (MEKONG)
                    </text>
                  </g>

                  {/* Thailand Realistic Regional Geographical Silhouettes */}
                  <g className="thailand-silhouette" opacity="0.45">
                    {/* ภาคเหนือ (North) */}
                    <path
                      d="M 210 40 Q 235 45 260 65 Q 295 90 320 120 Q 325 155 305 185 Q 285 220 260 235 Q 235 240 205 225 Q 170 215 140 195 Q 95 170 70 125 Q 65 95 100 80 Q 145 65 185 50 Z"
                      fill="#064e3b"
                      stroke="#059669"
                      strokeWidth="1.8"
                    />

                    {/* ภาคอีสาน (Northeast / Khorat Plateau) */}
                    <path
                      d="M 350 220 Q 400 195 450 190 Q 515 160 550 185 Q 615 210 625 255 Q 610 320 620 360 Q 625 410 595 430 Q 540 435 480 435 Q 430 435 385 430 Q 370 390 375 330 Q 365 270 350 220 Z"
                      fill="#292524"
                      stroke="#d97706"
                      strokeWidth="1.5"
                    />

                    {/* ภาคกลาง (Central Plain) */}
                    <path
                      d="M 215 255 Q 260 250 310 270 Q 345 295 345 350 Q 340 410 335 455 Q 315 485 300 520 Q 275 528 250 528 Q 230 515 225 470 Q 220 420 220 370 Q 210 315 215 255 Z"
                      fill="#1e293b"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />

                    {/* ภาคตะวันตก (West) */}
                    <path
                      d="M 170 230 Q 200 245 210 300 Q 215 365 215 440 Q 225 490 225 530 Q 220 560 225 610 Q 220 670 195 675 Q 185 640 195 580 Q 180 520 160 460 Q 150 400 150 330 Q 155 270 170 230 Z"
                      fill="#134e4a"
                      stroke="#0d9488"
                      strokeWidth="1.5"
                    />

                    {/* ภาคตะวันออก (East) */}
                    <path
                      d="M 330 460 Q 375 460 415 475 Q 425 515 435 565 Q 445 615 410 615 Q 380 585 345 580 Q 315 570 310 535 Q 315 495 330 460 Z"
                      fill="#1e1b4b"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                    />

                    {/* ภาคใต้ (South) */}
                    <path
                      d="M 195 675 Q 215 690 215 745 Q 220 790 240 835 Q 260 880 295 920 Q 330 950 370 980 Q 395 1010 365 1025 Q 330 1030 315 1005 Q 275 995 240 995 Q 215 970 185 930 Q 165 890 140 870 Q 115 840 130 790 Q 145 740 165 710 Q 185 680 195 675 Z"
                      fill="#083344"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />

                    {/* Islands */}
                    {/* เกาะภูเก็ต */}
                    <ellipse cx="116" cy="909" rx="8" ry="16" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                    {/* เกาะสมุย & เกาะพะงัน */}
                    <ellipse cx="225" cy="810" rx="11" ry="9" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                    <ellipse cx="230" cy="780" rx="8" ry="7" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                    {/* เกาะช้าง */}
                    <ellipse cx="426" cy="620" rx="11" ry="13" fill="#6366f1" stroke="#4f46e5" strokeWidth="1" />
                  </g>

                  {/* Regional Geographic Labels inside silhouette */}
                  <g opacity="0.3" pointerEvents="none" textAnchor="middle">
                    <text x="200" y="125" fill="#34d399" fontSize="14" fontWeight="bold">ภาคเหนือ</text>
                    <text x="490" y="275" fill="#fbbf24" fontSize="14" fontWeight="bold">ภาคตะวันออกเฉียงเหนือ</text>
                    <text x="275" y="375" fill="#38bdf8" fontSize="13" fontWeight="bold">ภาคกลาง</text>
                    <text x="165" y="365" fill="#2dd4bf" fontSize="12" fontWeight="bold">ภาคตะวันตก</text>
                    <text x="375" y="540" fill="#a5b4fc" fontSize="12" fontWeight="bold">ภาคตะวันออก</text>
                    <text x="245" y="780" fill="#22d3ee" fontSize="14" fontWeight="bold">ภาคใต้</text>
                  </g>

                  {/* Decorative Compass Rose in Gulf of Thailand */}
                  <g transform="translate(500, 750)" opacity="0.35">
                    <circle r="46" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2,3" />
                    <line x1="0" y1="-52" x2="0" y2="52" stroke="#64748b" strokeWidth="1" />
                    <line x1="-52" y1="0" x2="52" y2="0" stroke="#64748b" strokeWidth="1" />
                    <polygon points="0,-50 6,-16 0,-26 -6,-16" fill="#10b981" />
                    <text x="0" y="-57" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">N</text>
                    <text x="0" y="67" fill="#64748b" fontSize="10" textAnchor="middle">AFECT GIS Network</text>
                  </g>

                  {/* Connection lines from Chiang Rai (Association HQ) to other active provinces */}
                  {THAILAND_PROVINCES.filter(p => {
                    const mList = provinceMemberMap.get(p.nameTh) || [];
                    return mList.length > 0 && p.nameTh !== 'เชียงราย';
                  }).map(p => (
                    <line
                      key={`line-${p.id}`}
                      x1="224"
                      y1="66"
                      x2={p.x}
                      y2={p.y}
                      stroke="#10b981"
                      strokeWidth="1.4"
                      strokeDasharray="3,4"
                      strokeOpacity="0.5"
                    />
                  ))}

                  {/* Headquarters Hub Pin (เชียงราย) Accent */}
                  <circle cx="224" cy="66" r="32" fill="url(#activeNodeGlow)" />
                  <circle cx="224" cy="66" r="18" fill="#047857" stroke="#34d399" strokeWidth="2.5" />

                  {/* Render All Filtered Province Nodes */}
                  {filteredProvinces.map(province => {
                    const mList = provinceMemberMap.get(province.nameTh) || [];
                    const hasMembers = mList.length > 0;
                    const isSelected = selectedProvinceName === province.nameTh;
                    const isHovered = hoveredProvince?.nameTh === province.nameTh;

                    // Compute node radius based on member count
                    const radius = hasMembers ? Math.min(10 + mList.length * 2, 22) : 4.5;

                    return (
                      <g
                        key={province.id}
                        transform={`translate(${province.x}, ${province.y})`}
                        className="cursor-pointer transition-transform duration-200"
                        onClick={() => setSelectedProvinceName(province.nameTh)}
                        onMouseEnter={() => setHoveredProvince(province)}
                        onMouseLeave={() => setHoveredProvince(null)}
                      >
                        {/* Glow effect for active provinces */}
                        {hasMembers && (
                          <circle
                            r={radius * 1.8}
                            fill={isSelected ? 'url(#activeNodeGlow)' : 'url(#nodeGlow)'}
                            className="animate-pulse"
                            style={{ animationDuration: '3s' }}
                          />
                        )}

                        {/* Outer Selection Highlight Ring */}
                        {(isSelected || isHovered) && (
                          <circle
                            r={radius + 4}
                            fill="none"
                            stroke={isSelected ? '#34d399' : '#6ee7b7'}
                            strokeWidth="2"
                            strokeDasharray={isSelected ? 'none' : '2,2'}
                          />
                        )}

                        {/* Main Node Circle */}
                        <circle
                          r={radius}
                          fill={
                            hasMembers 
                              ? isSelected 
                                ? '#10b981' 
                                : '#059669' 
                              : isHovered
                              ? '#64748b'
                              : '#334155'
                          }
                          stroke={hasMembers ? '#a7f3d0' : isHovered ? '#94a3b8' : '#475569'}
                          strokeWidth={hasMembers ? 1.5 : 1}
                        />

                        {/* Member Count Number Inside Circle if has members */}
                        {hasMembers ? (
                          <text
                            y="4"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={mList.length >= 10 ? '10' : '11'}
                            fontWeight="bold"
                            pointerEvents="none"
                          >
                            {mList.length}
                          </text>
                        ) : null}

                        {/* Province Name Label */}
                        {(hasMembers || isSelected || isHovered || showAllLabels || zoomLevel > 1.2) && (
                          <g transform={`translate(${radius + 4}, 4)`}>
                            <rect
                              x="-2"
                              y="-11"
                              width={province.nameTh.length * 11 + 8}
                              height="15"
                              rx="3"
                              fill="#0f172a"
                              fillOpacity="0.85"
                            />
                            <text
                              x="2"
                              y="0"
                              fill={hasMembers ? '#6ee7b7' : isSelected ? '#34d399' : '#cbd5e1'}
                              fontSize="10"
                              fontWeight={hasMembers || isSelected ? 'bold' : 'normal'}
                            >
                              {province.nameTh}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Selected Province Pill on Top-Left of Map */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-400">เลือกดู:</span>
                  <strong className="text-white">จ.{selectedProvinceMeta.nameTh}</strong>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                    {selectedProvinceMembers.length} คน
                  </span>
                </div>

                {/* Floating Map Hover Info Tooltip */}
                {hoveredProvince && (
                  <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/60 text-white shadow-xl pointer-events-none animate-in fade-in duration-150 max-w-xs">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{hoveredProvince.nameTh} ({hoveredProvince.nameEn})</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {hoveredProvince.region} • สมาชิกในสมาคม:{' '}
                      <strong className="text-white font-bold">
                        {(provinceMemberMap.get(hoveredProvince.nameTh) || []).length} คน
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      คลิกที่หมุดจังหวัดเพื่อดูรายชื่อและรายละเอียด
                    </div>
                  </div>
                )}
              </div>

              {/* Map Legend Bar */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
                    <span>มีสมาชิกในสมาคม (1+ คน)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span>ยังไม่มีสมาชิก (ครบ 77 จว.)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-400 border-t border-dashed border-emerald-300" />
                    <span>เส้นเชื่อมโยงศูนย์กลางเชียงราย</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  คลิกที่จุดจังหวัดเพื่อดูข้อมูลสมาชิกแบบละเอียด
                </div>
              </div>

            </div>
          ) : (
            /* Cards View for Provinces */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProvinces.map(province => {
                const pMembers = provinceMemberMap.get(province.nameTh) || [];
                const isSelected = selectedProvinceName === province.nameTh;
                const hasMembers = pMembers.length > 0;

                return (
                  <div
                    key={province.id}
                    onClick={() => setSelectedProvinceName(province.nameTh)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : hasMembers
                        ? 'bg-white border-emerald-200 hover:border-emerald-400 shadow-xs'
                        : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-base">
                            {province.nameTh}
                          </h4>
                          {province.nameTh === 'เชียงราย' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                              ศูนย์กลางสมาคม
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {province.nameEn} • {province.region}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold ${
                          hasMembers ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {pMembers.length} คน
                        </span>
                      </div>
                    </div>

                    {hasMembers ? (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        <div className="truncate">
                          <strong>ชุมชนเด่น:</strong> {pMembers.slice(0, 2).map(m => m.village || m.district).join(', ')}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>อนุมัติแล้ว: {pMembers.filter(m => m.status === 'อนุมัติแล้ว').length} คน</span>
                          <span className="text-emerald-700 font-medium">ดูรายชื่อ →</span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-slate-400 italic">ยังไม่มีสมาชิกลงทะเบียนในจังหวัดนี้</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* When in overview mode, we render the Leaderboard & Detail side-by-side underneath */}
          {layoutMode === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Leaderboard Table (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-bold text-slate-900 text-base">
                      อันดับจังหวัดที่มีสมาชิกมากที่สุด
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    รวม {stats.activeProvincesCount} จังหวัด
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {stats.leaderboard.map((item, index) => {
                    const isSelected = selectedProvinceName === item.province.nameTh;
                    const percentage = ((item.count / members.length) * 100).toFixed(1);

                    return (
                      <div
                        key={item.province.id}
                        onClick={() => setSelectedProvinceName(item.province.nameTh)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400' 
                            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          index === 0 
                            ? 'bg-amber-400 text-amber-950 shadow-xs' 
                            : index === 1 
                            ? 'bg-slate-300 text-slate-800' 
                            : index === 2 
                            ? 'bg-amber-700 text-white' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Province Name & Region */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900">
                            <span className="truncate">{item.province.nameTh} ({item.province.region})</span>
                            <span className="text-emerald-700 font-bold ml-2">{item.count} คน ({percentage}%)</span>
                          </div>
                          
                          {/* Bar indicator */}
                          <div className="mt-1.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (item.count / (stats.topProvince?.count || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Province Detail Roster & Info (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
                
                {/* Header */}
                <div className="pb-5 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {selectedProvinceMeta.region}
                    </span>
                    <span className="text-xs text-slate-400">
                      รหัสย่อ: {selectedProvinceMeta.code}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        จังหวัด{selectedProvinceMeta.nameTh}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedProvinceMeta.nameEn} Province
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700">
                        {selectedProvinceMembers.length}
                      </div>
                      <span className="text-[11px] text-slate-500 block">สมาชิกทั้งหมด</span>
                    </div>
                  </div>
                </div>

                {/* Demographics & Districts Breakdown in this Province */}
                {selectedProvinceMembers.length > 0 ? (
                  <div className="space-y-4">
                    
                    {/* Status & Gender Split Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[11px] block">สถานะสมาชิก</span>
                        <div className="mt-1 flex items-center gap-2 font-bold text-slate-800">
                          <span className="text-emerald-700">
                            อนุมัติ {selectedProvinceMembers.filter(m => m.status === 'อนุมัติแล้ว').length}
                          </span>
                          {selectedProvinceMembers.filter(m => m.status === 'รอการอนุมัติ').length > 0 && (
                            <span className="text-amber-700">
                              รออนุมัติ {selectedProvinceMembers.filter(m => m.status === 'รอการอนุมัติ').length}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[11px] block">สัดส่วนเพศ</span>
                        <div className="mt-1 flex items-center gap-2 font-bold text-slate-800">
                          <span>ชาย {selectedProvinceMembers.filter(m => m.gender === 'ชาย').length}</span>
                          <span>หญิง {selectedProvinceMembers.filter(m => m.gender === 'หญิง').length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Districts & Communities in this Province */}
                    {districtBreakdown.districts.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                        <div className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>อำเภอที่มีสมาชิก ({districtBreakdown.districts.length} อำเภอ):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {districtBreakdown.districts.map(([districtName, count]) => (
                            <span 
                              key={districtName} 
                              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-950 font-medium shadow-2xs"
                            >
                              อ.{districtName} ({count} คน)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Village / Communities tag list */}
                    {districtBreakdown.villages.length > 0 && (
                      <div className="text-xs space-y-1">
                        <span className="text-slate-500 font-medium">ชุมชน/หมู่บ้านที่สังกัด:</span>
                        <div className="flex flex-wrap gap-1">
                          {districtBreakdown.villages.map((v) => (
                            <span key={v} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Member Roster List */}
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>รายชื่อสมาชิกในจังหวัดนี้ ({selectedProvinceMembers.length} ท่าน)</span>
                        <span className="text-[11px] text-emerald-700 font-normal">คลิกเพื่อดูบัตรสมาชิก</span>
                      </div>

                      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {selectedProvinceMembers.map((member) => (
                          <div
                            key={member.id}
                            onClick={() => onSelectMember(member)}
                            className="p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer shadow-2xs group flex items-start gap-3"
                          >
                            {/* Member Avatar */}
                            {member.photoUrl ? (
                              <img
                                src={member.photoUrl}
                                alt={member.fullName}
                                className="w-12 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-12 h-16 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex flex-col items-center justify-center font-bold text-sm flex-shrink-0">
                                <span>{member.fullName.charAt(0)}</span>
                                <span className="text-[9px] font-normal text-emerald-700">อ่าข่า</span>
                              </div>
                            )}

                            {/* Member Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono text-[10px] text-emerald-700 font-bold">
                                  {member.id}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                                  member.status === 'อนุมัติแล้ว' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {member.status}
                                </span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-emerald-700 transition-colors">
                                {member.fullName}
                              </h4>

                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {member.position || member.occupation || 'สมาชิกสมาคม'}
                              </p>

                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                <span className="truncate">{member.village || `อ.${member.district}`}</span>
                                {member.phone && (
                                  <span className="flex items-center gap-0.5 text-slate-500">
                                    <Phone className="w-2.5 h-2.5" />
                                    {member.phone}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Open Card Icon */}
                            <div className="self-center flex-shrink-0 text-slate-300 group-hover:text-emerald-600 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  /* No Members in this Province yet */
                  <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">ยังไม่มีสมาชิกลงทะเบียนในจังหวัด{selectedProvinceMeta.nameTh}</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        สามารถเปิดรับสมัครสมาชิกและเชิญชวนพี่น้องชาวอ่าข่าในจังหวัดนี้เข้าร่วมเครือข่ายสมาคมได้
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('register')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>รับสมัครสมาชิกในจังหวัดนี้</span>
                    </button>
                  </div>
                )}

                {/* Quick Links Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AFECT Geographic Network</span>
                  </span>
                  <button
                    onClick={() => onNavigate('overview')}
                    className="text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    ดูภาพรวมสมาคม →
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* When in split mode, Leaderboard is displayed under the map */}
          {layoutMode === 'split' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-base">
                    อันดับจังหวัดที่มีสมาชิกมากที่สุด (Top Active Provinces)
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  รวม {stats.activeProvincesCount} จังหวัด
                </span>
              </div>

              <div className="space-y-3">
                {stats.leaderboard.map((item, index) => {
                  const isSelected = selectedProvinceName === item.province.nameTh;
                  const percentage = ((item.count / members.length) * 100).toFixed(1);

                  return (
                    <div
                      key={item.province.id}
                      onClick={() => setSelectedProvinceName(item.province.nameTh)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400' 
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        index === 0 
                          ? 'bg-amber-400 text-amber-950 shadow-xs' 
                          : index === 1 
                          ? 'bg-slate-300 text-slate-800' 
                          : index === 2 
                          ? 'bg-amber-700 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Province Name & Region */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900">
                          <span className="truncate">{item.province.nameTh} ({item.province.region})</span>
                          <span className="text-emerald-700 font-bold ml-2">{item.count} คน ({percentage}%)</span>
                        </div>
                        
                        {/* Bar indicator */}
                        <div className="mt-1.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (item.count / (stats.topProvince?.count || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column in Split Mode: Selected Province Detail Roster & Info (lg:col-span-5) */}
        {layoutMode === 'split' && (
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
              
              {/* Selected Province Header */}
              <div className="pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedProvinceMeta.region}
                  </span>
                  <span className="text-xs text-slate-400">
                    รหัสย่อ: {selectedProvinceMeta.code}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      จังหวัด{selectedProvinceMeta.nameTh}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedProvinceMeta.nameEn} Province
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-700">
                      {selectedProvinceMembers.length}
                    </div>
                    <span className="text-[11px] text-slate-500 block">สมาชิกทั้งหมด</span>
                  </div>
                </div>
              </div>

              {/* Demographics & Districts Breakdown in this Province */}
              {selectedProvinceMembers.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Status & Gender Split Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">สถานะสมาชิก</span>
                      <div className="mt-1 flex items-center gap-2 font-bold text-slate-800">
                        <span className="text-emerald-700">
                          อนุมัติ {selectedProvinceMembers.filter(m => m.status === 'อนุมัติแล้ว').length}
                        </span>
                        {selectedProvinceMembers.filter(m => m.status === 'รอการอนุมัติ').length > 0 && (
                          <span className="text-amber-700">
                            รออนุมัติ {selectedProvinceMembers.filter(m => m.status === 'รอการอนุมัติ').length}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">สัดส่วนเพศ</span>
                      <div className="mt-1 flex items-center gap-2 font-bold text-slate-800">
                        <span>ชาย {selectedProvinceMembers.filter(m => m.gender === 'ชาย').length}</span>
                        <span>หญิง {selectedProvinceMembers.filter(m => m.gender === 'หญิง').length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Districts & Communities in this Province */}
                  {districtBreakdown.districts.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                      <div className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>อำเภอที่มีสมาชิก ({districtBreakdown.districts.length} อำเภอ):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {districtBreakdown.districts.map(([districtName, count]) => (
                          <span 
                            key={districtName} 
                            className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-950 font-medium shadow-2xs"
                          >
                            อ.{districtName} ({count} คน)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Village / Communities tag list */}
                  {districtBreakdown.villages.length > 0 && (
                    <div className="text-xs space-y-1">
                      <span className="text-slate-500 font-medium">ชุมชน/หมู่บ้านที่สังกัด:</span>
                      <div className="flex flex-wrap gap-1">
                        {districtBreakdown.villages.map((v) => (
                          <span key={v} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Member Roster List */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>รายชื่อสมาชิกในจังหวัดนี้ ({selectedProvinceMembers.length} ท่าน)</span>
                      <span className="text-[11px] text-emerald-700 font-normal">คลิกเพื่อดูบัตรสมาชิก</span>
                    </div>

                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                      {selectedProvinceMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => onSelectMember(member)}
                          className="p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer shadow-2xs group flex items-start gap-3"
                        >
                          {/* Member Avatar */}
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-12 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-12 h-16 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex flex-col items-center justify-center font-bold text-sm flex-shrink-0">
                              <span>{member.fullName.charAt(0)}</span>
                              <span className="text-[9px] font-normal text-emerald-700">อ่าข่า</span>
                            </div>
                          )}

                          {/* Member Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-[10px] text-emerald-700 font-bold">
                                {member.id}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                                member.status === 'อนุมัติแล้ว' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {member.status}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-emerald-700 transition-colors">
                              {member.fullName}
                            </h4>

                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {member.position || member.occupation || 'สมาชิกสมาคม'}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <span className="truncate">{member.village || `อ.${member.district}`}</span>
                              {member.phone && (
                                <span className="flex items-center gap-0.5 text-slate-500">
                                  <Phone className="w-2.5 h-2.5" />
                                  {member.phone}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Open Card Icon */}
                          <div className="self-center flex-shrink-0 text-slate-300 group-hover:text-emerald-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* No Members in this Province yet */
                <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">ยังไม่มีสมาชิกลงทะเบียนในจังหวัด{selectedProvinceMeta.nameTh}</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      สามารถเปิดรับสมัครสมาชิกและเชิญชวนพี่น้องชาวอ่าข่าในจังหวัดนี้เข้าร่วมเครือข่ายสมาคมได้
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('register')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>รับสมัครสมาชิกในจังหวัดนี้</span>
                  </button>
                </div>
              )}

              {/* Quick Links Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AFECT Geographic Network</span>
                </span>
                <button
                  onClick={() => onNavigate('overview')}
                  className="text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  ดูภาพรวมสมาคม →
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
