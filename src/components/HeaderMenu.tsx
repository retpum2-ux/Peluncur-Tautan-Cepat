import React from 'react';
import { Plus, Search, Settings, FolderPlus, CloudCheck, Loader2 } from 'lucide-react';
import { BaseThemeConfig } from '../data/defaultData';

interface HeaderMenuProps {
  themeConfig: BaseThemeConfig;
  totalLinks: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNewLink: () => void;
  onAddNewGroup: () => void;
  onOpenSettings: () => void;
  isSyncing: boolean;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  themeConfig,
  totalLinks,
  searchQuery,
  onSearchChange,
  onAddNewLink,
  onAddNewGroup,
  onOpenSettings,
  isSyncing,
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

      {/* Cloud Sync Status Badge (Tersinkron Otomatis Tanpa Perlu Login) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white/80 border border-slate-200/80 rounded-lg px-2.5 py-1 w-full justify-between">
          <div className="flex items-center gap-1.5">
            {isSyncing ? (
              <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
            ) : (
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="font-medium text-slate-700">
              {isSyncing ? 'Menyinkronkan ke database...' : 'Database Cloud Real-Time Aktif'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Tersimpan otomatis permanen
          </span>
        </div>
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
