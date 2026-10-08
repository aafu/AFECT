import React, { useState } from 'react';
import { ActiveTab, SheetConfig } from '../types/member';
import { AssociationLogo } from './AssociationLogo';
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  BarChart3, 
  Menu, 
  X, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  LogIn,
  LogOut,
  SlidersHorizontal,
  Lock,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User | null;
  hasToken: boolean;
  sheetConfig: SheetConfig;
  onLogin: () => void;
  onLogout: () => void;
  onOpenSyncModal: () => void;
  onManualSync: () => void;
  isSyncing: boolean;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  hasToken,
  sheetConfig,
  onLogin,
  onLogout,
  onOpenSyncModal,
  onManualSync,
  isSyncing,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Separate navigation for Admin vs General Public
  const navItems = isAdmin
    ? [
        { id: 'overview' as ActiveTab, label: 'ภาพรวมระบบ', icon: Users },
        { id: 'register' as ActiveTab, label: 'รับสมัครสมาชิก', icon: UserPlus },
        { id: 'manage' as ActiveTab, label: 'จัดการสมาชิก', icon: SlidersHorizontal },
        { id: 'reports' as ActiveTab, label: 'รายงานสถิติ', icon: BarChart3 },
      ]
    : [
        { id: 'overview' as ActiveTab, label: 'ภาพรวมสมาคม', icon: Users },
        { id: 'register' as ActiveTab, label: 'สมัครสมาชิก', icon: UserPlus },
      ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-emerald-900/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Association Name */}
          <div 
            onClick={() => setActiveTab('overview')} 
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            {/* Official AFECT Logo Badge */}
            <AssociationLogo 
              variant="badge" 
              theme="white"
              className="w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform" 
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                  สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า
                </span>
                {isAdmin && (
                  <span className="hidden xl:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    แอดมิน
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 font-light tracking-wide hidden sm:block">
                Association for Akha Education and Culture (AFECT) • เชียงราย
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Admin Status, Google Sheets connection & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* If Admin: Show Admin Badge + Google Sheets controls */}
            {isAdmin ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Google Sheets Status (Admin Only) */}
                {hasToken && sheetConfig.spreadsheetId ? (
                  <div className="hidden lg:flex items-center gap-1.5">
                    <button
                      onClick={onOpenSyncModal}
                      title="ดูการเชื่อมต่อ Google Sheets"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors text-xs font-medium"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="max-w-[110px] truncate">Google Sheets</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </button>
                    {sheetConfig.spreadsheetUrl && (
                      <a
                        href={sheetConfig.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="เปิดสเปรดชีต Google Sheets"
                        className="p-1.5 rounded-lg bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/50 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ) : hasToken ? (
                  <button
                    onClick={onOpenSyncModal}
                    className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 text-xs font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ตั้งค่าชีต</span>
                  </button>
                ) : null}

                {/* Logged in Admin Pill with Logout */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-bold text-white text-xs leading-tight">adminak</span>
                    <span className="text-[10px] text-emerald-300">ผู้ดูแลระบบ</span>
                  </div>
                  <button
                    onClick={onAdminLogout}
                    className="ml-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-900/70 text-slate-300 hover:text-rose-200 text-xs font-medium transition-colors flex items-center gap-1"
                    title="ออกจากระบบแอดมิน"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden md:inline">ออกระบบ</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If General Public: Show Clear Admin Login Button */
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-emerald-800/60 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/40 font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                  title="สำหรับนายทะเบียนและผู้ดูแลระบบสมาคม (adminak / afectAK)"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>เข้าสู่ระบบแอดมิน</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Admin / User Status */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAdmin ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">ผู้ดูแลระบบ: adminak</span>
                </div>
                <button
                  onClick={() => {
                    onAdminLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900 text-rose-300 text-xs font-medium"
                >
                  ออกจากระบบแอดมิน
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>เข้าสู่ระบบแอดมิน (adminak / afectAK)</span>
              </button>
            )}

            {/* If Admin and Sheet connected */}
            {isAdmin && sheetConfig.spreadsheetId && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/90 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Google Sheets พร้อมใช้งาน</span>
                </div>
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="p-1 rounded bg-slate-700 text-slate-200"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

