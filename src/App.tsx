/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { GroupItem, AppSettings, LinkItem } from './types';
import {
  INITIAL_GROUPS,
  INITIAL_SETTINGS,
  BASE_THEMES,
} from './data/defaultData';
import { HeaderMenu } from './components/HeaderMenu';
import { GroupCard } from './components/GroupCard';
import { FooterSettingsButton } from './components/FooterSettingsButton';
import { AddEditLinkModal } from './components/AddEditLinkModal';
import { GroupModal } from './components/GroupModal';
import { SettingsModal } from './components/SettingsModal';
import { normalizeUrl } from './utils/urlHelper';
import {
  onAuthChange,
  loginWithGoogle,
  logoutUser,
  saveUserSpaceToFirestore,
  subscribeToUserSpace,
} from './firebase/syncService';

const STORAGE_KEY_GROUPS = 'peluncur_tautan_groups_v1';
const STORAGE_KEY_SETTINGS = 'peluncur_tautan_settings_v1';

export default function App() {
  // Authentication & Cloud Sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const isRemoteUpdate = useRef(false);

  // Initialize state with localStorage or default values
  const [groups, setGroups] = useState<GroupItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_GROUPS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return INITIAL_SETTINGS;
  });

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddEditLinkModalOpen, setIsAddEditLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string>('');
  const [defaultGroupIdForAdd, setDefaultGroupIdForAdd] = useState<string>('');

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Notification / toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`Terhubung dengan ${user.email}. Sinkronisasi cloud aktif.`);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore synchronization subscription when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    let hasReceivedInitialData = false;
    setIsSyncing(true);

    const unsubscribe = subscribeToUserSpace(
      currentUser.uid,
      (remoteData) => {
        hasReceivedInitialData = true;
        setIsSyncing(false);

        if (remoteData && Array.isArray(remoteData.groups) && remoteData.groups.length > 0) {
          isRemoteUpdate.current = true;
          setGroups(remoteData.groups);
          if (remoteData.settings) {
            setSettings((prev) => ({ ...prev, ...remoteData.settings }));
          }
          setTimeout(() => {
            isRemoteUpdate.current = false;
          }, 200);
        } else {
          // Cloud document is empty or new account: upload current local groups so links are never lost
          saveUserSpaceToFirestore(currentUser.uid, groups, settings).catch(console.error);
        }
      },
      () => {
        setIsSyncing(false);
      }
    );

    // Initial backup trigger if no cloud document exists yet
    const timeout = setTimeout(() => {
      if (!hasReceivedInitialData && currentUser) {
        saveUserSpaceToFirestore(currentUser.uid, groups, settings).catch(console.error);
        setIsSyncing(false);
      }
    }, 2500);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [currentUser]);

  // 3. Persist local changes to localStorage and push to Firestore if authenticated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } catch {
      // ignore
    }

    if (currentUser && !isRemoteUpdate.current) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        saveUserSpaceToFirestore(currentUser.uid, groups, settings)
          .then(() => setIsSyncing(false))
          .catch(() => setIsSyncing(false));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [groups, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }

    if (currentUser && !isRemoteUpdate.current) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        saveUserSpaceToFirestore(currentUser.uid, groups, settings)
          .then(() => setIsSyncing(false))
          .catch(() => setIsSyncing(false));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [settings, currentUser]);

  // Auth actions
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('popup-closed-by-user')) {
        showToast('Gagal masuk dengan Google. Silakan coba lagi.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Berhasil keluar dari akun Google.');
    } catch {
      showToast('Gagal keluar akun.');
    }
  };

  // Handle direct visit
  const handleOpenLink = (rawUrl: string) => {
    const url = normalizeUrl(rawUrl);
    if (!url) return;
    if (settings.openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  // Open Add Link modal for specific group or first group
  const handleOpenAddLink = (groupId?: string) => {
    setEditingLink(null);
    setEditingGroupId('');
    setDefaultGroupIdForAdd(groupId || groups[0]?.id || '');
    setIsAddEditLinkModalOpen(true);
  };

  // Open Edit Link modal
  const handleOpenEditLink = (link: LinkItem, groupId: string) => {
    setEditingLink(link);
    setEditingGroupId(groupId);
    setIsAddEditLinkModalOpen(true);
  };

  // Save new or edited link
  const handleSaveLink = (
    linkData: { title: string; url: string; description?: string; groupId: string },
    linkId?: string
  ) => {
    setGroups((prevGroups) => {
      // If editing existing link
      if (linkId) {
        return prevGroups.map((g) => {
          if (g.id === linkData.groupId) {
            const existsInGroup = g.links.some((l) => l.id === linkId);
            if (existsInGroup) {
              return {
                ...g,
                links: g.links.map((l) =>
                  l.id === linkId
                    ? {
                        ...l,
                        title: linkData.title,
                        url: linkData.url,
                        description: linkData.description,
                      }
                    : l
                ),
              };
            } else {
              const newLink: LinkItem = {
                id: linkId,
                title: linkData.title,
                url: linkData.url,
                description: linkData.description,
                createdAt: Date.now(),
              };
              return { ...g, links: [...g.links, newLink] };
            }
          } else {
            return {
              ...g,
              links: g.links.filter((l) => l.id !== linkId),
            };
          }
        });
      }

      // If creating new link
      const newLink: LinkItem = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: linkData.title,
        url: linkData.url,
        description: linkData.description,
        createdAt: Date.now(),
      };

      return prevGroups.map((g) => {
        if (g.id === linkData.groupId) {
          return {
            ...g,
            links: [newLink, ...g.links],
          };
        }
        return g;
      });
    });

    showToast(linkId ? 'Tautan berhasil diperbarui!' : 'Tautan baru berhasil ditambahkan!');
  };

  // Delete a link
  const handleDeleteLink = (linkId: string, groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            links: g.links.filter((l) => l.id !== linkId),
          };
        }
        return g;
      })
    );
    showToast('Tautan telah dihapus.');
  };

  // Move link up or down within a group
  const handleMoveLink = (groupId: string, linkIndex: number, direction: 'up' | 'down') => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const newLinks = [...g.links];
        const targetIndex = direction === 'up' ? linkIndex - 1 : linkIndex + 1;
        if (targetIndex < 0 || targetIndex >= newLinks.length) return g;

        const temp = newLinks[linkIndex];
        newLinks[linkIndex] = newLinks[targetIndex];
        newLinks[targetIndex] = temp;

        return { ...g, links: newLinks };
      })
    );
  };

  // Open Add Group modal
  const handleOpenAddGroup = () => {
    setEditingGroup(null);
    setIsGroupModalOpen(true);
  };

  // Open Edit Group modal
  const handleOpenEditGroup = (group: GroupItem) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  // Save new or edited group
  const handleSaveGroup = (
    groupData: { title: string; colorKey: string },
    groupId?: string
  ) => {
    if (groupId) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, title: groupData.title, colorKey: groupData.colorKey }
            : g
        )
      );
      showToast(`Grup "${groupData.title}" berhasil diubah.`);
    } else {
      const newGroup: GroupItem = {
        id: `grp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: groupData.title,
        colorKey: groupData.colorKey,
        links: [],
      };
      setGroups((prev) => [...prev, newGroup]);
      showToast(`Grup "${groupData.title}" berhasil ditambahkan.`);
    }
  };

  // Delete a group
  const handleDeleteGroup = (groupId: string) => {
    const grp = groups.find((g) => g.id === groupId);
    if (!grp) return;

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kelompok "${grp.title}" beserta ${grp.links.length} tautannya?`
      )
    ) {
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      showToast(`Kelompok "${grp.title}" telah dihapus.`);
    }
  };

  // Move group up or down in list
  const handleMoveGroup = (groupIndex: number, direction: 'up' | 'down') => {
    setGroups((prev) => {
      const newGroups = [...prev];
      const targetIndex = direction === 'up' ? groupIndex - 1 : groupIndex + 1;
      if (targetIndex < 0 || targetIndex >= newGroups.length) return prev;

      const temp = newGroups[groupIndex];
      newGroups[groupIndex] = newGroups[targetIndex];
      newGroups[targetIndex] = temp;
      return newGroups;
    });
  };

  // Update app settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      app: 'Peluncur Tautan Cepat',
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      groups,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadangan-tautan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File cadangan berhasil diunduh!');
  };

  // Import JSON backup
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && Array.isArray(parsed.groups)) {
          setGroups(parsed.groups);
          if (parsed.settings) {
            setSettings((prev) => ({ ...prev, ...parsed.settings }));
          }
          showToast('Data berhasil dipulihkan dari file!');
        } else {
          alert('Format file JSON cadangan tidak cocok.');
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to default sketch setup
  const handleResetDefault = () => {
    setGroups(INITIAL_GROUPS);
    setSettings(INITIAL_SETTINGS);
    setSearchQuery('');
    showToast('Aplikasi telah di-reset ke konfigurasi awal.');
  };

  const currentBaseTheme =
    BASE_THEMES[settings.baseTheme] || BASE_THEMES['cerah-putih'];
  const totalLinksCount = groups.reduce((acc, g) => acc + g.links.length, 0);

  return (
    <div
      className={`min-h-screen ${currentBaseTheme.bgGradient} transition-colors duration-300 py-2 sm:py-6 px-1.5 sm:px-6 flex justify-center items-start`}
    >
      {/* Main Tablet-like Outer Frame (Persis dengan sketsa bingkai gambar pengguna) */}
      <div
        className={`w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-4xl border-2 sm:border-3 ${currentBaseTheme.containerBorder} shadow-lg sm:shadow-xl p-2.5 sm:p-7 flex flex-col space-y-3 sm:space-y-5 transition-all`}
      >
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50 bg-slate-900 text-white text-[11px] sm:text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. TOP BANNER: MENU UTAMA */}
        <HeaderMenu
          themeConfig={currentBaseTheme}
          totalLinks={totalLinksCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddNewLink={() => handleOpenAddLink()}
          onAddNewGroup={handleOpenAddGroup}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          currentUser={currentUser}
          isSyncing={isSyncing}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        {/* 2. GROUPS CONTAINER (PRIBADI, PEKERJAAN, dll.) */}
        <main className="space-y-3 sm:space-y-5">
          {groups.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-300 bg-white">
              <p className="text-slate-600 font-bold mb-3">
                Belum ada kelompok tautan.
              </p>
              <button
                type="button"
                onClick={handleOpenAddGroup}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                + Buat Kelompok Baru
              </button>
            </div>
          ) : (
            groups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                index={index}
                totalGroups={groups.length}
                openInNewTab={settings.openInNewTab}
                showFavicons={settings.showFavicons}
                onOpenLink={handleOpenLink}
                onAddLink={handleOpenAddLink}
                onEditLink={handleOpenEditLink}
                onDeleteLink={handleDeleteLink}
                onMoveLink={handleMoveLink}
                onEditGroup={handleOpenEditGroup}
                onDeleteGroup={handleDeleteGroup}
                onMoveGroup={handleMoveGroup}
                searchQuery={searchQuery}
              />
            ))
          )}
        </main>

        {/* 3. BOTTOM BUTTON: PENGATURAN (Sesuai sketsa di bagian bawah) */}
        <FooterSettingsButton
          themeConfig={currentBaseTheme}
          onClick={() => setIsSettingsModalOpen(true)}
        />
      </div>

      {/* MODALS */}
      <AddEditLinkModal
        isOpen={isAddEditLinkModalOpen}
        onClose={() => setIsAddEditLinkModalOpen(false)}
        onSave={handleSaveLink}
        groups={groups}
        defaultGroupId={defaultGroupIdForAdd}
        editingLink={editingLink}
        editingGroupId={editingGroupId}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        groups={groups}
        onMoveGroup={handleMoveGroup}
        onEditGroup={handleOpenEditGroup}
        onDeleteGroup={handleDeleteGroup}
        onAddNewGroup={handleOpenAddGroup}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetDefault={handleResetDefault}
        currentUser={currentUser}
        isSyncing={isSyncing}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
