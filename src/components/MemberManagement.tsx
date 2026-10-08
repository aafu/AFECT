import React, { useState, useMemo } from 'react';
import { Member, MemberStatus, MemberType } from '../types/member';
import { AssociationLogo } from './AssociationLogo';
import { 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download, 
  Plus, 
  Phone, 
  MapPin, 
  Mail, 
  UserCheck, 
  UserX,
  FileSpreadsheet,
  X,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

interface MemberManagementProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onUpdateStatus: (memberId: string, newStatus: MemberStatus) => Promise<void>;
  onDeleteMember: (member: Member) => Promise<void>;
  onNavigateRegister: () => void;
  isProcessing: boolean;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  onSelectMember,
  onEditMember,
  onUpdateStatus,
  onDeleteMember,
  onNavigateRegister,
  isProcessing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Destructive delete confirmation modal state
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Status change confirmation modal state
  const [statusChangeTarget, setStatusChangeTarget] = useState<{ member: Member; newStatus: MemberStatus } | null>(null);

  // List of distinct provinces for filtering
  const provinces = useMemo(() => {
    const list = Array.from(new Set(members.map(m => m.province).filter(Boolean)));
    return list.sort();
  }, [members]);

  // Filtered list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Search match
      const search = searchTerm.toLowerCase().trim();
      const matchSearch = !search || (
        m.fullName.toLowerCase().includes(search) ||
        m.id.toLowerCase().includes(search) ||
        m.idCard.includes(search) ||
        m.village.toLowerCase().includes(search) ||
        m.phone.includes(search) ||
        m.subdistrict.toLowerCase().includes(search) ||
        m.district.toLowerCase().includes(search) ||
        m.skills.toLowerCase().includes(search)
      );

      // Type match
      const matchType = filterType === 'all' || m.memberType === filterType;

      // Status match
      const matchStatus = filterStatus === 'all' || m.status === filterStatus;

      // Province match
      const matchProvince = filterProvince === 'all' || m.province === filterProvince;

      return matchSearch && matchType && matchStatus && matchProvince;
    });
  }, [members, searchTerm, filterType, filterStatus, filterProvince]);

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (filteredMembers.length === 0) return;

    const headers = [
      'รหัสสมาชิก',
      'วันที่สมัคร',
      'ประเภทสมาชิก',
      'สถานะ',
      'ชื่อ-สกุล',
      'เพศ',
      'วันเดือนปีเกิด',
      'อายุ',
      'เลขประจำตัวประชาชน',
      'ระดับการศึกษา',
      'อาชีพ',
      'ตำแหน่ง',
      'หมู่บ้าน',
      'บ้านเลขที่',
      'ซอย',
      'ถนน',
      'ตำบล',
      'อำเภอ',
      'จังหวัด',
      'รหัสไปรษณีย์',
      'เบอร์โทรศัพท์',
      'อีเมล',
      'Facebook',
      'Line ID',
      'ความถนัด/สนใจ',
      'หมายเหตุ'
    ];

    const rows = filteredMembers.map(m => [
      m.id,
      m.registeredDate,
      m.memberType,
      m.status,
      `"${m.fullName.replace(/"/g, '""')}"`,
      m.gender,
      m.birthDate,
      m.age,
      `'${m.idCard}`,
      `"${m.education}"`,
      `"${m.occupation}"`,
      `"${m.position}"`,
      `"${m.village}"`,
      `"${m.houseNo}"`,
      `"${m.soi}"`,
      `"${m.road}"`,
      `"${m.subdistrict}"`,
      `"${m.district}"`,
      `"${m.province}"`,
      `'${m.postalCode}`,
      `'${m.phone}`,
      `"${m.email}"`,
      `"${m.facebook}"`,
      `"${m.lineId}"`,
      `"${m.skills.replace(/"/g, '""')}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ทะเบียนสมาชิกอ่าข่า_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    await onDeleteMember(memberToDelete);
    setMemberToDelete(null);
  };

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    await onUpdateStatus(statusChangeTarget.member.id, statusChangeTarget.newStatus);
    setStatusChangeTarget(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <AssociationLogo 
            variant="badge" 
            theme="green"
            className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 drop-shadow-xs" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                หน้าจัดการสมาชิก
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {filteredMembers.length} ท่าน
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              ระบบทะเบียนสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) • ค้นหา อนุมัติสถานะ แก้ไข และพิมพ์บัตร
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={handleExportCSV}
            disabled={filteredMembers.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
            title="ส่งออกเป็นไฟล์ CSV สำหรับ Excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={onNavigateRegister}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>สมัครสมาชิกใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัสสมาชิก, เลขบัตร ปชช., หมู่บ้าน, เบอร์โทร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter: Membership Type */}
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="all">ประเภทสมาชิก: ทั้งหมด</option>
              <option value="ถาวร">สมาชิกถาวร</option>
              <option value="รายปี">สมาชิกรายปี</option>
            </select>

            {/* Filter: Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="all">สถานะ: ทั้งหมด</option>
              <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
              <option value="รอการอนุมัติ">รอการอนุมัติ</option>
              <option value="หมดอายุ">หมดอายุ</option>
            </select>

            {/* Filter: Province */}
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 hidden sm:block"
            >
              <option value="all">จังหวัด: ทั้งหมด</option>
              {provinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="มุมมองตาราง"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main List Rendering */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center">
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">ไม่พบข้อมูลสมาชิกตามเงื่อนไขที่ค้นหา</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูสมาชิกทั้งหมด
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
              setFilterProvince('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View (Responsive Container) */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-950 text-emerald-100 text-xs font-semibold uppercase tracking-wider border-b border-emerald-900">
                  <th className="py-4 px-4">รูปถ่าย / ผู้สมัคร</th>
                  <th className="py-4 px-4">เพศ/อายุ</th>
                  <th className="py-4 px-4">ประเภท/สถานะ</th>
                  <th className="py-4 px-4">ภูมิลำเนา (หมู่บ้าน)</th>
                  <th className="py-4 px-4">การศึกษา/อาชีพ</th>
                  <th className="py-4 px-4">การติดต่อ</th>
                  <th className="py-4 px-4 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Member Photo, ID & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.fullName}
                            className="w-10 h-13 object-cover rounded-lg border border-emerald-400/50 shadow-xs flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-13 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-emerald-200">
                            {member.fullName.replace(/^(นาย|นาง|นางสาว|อาจารย์)\s*/, '').charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-mono text-[11px] text-slate-400 font-semibold">{member.id}</div>
                          <div className="font-bold text-sm text-slate-900 mt-0.5">{member.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {member.idCard ? `${member.idCard.slice(0, 1)}-${member.idCard.slice(1, 5)}-${member.idCard.slice(5, 10)}-${member.idCard.slice(10, 12)}-${member.idCard.slice(12)}` : '-'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gender & Age */}
                    <td className="py-3.5 px-4">
                      <div>{member.gender}</div>
                      <div className="text-slate-500 font-medium">อายุ {member.age} ปี</div>
                    </td>

                    {/* Type & Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          member.memberType === 'ถาวร'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300/60'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {member.memberType}
                        </span>
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            member.status === 'อนุมัติแล้ว'
                              ? 'bg-emerald-100 text-emerald-800'
                              : member.status === 'รอการอนุมัติ'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-medium text-slate-800 truncate" title={member.village}>
                        {member.village || '-'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        ต.{member.subdistrict} อ.{member.district} จ.{member.province}
                      </div>
                    </td>

                    {/* Education & Occupation */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="font-medium text-slate-800 truncate">{member.occupation || '-'}</div>
                      <div className="text-slate-500 text-[11px]">{member.education}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 font-medium">{member.phone || '-'}</div>
                      {member.lineId && (
                        <div className="text-[11px] text-emerald-700">LINE: {member.lineId}</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* View Card */}
                        <button
                          onClick={() => onSelectMember(member)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors"
                          title="ดูบัตรสมาชิก"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEditMember(member)}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Quick Approve or Status toggle */}
                        {member.status === 'รอการอนุมัติ' ? (
                          <button
                            onClick={() => setStatusChangeTarget({ member, newStatus: 'อนุมัติแล้ว' })}
                            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            title="อนุมัติสถานะสมาชิก"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatusChangeTarget({ 
                              member, 
                              newStatus: member.status === 'อนุมัติแล้ว' ? 'หมดอายุ' : 'อนุมัติแล้ว' 
                            })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="ปรับสถานะ"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete (Opens Confirmation Modal) */}
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="ลบสมาชิก"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        
        /* Grid Card View (Mobile Friendly) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-12 h-16 object-cover rounded-xl border border-emerald-400 shadow-xs flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-emerald-200">
                      {member.fullName.replace(/^(นาย|นาง|นางสาว|อาจารย์)\s*/, '').charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs text-slate-400 font-semibold">{member.id}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        member.memberType === 'ถาวร'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {member.memberType}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 truncate mt-0.5">{member.fullName}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-16">สถานะ:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      member.status === 'อนุมัติแล้ว'
                        ? 'bg-emerald-100 text-emerald-800'
                        : member.status === 'รอการอนุมัติ'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-16">เพศ/อายุ:</span>
                    <span>{member.gender} (อายุ {member.age} ปี)</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 w-16 flex-shrink-0">ที่อยู่:</span>
                    <span className="text-slate-700">
                      {member.village} ต.{member.subdistrict} อ.{member.district} จ.{member.province}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-16">อาชีพ:</span>
                    <span>{member.occupation} ({member.education})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-16">โทร:</span>
                    <span className="font-mono font-medium text-slate-800">{member.phone}</span>
                  </div>

                  {member.skills && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 block text-[11px] mb-1">ความเชี่ยวชาญ/สนใจ:</span>
                      <p className="text-slate-700 text-[11px] line-clamp-2">{member.skills}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectMember(member)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ดูบัตรสมาชิก</span>
                </button>

                <button
                  onClick={() => onEditMember(member)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="แก้ไขข้อมูล"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setMemberToDelete(member)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  title="ลบสมาชิก"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MANDATORY: Destructive Delete Confirmation Modal Dialog */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              ยืนยันการลบข้อมูลสมาชิก?
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              คุณต้องการลบข้อมูลของ <strong>{memberToDelete.fullName}</strong> (รหัส: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{memberToDelete.id}</code>) ใช่หรือไม่?
            </p>

            <div className="p-3 my-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              ⚠️ การกระทำนี้จะลบรายการออกจากระบบและสเปรดชีต Google Sheets อย่างถาวร ไม่สามารถย้อนกลับได้
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/20 transition-all flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <span>กำลังลบ...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>ยืนยันการลบสมาชิก</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {statusChangeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              ปรับเปลี่ยนสถานะสมาชิก
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              ต้องการเปลี่ยนสถานะของ <strong>{statusChangeTarget.member.fullName}</strong> เป็น <strong className="text-emerald-700">"{statusChangeTarget.newStatus}"</strong> หรือไม่?
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStatusChangeTarget(null)}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={confirmStatusChange}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
              >
                ยืนยันการเปลี่ยนสถานะ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
