import React from 'react';
import { Settings, SlidersHorizontal } from 'lucide-react';
import { BaseThemeConfig } from '../data/defaultData';

interface FooterSettingsButtonProps {
  themeConfig: BaseThemeConfig;
  onClick: () => void;
}

export const FooterSettingsButton: React.FC<FooterSettingsButtonProps> = ({
  themeConfig,
  onClick,
}) => {
  return (
    <footer className="pt-1 sm:pt-2">
      {/* Bottom Button (Identik dengan tombol PENGATURAN di bagian bawah gambar sketsa) */}
      <button
        type="button"
        onClick={onClick}
        className={`w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-1.5 sm:border-2 ${themeConfig.bottomBarBorder} ${themeConfig.bottomBarBg} ${themeConfig.bottomBarText} shadow-sm sm:shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer select-none group`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-45" />
        <span className="text-xs sm:text-base md:text-lg font-bold sm:font-black tracking-wider sm:tracking-widest uppercase">
          PENGATURAN
        </span>
        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-75" />
      </button>
    </footer>
  );
};
