import React, { useState } from 'react';
import { ExternalLink, Plus, MoreVertical, ChevronUp, ChevronDown, Trash2, Edit2, Globe } from 'lucide-react';
import { GroupItem, LinkItem } from '../types';
import { COLOR_THEMES } from '../data/defaultData';
import { extractDomain, getFaviconUrl, normalizeUrl } from '../utils/urlHelper';

interface GroupCardProps {
  group: GroupItem;
  index: number;
  totalGroups: number;
  openInNewTab: boolean;
  showFavicons: boolean;
  onOpenLink: (url: string) => void;
  onAddLink: (groupId: string) => void;
  onEditLink: (link: LinkItem, groupId: string) => void;
  onDeleteLink: (linkId: string, groupId: string) => void;
  onMoveLink: (groupId: string, linkIndex: number, direction: 'up' | 'down') => void;
  onEditGroup: (group: GroupItem) => void;
  onDeleteGroup: (groupId: string) => void;
  onMoveGroup: (groupIndex: number, direction: 'up' | 'down') => void;
  searchQuery?: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  index,
  totalGroups,
  openInNewTab,
  showFavicons,
  onOpenLink,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onMoveLink,
  onEditGroup,
  onDeleteGroup,
  onMoveGroup,
  searchQuery = '',
}) => {
  const [activeMenuLinkId, setActiveMenuLinkId] = useState<string | null>(null);
  const theme = COLOR_THEMES[group.colorKey] || COLOR_THEMES['abu-sketsa'];

  // Filter links if search query is provided
  const filteredLinks = group.links.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q);
  });

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border-1.5 sm:border-2 ${theme.cardBorder} ${theme.cardBg} shadow-xs sm:shadow-sm transition-all duration-200 flex flex-col overflow-hidden`}
    >
      {/* Group Header (Title & Controls) */}
      <div className="pt-2.5 pb-2 px-3 sm:pt-4 sm:pb-2.5 sm:px-5 flex items-center justify-between border-b border-black/5 bg-white/40 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Reorder Group Controls */}
          <div className="flex flex-col -space-y-1">
            <button
              type="button"
              onClick={() => onMoveGroup(index, 'up')}
              disabled={index === 0}
              title="Pindahkan grup ke atas"
              className="p-0.5 sm:p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMoveGroup(index, 'down')}
              disabled={index === totalGroups - 1}
              title="Pindahkan grup ke bawah"
              className="p-0.5 sm:p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          <h2 className="text-sm sm:text-2xl font-black tracking-wider uppercase text-slate-800 truncate select-none">
            {group.title}
          </h2>
          <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
            {group.links.length}
          </span>
        </div>

        {/* Action buttons for group */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onAddLink(group.id)}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs transition-colors"
            title="Tambah tautan baru ke grup ini"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Tambah</span>
          </button>
          <button
            type="button"
            onClick={() => onEditGroup(group)}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
            title="Pengaturan grup & warna"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          {totalGroups > 1 && (
            <button
              type="button"
              onClick={() => onDeleteGroup(group.id)}
              className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Hapus grup ini"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Links Container (Ada fitur scroll disetiap kotak grup/kelompok) */}
      <div className="p-2 sm:p-4 overflow-y-auto max-h-[250px] sm:max-h-[380px] custom-scrollbar space-y-2 sm:space-y-3">
        {filteredLinks.length === 0 ? (
          <div className="py-5 sm:py-8 px-3 text-center border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl bg-white/40">
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              {searchQuery ? 'Tidak ada tautan yang cocok.' : 'Belum ada tautan di kelompok ini.'}
            </p>
            <button
              type="button"
              onClick={() => onAddLink(group.id)}
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-slate-800 text-white hover:bg-slate-900 shadow-xs transition-all"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Tambah Tautan</span>
            </button>
          </div>
        ) : (
          filteredLinks.map((link) => {
            const actualIndex = group.links.findIndex((l) => l.id === link.id);
            const domain = extractDomain(link.url);
            const isMenuOpen = activeMenuLinkId === link.id;

            return (
              <div
                key={link.id}
                className={`relative group rounded-xl sm:rounded-2xl border sm:border-2 ${theme.itemBorder} ${theme.itemBg} p-2 sm:p-3 shadow-2xs sm:shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-2 sm:gap-3`}
              >
                {/* Left: Info & Direct Click */}
                <div
                  onClick={() => onOpenLink(link.url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onOpenLink(link.url);
                  }}
                  className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 cursor-pointer text-left select-none"
                  title={`Klik untuk mengunjungi: ${link.url}`}
                >
                  {/* Favicon or fallback icon */}
                  {showFavicons ? (
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden relative">
                      <img
                        src={getFaviconUrl(link.url)}
                        alt=""
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute pointer-events-none -z-10" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center shrink-0">
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                    </div>
                  )}

                  {/* Title & Domain */}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-base text-slate-900 truncate leading-tight">
                      {link.title}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-600 truncate flex items-center gap-1 font-mono mt-0.5">
                      <span>{domain}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions and the prominent KUNJUNGI button (sesuai gambar sketsa) */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {/* Quick reorder within group for desktop */}
                  <div className="hidden md:flex flex-col -space-y-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={actualIndex <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLink(group.id, actualIndex, 'up');
                      }}
                      title="Pindah ke atas"
                      className="p-0.5 text-slate-700 hover:text-black disabled:opacity-15 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={actualIndex >= group.links.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLink(group.id, actualIndex, 'down');
                      }}
                      title="Pindah ke bawah"
                      className="p-0.5 text-slate-700 hover:text-black disabled:opacity-15 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Menu Button (Edit, Delete, Move) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuLinkId(isMenuOpen ? null : link.id);
                      }}
                      className="p-1 sm:p-2 rounded-lg sm:rounded-xl text-slate-600 hover:text-slate-900 hover:bg-black/5 transition-colors"
                      title="Pilihan tautan"
                    >
                      <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuLinkId(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 w-40 sm:w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuLinkId(null);
                              onEditLink(link, group.id);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Tautan</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuLinkId(null);
                              onMoveLink(group.id, actualIndex, 'up');
                            }}
                            disabled={actualIndex <= 0}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Geser Ke Atas</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuLinkId(null);
                              onMoveLink(group.id, actualIndex, 'down');
                            }}
                            disabled={actualIndex >= group.links.length - 1}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Geser Ke Bawah</span>
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuLinkId(null);
                              onDeleteLink(link.id, group.id);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Tautan</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* KUNJUNGI Button (Iconic button from user sketch - proportional for mobile) */}
                  <a
                    href={normalizeUrl(link.url)}
                    target={openInNewTab ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold sm:font-black text-[11px] sm:text-sm tracking-normal sm:tracking-wider uppercase ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonText} shadow-xs sm:shadow-md transition-all active:scale-95 focus:outline-hidden ${theme.accentRing}`}
                  >
                    <span>KUNJUNGI</span>
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint indicating scroll capability */}
      <div className="py-1.5 px-3 sm:py-2 sm:px-4 bg-black/5 text-center text-[10px] sm:text-[11px] font-medium text-slate-500 border-t border-black/5 flex items-center justify-between">
        <span>Scroll untuk melihat semua</span>
        <button
          type="button"
          onClick={() => onAddLink(group.id)}
          className="text-slate-700 font-bold hover:underline"
        >
          + Tambah Link
        </button>
      </div>
    </div>
  );
};
