import React, { useState } from 'react';
import { SheetConfig } from '../types/member';
import { AssociationLogo } from './AssociationLogo';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  DownloadCloud, 
  LogIn,
  Link2,
  Sparkles
} from 'lucide-react';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetConfig: SheetConfig;
  hasToken: boolean;
  onLogin: () => void;
  onCreateNewSheet: () => Promise<void>;
  onPullFromSheet: () => Promise<void>;
  onPushToSheet: () => Promise<void>;
  onSetCustomSpreadsheetId: (id: string) => Promise<void>;
  isProcessing: boolean;
  statusMessage: string | null;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  sheetConfig,
  hasToken,
  onLogin,
  onCreateNewSheet,
  onPullFromSheet,
  onPushToSheet,
  onSetCustomSpreadsheetId,
  isProcessing,
  statusMessage
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const handleApplyCustomId = async () => {
    let cleanId = customInput.trim();
    // Support full google sheet URL: https://docs.google.com/spreadsheets/d/{id}/edit...
    const urlMatch = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch && urlMatch[1]) {
      cleanId = urlMatch[1];
    }

    if (cleanId) {
      await onSetCustomSpreadsheetId(cleanId);
      setShowCustomInput(false);
      setCustomInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <AssociationLogo variant="badge" theme="green" className="w-12 h-12 flex-shrink-0 shadow-xs" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                การเชื่อมต่อ Google Sheets
              </h2>
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs text-slate-500">
              สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT) • จัดเก็บบนคลาวด์
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {!hasToken ? (
          /* Sign-in Call to action */
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              เพื่อบันทึกและอ่านข้อมูลจาก Google Sheets ของสมาคม โปรดเข้าสู่ระบบด้วยบัญชี Google ที่ได้รับสิทธิ์จัดการข้อมูล
            </p>

            <button
              onClick={onLogin}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.4l4.02-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.6l4.02 3.13c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>เข้าสู่ระบบด้วย Google เพื่อเชื่อมต่อ</span>
            </button>
          </div>
        ) : (
          /* Connected State & Operations */
          <div className="space-y-5">
            {sheetConfig.spreadsheetId ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">เชื่อมต่อสเปรดชีตแล้ว</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="font-bold text-sm text-slate-800 truncate">
                  {sheetConfig.spreadsheetName}
                </div>
                <div className="font-mono text-[11px] text-slate-500 truncate">
                  ID: {sheetConfig.spreadsheetId}
                </div>
                {sheetConfig.lastSyncedAt && (
                  <div className="text-[11px] text-slate-400">
                    ซิงค์ล่าสุด: {new Date(sheetConfig.lastSyncedAt).toLocaleString('th-TH')}
                  </div>
                )}

                {sheetConfig.spreadsheetUrl && (
                  <div className="pt-2">
                    <a
                      href={sheetConfig.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                    >
                      <span>เปิดเอกสาร Google Sheets ในแท็บใหม่</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-3">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>ยังไม่ได้สร้างหรือระบุไฟล์ Google Sheets</span>
                </div>
                <p>
                  กดปุ่มด้านล่างเพื่อสร้างไฟล์ "ทะเบียนสมาชิกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า" ใหม่อัตโนมัติใน Google Drive ของคุณ
                </p>
                <button
                  onClick={onCreateNewSheet}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>สร้างไฟล์ Google Sheet ใหม่อัตโนมัติ</span>
                </button>
              </div>
            )}

            {/* Sync Action Buttons */}
            {sheetConfig.spreadsheetId && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onPullFromSheet}
                  disabled={isProcessing}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex flex-col items-center justify-center gap-1.5 text-center"
                >
                  <DownloadCloud className="w-5 h-5 text-emerald-700" />
                  <span>ดึงข้อมูลจาก Sheets</span>
                  <span className="text-[10px] text-slate-400 font-normal">อัปเดตข้อมูลล่าสุดมายังเว็บ</span>
                </button>

                <button
                  onClick={onPushToSheet}
                  disabled={isProcessing}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex flex-col items-center justify-center gap-1.5 text-center"
                >
                  <UploadCloud className="w-5 h-5 text-emerald-600" />
                  <span>ส่งข้อมูลขึ้น Sheets</span>
                  <span className="text-[10px] text-slate-400 font-normal">เขียนทับตารางใน Google</span>
                </button>
              </div>
            )}

            {/* Custom Sheet ID link toggler */}
            <div className="pt-2 border-t border-slate-100">
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>ต้องการระบุ Google Sheet ID ด้วยตนเอง?</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    วาง Google Spreadsheet ID หรือ URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                    <button
                      onClick={handleApplyCustomId}
                      disabled={!customInput.trim() || isProcessing}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                    >
                      เชื่อมต่อ
                    </button>
                  </div>
                  <button
                    onClick={() => setShowCustomInput(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
