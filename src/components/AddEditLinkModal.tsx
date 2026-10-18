import React, { useState, useEffect } from 'react';
import { X, Link2, Type, Folder, Sparkles } from 'lucide-react';
import { GroupItem, LinkItem } from '../types';
import { normalizeUrl, suggestTitleFromUrl, extractDomain } from '../utils/urlHelper';

interface AddEditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: { title: string; url: string; description?: string; groupId: string }, linkId?: string) => void;
  groups: GroupItem[];
  defaultGroupId?: string;
  editingLink?: LinkItem | null;
  editingGroupId?: string;
}

export const AddEditLinkModal: React.FC<AddEditLinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groups,
  defaultGroupId,
  editingLink,
  editingGroupId,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingLink) {
      setUrl(editingLink.url);
      setTitle(editingLink.title);
      setDescription(editingLink.description || '');
      setSelectedGroupId(editingGroupId || groups[0]?.id || '');
    } else {
      setUrl('');
      setTitle('');
      setDescription('');
      setSelectedGroupId(defaultGroupId || groups[0]?.id || '');
    }
    setError('');
  }, [editingLink, editingGroupId, defaultGroupId, groups, isOpen]);

  if (!isOpen) return null;

  const handleUrlChange = (val: string) => {
    setUrl(val);
    setError('');
    // If title is empty and user types a valid-ish domain, suggest title
    if (!title.trim() && val.includes('.')) {
      const suggested = suggestTitleFromUrl(val);
      if (suggested && suggested !== 'Tautan Baru') {
        setTitle(suggested);
      }
    }
  };

  const handleAutoSuggestTitle = () => {
    if (!url.trim()) return;
    const suggested = suggestTitleFromUrl(url);
    if (suggested) {
      setTitle(suggested);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Harap masukkan alamat URL web.');
      return;
    }

    const finalUrl = normalizeUrl(url);
    const finalTitle = title.trim() || suggestTitleFromUrl(url) || 'Tautan';
    const targetGroupId = selectedGroupId || groups[0]?.id;

    if (!targetGroupId) {
      setError('Silakan pilih kelompok / grup terlebih dahulu.');
      return;
    }

    onSave(
      {
        title: finalTitle,
        url: finalUrl,
        description: description.trim(),
        groupId: targetGroupId,
      },
      editingLink?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-base sm:text-lg text-slate-800">
            {editingLink ? 'Edit Tautan' : 'Tambah Tautan Baru'}
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* URL Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-slate-500" />
              <span>Alamat URL Web (Bisa Ditempel Langsung)</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Contoh: google.com atau https://instagram.com"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
            {url && (
              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <span>Domain:</span>
                <span className="font-mono font-medium text-slate-700">{extractDomain(url)}</span>
              </p>
            )}
          </div>

          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-4 h-4 text-slate-500" />
                <span>Judul Tautan</span>
              </label>
              {url && (
                <button
                  type="button"
                  onClick={handleAutoSuggestTitle}
                  className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Saran Judul Otomatis</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Google Mail, Berita Terkini, YouTube"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Group Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-slate-500" />
              <span>Kelompok / Grup Tujuan</span>
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 text-sm font-semibold text-slate-900 bg-white"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Note / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Keterangan Singkat (Opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan kecil untuk link ini..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 text-xs text-slate-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
              {editingLink ? 'Simpan Perubahan' : 'Simpan Tautan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
