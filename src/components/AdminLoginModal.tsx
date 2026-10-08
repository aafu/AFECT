import React, { useState } from 'react';
import { AssociationLogo } from './AssociationLogo';
import { 
  X, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const ADMIN_USERNAME = 'adminak';
export const ADMIN_PASSWORD = 'afectAK';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      setIsSubmitting(false);
      return;
    }

    if (trimmedUser === ADMIN_USERNAME && trimmedPass === ADMIN_PASSWORD) {
      // Successful Admin Authentication
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess();
        onClose();
      }, 300);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (กรุณาตรวจสอบ Name: adminak, Pass: afectAK)');
      }, 300);
    }
  };

  const handleQuickFill = () => {
    setUsername(ADMIN_USERNAME);
    setPassword(ADMIN_PASSWORD);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <AssociationLogo variant="badge" theme="green" className="w-16 h-16 drop-shadow-md mb-3" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ระบบนายทะเบียนและผู้ดูแลระบบ (Admin)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            เข้าสู่ระบบแอดมิน
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อผู้ใช้ (Name / Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ระบุชื่อผู้ใช้ (adminak)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ระบุรหัสผ่าน (afectAK)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Helper Pill */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-700">บัญชีผู้ดูแลระบบ:</span>{' '}
              <span className="font-mono text-emerald-700 font-bold">adminak</span> /{' '}
              <span className="font-mono text-emerald-700 font-bold">afectAK</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline ml-2"
            >
              กรอกให้อัตโนมัติ
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-950/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบผู้ดูแลระบบ'}</span>
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-400">
            คนทั่วไปสามารถสมัครสมาชิกและดูภาพรวมได้โดยไม่ต้องเข้าสู่ระบบ
          </p>
        </div>

      </div>
    </div>
  );
};
