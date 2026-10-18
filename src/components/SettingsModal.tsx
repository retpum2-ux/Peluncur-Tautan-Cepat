import React, { useRef } from 'react';
import {
  X,
  Palette,
  Layers,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit2,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  Check,
  Plus,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  Database,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppSettings, BaseThemeId, GroupItem } from '../types';
import { BASE_THEMES, COLOR_THEMES } from '../data/defaultData';
import firebaseConfig from '../../firebase-applet-config.json';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  groups: GroupItem[];
  onMoveGroup: (groupIndex: number, direction: 'up' | 'down') => void;
  onEditGroup: (group: GroupItem) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddNewGroup: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onResetDefault: () => void;
  currentUser: User | null;
  isSyncing: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  groups,
  onMoveGroup,
  onEditGroup,
  onDeleteGroup,
  onAddNewGroup,
  onExportData,
  onImportData,
  onResetDefault,
  currentUser,
  isSyncing,
  onLogin,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-100">
          <div>
            <h3 className="font-black text-sm sm:text-lg text-slate-800 tracking-wider uppercase">
              PENGATURAN APLIKASI
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Kelola sinkronisasi database cloud, warna dasar cerah, dan susunan kelompok
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg sm:rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 sm:space-y-6">
          {/* Section 0: Firebase Realtime Database Status */}
          <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  Sinkronisasi Database Real-Time (Firebase Firestore)
                </h4>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Terhubung</span>
              </span>
            </div>
            <p className="text-xs text-emerald-900/80 mb-3">
              Data tersinkron otomatis ke cloud Firestore, sehingga saat ada pembaruan kode, fitur baru, atau membuka di perangkat lain, tautan yang tersimpan <strong>tidak akan terhapus</strong>.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-emerald-200">
              {currentUser ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.displayName || currentUser.email}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono truncate">
                      {currentUser.email} · {isSyncing ? 'Sedang sync...' : 'Real-time aktif'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-slate-400" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">Mode Lokal:</span> Masuk dengan Google agar data link tersimpan permanen di cloud akun Anda.
                  </div>
                </div>
              )}

              <div className="shrink-0 flex items-center gap-2">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onLogin}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk dengan Google</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 font-mono">
              Database ID: {firebaseConfig.firestoreDatabaseId}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 1: Pilihan Warna Dasar Cerah */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Pilihan Warna Dasar Cerah (Tema Aplikasi)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Pilih nuansa warna cerah untuk latar belakang, bilah Menu Utama, dan tombol Pengaturan.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(BASE_THEMES).map(([themeKey, themeConfig]) => {
                const isSelected = settings.baseTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => onUpdateSettings({ baseTheme: themeKey as BaseThemeId })}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-slate-800 bg-slate-100 shadow-sm ring-1 ring-slate-800'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg ${themeConfig.headerBarBg} shadow-2xs shrink-0`} />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {themeConfig.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-slate-800 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 2: Kelola Kelompok & Posisi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Daftar Kelompok & Pengaturan Posisi
                </h4>
              </div>
              <button
                type="button"
                onClick={onAddNewGroup}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buat Kelompok Baru</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Ubah urutan posisi kelompok (atas/bawah), ubah nama, ganti warna masing-masing kelompok, atau hapus.
            </p>

            <div className="space-y-2">
              {groups.map((group, idx) => {
                const groupColor = COLOR_THEMES[group.colorKey] || COLOR_THEMES['abu-sketsa'];
                return (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col -space-y-1">
                        <button
                          type="button"
                          onClick={() => onMoveGroup(idx, 'up')}
                          disabled={idx === 0}
                          title="Geser posisi ke atas"
                          className="p-1 text-slate-600 hover:text-black disabled:opacity-20"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveGroup(idx, 'down')}
                          disabled={idx === groups.length - 1}
                          title="Geser posisi ke bawah"
                          className="p-1 text-slate-600 hover:text-black disabled:opacity-20"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md border ${groupColor.cardBorder} ${groupColor.itemBg}`} />
                        <div>
                          <span className="font-bold text-sm text-slate-900 uppercase">
                            {group.title}
                          </span>
                          <span className="ml-2 text-xs text-slate-500">
                            ({group.links.length} tautan)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditGroup(group)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Judul/Warna</span>
                      </button>
                      {groups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteGroup(group.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Hapus kelompok"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 3: Preferensi Navigasi */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
              Preferensi Kunjungan Tautan
            </h4>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Buka Tautan di Tab Baru
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Ketika tombol &quot;KUNJUNGI&quot; diklik, web terbuka di tab browser baru
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.openInNewTab}
                  onChange={(e) => onUpdateSettings({ openInNewTab: e.target.checked })}
                  className="w-4 h-4 rounded text-slate-800 accent-slate-800"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Tampilkan Logo Web (Favicon Otomatis)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Menampilkan ikon logo resmi dari situs web terkait
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showFavicons}
                  onChange={(e) => onUpdateSettings({ showFavicons: e.target.checked })}
                  className="w-4 h-4 rounded text-slate-800 accent-slate-800"
                />
              </label>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 4: Cadangan & Pemulihan Data (Backup/Restore) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
              Cadangkan & Pulihkan Tautan
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Simpan semua link Anda ke file JSON atau pulihkan ke komputer / perangkat lain.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExportData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Cadangan (JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
              >
                <Upload className="w-4 h-4" />
                <span>Impor Cadangan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Kembalikan semua kelompok dan tautan ke contoh awal?')) {
                    onResetDefault();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset ke Data Awal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-900 active:scale-95 shadow-md transition-all"
          >
            Tutup Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
