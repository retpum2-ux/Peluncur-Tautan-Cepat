import React, { useState, useEffect } from 'react';
import { X, Palette, Check } from 'lucide-react';
import { GroupItem } from '../types';
import { COLOR_THEMES } from '../data/defaultData';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: { title: string; colorKey: string }, groupId?: string) => void;
  editingGroup?: GroupItem | null;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGroup,
}) => {
  const [title, setTitle] = useState('');
  const [colorKey, setColorKey] = useState('abu-sketsa');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGroup) {
      setTitle(editingGroup.title);
      setColorKey(editingGroup.colorKey || 'abu-sketsa');
    } else {
      setTitle('');
      setColorKey('abu-sketsa');
    }
    setError('');
  }, [editingGroup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Harap masukkan judul kelompok/grup.');
      return;
    }

    onSave(
      {
        title: title.trim().toUpperCase(),
        colorKey,
      },
      editingGroup?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-base sm:text-lg text-slate-800">
            {editingGroup ? 'Pengaturan Kelompok' : 'Tambah Kelompok Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg sm:rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-5">
          {error && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Group Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Kelompok (Misal: PRIBADI, PEKERJAAN, HIBURAN)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: SOSIAL & CHAT"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 text-sm font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-normal"
            />
          </div>

          {/* Color Scheme Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-slate-500" />
              <span>Pilihan Warna Kelompok (Cerah & Kontras)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-2xl">
              {Object.entries(COLOR_THEMES).map(([key, theme]) => {
                const isSelected = colorKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColorKey(key)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-slate-800 bg-slate-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md border ${theme.cardBorder} ${theme.itemBg} shadow-2xs`} />
                      <span className="text-xs font-semibold text-slate-800">{theme.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-slate-800" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-white hover:bg-slate-900 active:scale-95 shadow-md transition-all"
            >
              {editingGroup ? 'Simpan Perubahan' : 'Tambah Kelompok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
