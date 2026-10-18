import React from 'react';
import { Plus, Search, Settings, FolderPlus, Cloud, CloudCheck, LogIn, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';
import { BaseThemeConfig } from '../data/defaultData';

interface HeaderMenuProps {
  themeConfig: BaseThemeConfig;
  totalLinks: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNewLink: () => void;
  onAddNewGroup: () => void;
  onOpenSettings: () => void;
  currentUser: User | null;
  isSyncing: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  themeConfig,
  totalLinks,
  searchQuery,
  onSearchChange,
  onAddNewLink,
  onAddNewGroup,
  onOpenSettings,
  currentUser,
  isSyncing,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="space-y-2.5 sm:space-y-3">
      {/* Top Banner (Identik dengan blok MENU UTAMA pada sketsa gambar) */}
      <div
        className={`w-full py-2.5 px-3 sm:py-4 sm:px-6 rounded-xl sm:rounded-2xl border-1.5 sm:border-2 ${themeConfig.headerBarBorder} ${themeConfig.headerBarBg} shadow-sm sm:shadow-md flex items-center justify-between text-white relative`}
      >
        {/* Left quick actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddNewLink}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-[11px] sm:text-xs font-bold text-white transition-all shadow-2xs backdrop-blur-xs"
            title="Tempel atau tambah link baru"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Tempel</span>
            <span className="hidden sm:inline">Tautan</span>
          </button>
          <button
            type="button"
            onClick={onAddNewGroup}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/25 active:scale-95 text-[11px] sm:text-xs font-semibold text-white transition-all backdrop-blur-xs"
            title="Tambah kategori kelompok baru"
          >
            <FolderPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Grup Baru</span>
          </button>
        </div>

        {/* Center: Iconic MENU UTAMA title */}
        <h1 className="text-base sm:text-2xl md:text-3xl font-black tracking-wider sm:tracking-widest uppercase text-center select-none text-white drop-shadow-xs px-2 truncate">
          MENU UTAMA
        </h1>

        {/* Right: Quick Settings icon & Link badge */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="hidden md:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">
            {totalLinks} Tautan
          </span>
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-[11px] sm:text-xs font-bold text-white transition-all shadow-2xs backdrop-blur-xs"
            title="Buka Pengaturan"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Atur</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Status & Auth Banner */}
      <div className="flex items-center justify-between px-1 text-xs">
        {currentUser ? (
          <div className="flex items-center justify-between w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <CloudCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold truncate">
                {isSyncing ? 'Menyinkronkan ke Firebase...' : 'Tersinkron Real-time ke Cloud'}
              </span>
              <span className="hidden sm:inline text-emerald-600 font-normal">
                ({currentUser.email})
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-[11px] font-bold text-slate-500 hover:text-red-600 ml-2 shrink-0 flex items-center gap-1"
              title="Keluar dari akun Google"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full bg-slate-100/90 border border-slate-300 text-slate-700 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Cloud className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-[11px] sm:text-xs truncate">
                Simpan permanen ke Firebase agar tautan tidak hilang saat pembaruan kode:
              </span>
            </div>
            <button
              type="button"
              onClick={onLogin}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white border border-sky-300 px-2 py-0.5 rounded-md ml-2 shrink-0 flex items-center gap-1 shadow-2xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Masuk Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Search & Filter bar for instant finding */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari tautan (nama situs atau URL)..."
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-400 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
