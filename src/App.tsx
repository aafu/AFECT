/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { ActiveTab, Member, MemberStatus, SheetConfig } from './types/member';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken, 
  setAccessTokenInMemory 
} from './services/firebaseAuth';
import { 
  findOrCreateSpreadsheet, 
  fetchMembersFromSheet, 
  addMemberToSheet, 
  updateMemberInSheet, 
  deleteMemberInSheet, 
  overwriteAllMembersToSheet,
  SPREADSHEET_TITLE
} from './services/googleSheets';
import { 
  getStoredMembers, 
  saveStoredMembers, 
  getStoredConfig, 
  saveStoredConfig 
} from './services/storage';

import { Header } from './components/Header';
import { AssociationLogo } from './components/AssociationLogo';
import { Overview } from './components/Overview';
import { ThailandMemberMap } from './components/ThailandMemberMap';
import { RegistrationForm } from './components/RegistrationForm';
import { MemberManagement } from './components/MemberManagement';
import { Reports } from './components/Reports';
import { MemberCardModal } from './components/MemberCardModal';
import { EditMemberModal } from './components/EditMemberModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { AdminLoginModal } from './components/AdminLoginModal';

import { 
  Users, 
  UserPlus, 
  SlidersHorizontal, 
  BarChart3, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Lock,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Members & Storage State
  const [members, setMembers] = useState<Member[]>(() => getStoredMembers());
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => getStoredConfig());

  // Processing & Toast status
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Admin Role Authentication State (adminak / afectAK)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('afect_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Modals
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  // Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusNotification({ message, type });
    setTimeout(() => {
      setStatusNotification(null);
    }, 4500);
  }, []);

  // Admin Login & Logout handlers
  const handleAdminLoginSuccess = useCallback(() => {
    setIsAdmin(true);
    try {
      localStorage.setItem('afect_admin_logged_in', 'true');
    } catch (e) {
      console.error(e);
    }
    showToast('เข้าสู่ระบบผู้ดูแลระบบสำเร็จ ยินดีต้อนรับคุณ adminak', 'success');
  }, [showToast]);

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('afect_admin_logged_in');
    } catch (e) {
      console.error(e);
    }
    setActiveTab(prev => (prev === 'manage' || prev === 'reports' ? 'overview' : prev));
    showToast('ออกจากระบบผู้ดูแลระบบเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  // Save to LocalStorage whenever members change
  const updateMembersState = useCallback((newMembers: Member[]) => {
    setMembers(newMembers);
    saveStoredMembers(newMembers);
  }, []);

  // Save to LocalStorage whenever sheetConfig changes
  const updateSheetConfig = useCallback((newConfig: SheetConfig) => {
    setSheetConfig(newConfig);
    saveStoredConfig(newConfig);
  }, []);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setAccessTokenInMemory(token);
      },
      () => {
        // User logged out or token expired
        setUser(null);
        setAccessToken(null);
        setAccessTokenInMemory(null);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      setIsSyncing(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setAccessTokenInMemory(res.accessToken);
        showToast('เข้าสู่ระบบ Google สำเร็จ กำลังตรวจสอบตารางสเปรดชีต...', 'info');

        // Automatically find or create spreadsheet
        try {
          const sheetInfo = await findOrCreateSpreadsheet(res.accessToken, sheetConfig.spreadsheetId);
          const newConfig: SheetConfig = {
            spreadsheetId: sheetInfo.id,
            spreadsheetName: sheetInfo.title,
            spreadsheetUrl: sheetInfo.url,
            lastSyncedAt: new Date().toISOString(),
            autoSync: true
          };
          updateSheetConfig(newConfig);
          showToast(`เชื่อมต่อ Google Sheets สำเร็จ (${sheetInfo.title})`, 'success');

          // Optional: Pull existing data or push local members if sheet is empty
          const remoteMembers = await fetchMembersFromSheet(res.accessToken, sheetInfo.id);
          if (remoteMembers.length > 0) {
            updateMembersState(remoteMembers);
            showToast(`โหลดข้อมูลสมาชิกจาก Google Sheets สำเร็จ (${remoteMembers.length} ท่าน)`, 'success');
          } else if (members.length > 0) {
            // Push initial seed/local members to the newly created sheet
            await overwriteAllMembersToSheet(res.accessToken, sheetInfo.id, sheetInfo.sheetId, members);
            showToast(`ส่งข้อมูลสมาชิกลง Google Sheets เรียบร้อยแล้ว`, 'success');
          }
        } catch (sheetErr) {
          console.error('Sheet setup error:', sheetErr);
          showToast('เชื่อมต่อ Google สำเร็จ แต่ไม่สามารถสร้าง/เปิด Google Sheets ได้', 'error');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showToast('การเข้าสู่ระบบถูกยกเลิกหรือไม่สำเร็จ', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Create New Spreadsheet on demand
  const handleCreateNewSheet = async () => {
    if (!accessToken) {
      await handleGoogleLogin();
      return;
    }

    try {
      setIsSyncing(true);
      const sheetInfo = await findOrCreateSpreadsheet(accessToken, null);
      const newConfig: SheetConfig = {
        spreadsheetId: sheetInfo.id,
        spreadsheetName: sheetInfo.title,
        spreadsheetUrl: sheetInfo.url,
        lastSyncedAt: new Date().toISOString(),
        autoSync: true
      };
      updateSheetConfig(newConfig);

      // Overwrite current members to the new sheet
      await overwriteAllMembersToSheet(accessToken, sheetInfo.id, sheetInfo.sheetId, members);
      showToast('สร้างไฟล์ Google Sheets ใหม่และส่งข้อมูลสมาชิกลงตารางสำเร็จ', 'success');
    } catch (err: any) {
      console.error('Create sheet error:', err);
      showToast(`ไม่สามารถสร้างตารางใหม่: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull latest members from Google Sheets
  const handlePullFromSheet = async () => {
    if (!accessToken || !sheetConfig.spreadsheetId) {
      showToast('กรุณาเข้าสู่ระบบ Google และเชื่อมต่อสเปรดชีตก่อน', 'error');
      return;
    }

    try {
      setIsSyncing(true);
      const remoteMembers = await fetchMembersFromSheet(accessToken, sheetConfig.spreadsheetId);
      updateMembersState(remoteMembers);
      updateSheetConfig({
        ...sheetConfig,
        lastSyncedAt: new Date().toISOString()
      });
      showToast(`ดึงข้อมูลจาก Google Sheets สำเร็จ (${remoteMembers.length} รายการ)`, 'success');
    } catch (err: any) {
      console.error('Pull error:', err);
      showToast(`ไม่สามารถดึงข้อมูลจากชีต: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Push all local members to Google Sheets
  const handlePushToSheet = async () => {
    if (!accessToken || !sheetConfig.spreadsheetId) {
      showToast('กรุณาเข้าสู่ระบบ Google และเชื่อมต่อสเปรดชีตก่อน', 'error');
      return;
    }

    try {
      setIsSyncing(true);
      await overwriteAllMembersToSheet(accessToken, sheetConfig.spreadsheetId, 0, members);
      updateSheetConfig({
        ...sheetConfig,
        lastSyncedAt: new Date().toISOString()
      });
      showToast(`ส่งข้อมูลสมาชิกทั้งหมด (${members.length} ท่าน) ขึ้น Google Sheets สำเร็จ`, 'success');
    } catch (err: any) {
      console.error('Push error:', err);
      showToast(`เกิดข้อผิดพลาดในการส่งข้อมูล: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Connect Custom Spreadsheet ID
  const handleSetCustomSpreadsheetId = async (customId: string) => {
    if (!accessToken) {
      showToast('กรุณาเข้าสู่ระบบ Google ก่อน', 'error');
      return;
    }

    try {
      setIsSyncing(true);
      const sheetInfo = await findOrCreateSpreadsheet(accessToken, customId);
      updateSheetConfig({
        spreadsheetId: sheetInfo.id,
        spreadsheetName: sheetInfo.title,
        spreadsheetUrl: sheetInfo.url,
        lastSyncedAt: new Date().toISOString(),
        autoSync: true
      });
      // Load members from that sheet
      const remote = await fetchMembersFromSheet(accessToken, sheetInfo.id);
      if (remote.length > 0) {
        updateMembersState(remote);
      }
      showToast(`เชื่อมต่อกับชีต "${sheetInfo.title}" สำเร็จ`, 'success');
    } catch (err: any) {
      console.error('Custom sheet error:', err);
      showToast(`ไม่สามารถเชื่อมต่อ Sheet ID ที่ระบุ: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Member
  const handleAddMember = async (newMember: Member): Promise<boolean> => {
    try {
      setIsSaving(true);
      const updatedList = [newMember, ...members];
      updateMembersState(updatedList);

      // If connected to Google Sheets, append row!
      if (accessToken && sheetConfig.spreadsheetId) {
        try {
          await addMemberToSheet(accessToken, sheetConfig.spreadsheetId, newMember);
          showToast(`บันทึกข้อมูลและส่งเข้าระบบ Google Sheets สำเร็จ (${newMember.id})`, 'success');
        } catch (sheetErr) {
          console.error('Failed to append to Google Sheet:', sheetErr);
          showToast(`บันทึกลงระบบแล้ว (แต่ส่งขึ้น Google Sheets ไม่สำเร็จ: โปรดกดซิงค์ภายหลัง)`, 'info');
        }
      } else {
        showToast(`บันทึกข้อมูลสมาชิก ${newMember.id} เรียบร้อยแล้ว (สามารถเชื่อมต่อ Google Sheets เพื่อซิงค์)`, 'success');
      }

      return true;
    } catch (e: any) {
      console.error('Add member error:', e);
      showToast(`เกิดข้อผิดพลาดในการบันทึก: ${e.message}`, 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update Member
  const handleUpdateMember = async (updatedMember: Member): Promise<void> => {
    try {
      setIsSaving(true);
      const updatedList = members.map(m => m.id === updatedMember.id ? updatedMember : m);
      updateMembersState(updatedList);

      if (accessToken && sheetConfig.spreadsheetId) {
        // We sync the updated list to Google Sheets
        await overwriteAllMembersToSheet(accessToken, sheetConfig.spreadsheetId, 0, updatedList);
        showToast(`อัปเดตข้อมูล ${updatedMember.fullName} ใน Google Sheets สำเร็จ`, 'success');
      } else {
        showToast(`อัปเดตข้อมูล ${updatedMember.fullName} สำเร็จ`, 'success');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      showToast(`เกิดข้อผิดพลาดในการอัปเดต: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Update Status
  const handleUpdateStatus = async (memberId: string, newStatus: MemberStatus): Promise<void> => {
    const target = members.find(m => m.id === memberId);
    if (!target) return;
    const updated = { ...target, status: newStatus };
    await handleUpdateMember(updated);
  };

  // Delete Member (Confirmation handled in UI modal)
  const handleDeleteMember = async (memberToDelete: Member): Promise<void> => {
    try {
      setIsSaving(true);
      const updatedList = members.filter(m => m.id !== memberToDelete.id);
      updateMembersState(updatedList);

      if (accessToken && sheetConfig.spreadsheetId) {
        await overwriteAllMembersToSheet(accessToken, sheetConfig.spreadsheetId, 0, updatedList);
        showToast(`ลบข้อมูล ${memberToDelete.fullName} จากระบบและ Google Sheets สำเร็จ`, 'success');
      } else {
        showToast(`ลบข้อมูล ${memberToDelete.fullName} สำเร็จ`, 'success');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast(`เกิดข้อผิดพลาดในการลบข้อมูล: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        hasToken={Boolean(accessToken)}
        sheetConfig={sheetConfig}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onOpenSyncModal={() => setSyncModalOpen(true)}
        onManualSync={handlePullFromSheet}
        isSyncing={isSyncing}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Floating Status Notification Toast */}
      {statusNotification && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom duration-200 max-w-md">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
            statusNotification.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : statusNotification.type === 'error'
              ? 'bg-rose-900 text-white border-rose-500/50'
              : 'bg-indigo-900 text-white border-indigo-500/50'
          }`}>
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : statusNotification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            ) : (
              <FileSpreadsheet className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium leading-snug">
              {statusNotification.message}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <Overview
            members={members}
            sheetConfig={sheetConfig}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectMember={(m) => setSelectedMemberForCard(m)}
            onApproveMember={(id) => handleUpdateStatus(id, 'อนุมัติแล้ว')}
            onManualSync={handlePullFromSheet}
            isSyncing={isSyncing}
            hasToken={Boolean(accessToken)}
            onLogin={handleGoogleLogin}
            isAdmin={isAdmin}
            onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <ThailandMemberMap
            members={members}
            onSelectMember={(m) => setSelectedMemberForCard(m)}
            onEditMember={(m) => setMemberToEdit(m)}
            onNavigate={(tab) => setActiveTab(tab)}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'register' && (
          <RegistrationForm
            onSubmit={handleAddMember}
            onViewCard={(m) => setSelectedMemberForCard(m)}
            isSaving={isSaving}
            hasSheetConnected={Boolean(accessToken && sheetConfig.spreadsheetId)}
            memberCount={members.length}
          />
        )}

        {activeTab === 'manage' && (
          isAdmin ? (
            <MemberManagement
              members={members}
              onSelectMember={(m) => setSelectedMemberForCard(m)}
              onEditMember={(m) => setMemberToEdit(m)}
              onUpdateStatus={handleUpdateStatus}
              onDeleteMember={handleDeleteMember}
              onNavigateRegister={() => setActiveTab('register')}
              isProcessing={isSaving || isSyncing}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/90 shadow-lg text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">พื้นที่เฉพาะผู้ดูแลระบบ (Admin Only)</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  ต้องเข้าสู่ระบบแอดมินก่อนใช้งานหน้าจัดการสมาชิก
                </h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  หน้านี้สงวนสิทธิ์เฉพาะนายทะเบียนและเจ้าหน้าที่สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า เพื่อความปลอดภัยและเป็นส่วนตัวของข้อมูลสมาชิก
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 text-left">
                <div>ชื่อผู้ใช้: <strong className="font-mono text-emerald-700">adminak</strong></div>
                <div>รหัสผ่าน: <strong className="font-mono text-emerald-700">afectAK</strong></div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setAdminLoginModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>เข้าสู่ระบบแอดมินทันที</span>
                </button>

                <button
                  onClick={() => setActiveTab('overview')}
                  className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  กลับไปหน้าภาพรวม
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'reports' && (
          isAdmin ? (
            <Reports members={members} />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/90 shadow-lg text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">พื้นที่เฉพาะผู้ดูแลระบบ (Admin Only)</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  ต้องเข้าสู่ระบบแอดมินก่อนดูรายงานสถิติละเอียด
                </h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  รายงานเชิงลึกสำหรับคณะกรรมการบริหารและนายทะเบียนสมาคมฯ
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 text-left">
                <div>ชื่อผู้ใช้: <strong className="font-mono text-emerald-700">adminak</strong></div>
                <div>รหัสผ่าน: <strong className="font-mono text-emerald-700">afectAK</strong></div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setAdminLoginModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>เข้าสู่ระบบแอดมินทันที</span>
                </button>

                <button
                  onClick={() => setActiveTab('overview')}
                  className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  กลับไปหน้าภาพรวม
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AssociationLogo variant="badge" theme="green" className="w-10 h-10 flex-shrink-0 drop-shadow-xs" />
            <div>
              <p className="font-semibold text-slate-800">
                สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)
              </p>
              <p className="text-[11px] text-slate-400">
                Association for Akha Education and Culture • Chiang Rai, Thailand
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            {isAdmin ? (
              <>
                <span>ฐานข้อมูล Google Sheets</span>
                <span>•</span>
                <button 
                  onClick={() => setSyncModalOpen(true)}
                  className="text-emerald-700 hover:underline font-medium"
                >
                  สถานะการเชื่อมต่อสเปรดชีต
                </button>
              </>
            ) : (
              <button 
                onClick={() => setAdminLoginModalOpen(true)}
                className="text-emerald-700 hover:underline font-medium inline-flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>เข้าสู่ระบบแอดมิน (adminak)</span>
              </button>
            )}
            <span>•</span>
            <span>ภาษาไทย 100%</span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="sm:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        {isAdmin ? (
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-medium transition-colors ${
                activeTab === 'overview' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span>ภาพรวม</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-medium transition-colors ${
                activeTab === 'register' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-5 h-5 mb-0.5" />
              <span>รับสมัคร</span>
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-medium transition-colors ${
                activeTab === 'manage' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5 mb-0.5" />
              <span>จัดการ</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-medium transition-colors ${
                activeTab === 'reports' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5 mb-0.5" />
              <span>รายงาน</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-medium transition-colors ${
                activeTab === 'overview' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span>ภาพรวม</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-medium transition-colors ${
                activeTab === 'register' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-5 h-5 mb-0.5" />
              <span>สมัครสมาชิก</span>
            </button>

            <button
              onClick={() => setAdminLoginModalOpen(true)}
              className="flex flex-col items-center py-2 rounded-xl text-[11px] font-medium text-slate-500 hover:text-emerald-700 transition-colors"
            >
              <Lock className="w-5 h-5 mb-0.5 text-emerald-600" />
              <span>แอดมิน</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal 1: Official Member Digital ID Card */}
      {selectedMemberForCard && (
        <MemberCardModal
          member={selectedMemberForCard}
          onClose={() => setSelectedMemberForCard(null)}
          onEdit={(m) => {
            setSelectedMemberForCard(null);
            setMemberToEdit(m);
          }}
        />
      )}

      {/* Modal 2: Edit Member Modal */}
      {memberToEdit && (
        <EditMemberModal
          member={memberToEdit}
          onClose={() => setMemberToEdit(null)}
          onSave={handleUpdateMember}
          isProcessing={isSaving}
        />
      )}

      {/* Modal 3: Google Sheets Sync & Status Settings */}
      <GoogleSheetSyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        sheetConfig={sheetConfig}
        hasToken={Boolean(accessToken)}
        onLogin={handleGoogleLogin}
        onCreateNewSheet={handleCreateNewSheet}
        onPullFromSheet={handlePullFromSheet}
        onPushToSheet={handlePushToSheet}
        onSetCustomSpreadsheetId={handleSetCustomSpreadsheetId}
        isProcessing={isSyncing}
        statusMessage={null}
      />

      {/* Modal 4: Admin Login Modal (Name: adminak, Pass: afectAK) */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
