'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ──
interface Notice {
  id: number;
  title: string;
  message: string;
  active: boolean;
  createdAt: string;
}
interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  sort_order: number;
}
interface Project {
  id: number;
  title: string;
  description: string;
  sort_order: number;
  images: ProjectImage[];
}
interface Partner {
  id: number;
  name: string;
  logo_url: string;
  sort_order: number;
}
interface AboutData {
  about: { id: number; title: string; description: string; image_url: string } | null;
  mission: { id: number; description: string; image_url: string } | null;
  vision: { id: number; description: string; image_url: string } | null;
  chairman: { id: number; name: string; title: string; message: string; image_url: string } | null;
}

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type TabKey = 'dashboard' | 'settings' | 'security' | 'about' | 'projects' | 'partners' | 'notices';

function genId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function AdminPage() {
  // ── Auth ──
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginShake, setLoginShake] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingAuth, setUpdatingAuth] = useState(false);

  // ── Navigation ──
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Toast ──
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Data ──
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [aboutData, setAboutData] = useState<AboutData>({ about: null, mission: null, vision: null, chairman: null });
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // ── Modals ──
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');

  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeActive, setNoticeActive] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadContext, setUploadContext] = useState<{ type: string; id?: number } | null>(null);
  const [partnerName, setPartnerName] = useState('');

  // ── Toast ──
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = genId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // ── Auth ──
  useEffect(() => {
    const s = localStorage.getItem('blesslife_admin_session');
    if (s === 'authenticated') setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('blesslife_admin_session', 'authenticated');
        localStorage.setItem('blesslife_admin_user', data.user.username);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || 'Invalid credentials');
        setLoginShake(true);
        setTimeout(() => setLoginShake(false), 600);
      }
    } catch (err) {
      setLoginError('An error occurred during login');
    }
  };

  const handleUpdateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingAuth(true);
    try {
      const currentUsername = localStorage.getItem('blesslife_admin_user') || username;
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUsername, currentPassword, newUsername, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Credentials updated successfully', 'success');
        localStorage.setItem('blesslife_admin_user', newUsername);
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
      } else {
        showToast(data.error || 'Failed to update credentials', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setUpdatingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('blesslife_admin_session');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // ── Data Loading ──
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) setSettings(await res.json());
    } catch { showToast('Failed to load settings', 'error'); }
  }, [showToast]);

  const loadAbout = useCallback(async () => {
    try {
      const res = await fetch('/api/about');
      if (res.ok) setAboutData(await res.json());
    } catch { showToast('Failed to load about data', 'error'); }
  }, [showToast]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch { showToast('Failed to load projects', 'error'); }
  }, [showToast]);

  const loadPartners = useCallback(async () => {
    try {
      const res = await fetch('/api/partners');
      if (res.ok) setPartners(await res.json());
    } catch { showToast('Failed to load partners', 'error'); }
  }, [showToast]);

  const loadNotices = useCallback(async () => {
    try {
      const res = await fetch('/api/notices');
      if (res.ok) setNotices(await res.json());
    } catch { showToast('Failed to load notices', 'error'); }
  }, [showToast]);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    Promise.all([loadSettings(), loadAbout(), loadProjects(), loadPartners(), loadNotices()])
      .finally(() => setLoading(false));
  }, [isLoggedIn, loadSettings, loadAbout, loadProjects, loadPartners, loadNotices]);

  // ── Seed Database ──
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Database seeded successfully!', 'success');
        await Promise.all([loadSettings(), loadAbout(), loadProjects(), loadPartners(), loadNotices()]);
      } else {
        showToast(`Seed failed: ${data.message}`, 'error');
      }
    } catch {
      showToast('Failed to seed database', 'error');
    }
    setSeeding(false);
  };

  // ── File Upload ──
  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) return data.url;
      showToast('Upload failed', 'error');
      return null;
    } catch {
      showToast('Upload failed', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ── Settings Save ──
  const saveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) showToast('Settings saved!');
      else showToast('Failed to save settings', 'error');
    } catch { showToast('Failed to save settings', 'error'); }
  };

  // ── About Save ──
  const saveAboutSection = async (section: string, data: any) => {
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      if (res.ok) {
        showToast(`${section} updated!`);
        loadAbout();
      } else showToast(`Failed to update ${section}`, 'error');
    } catch { showToast(`Failed to update ${section}`, 'error'); }
  };

  // ── Projects CRUD ──
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim()) { showToast('Fill in all fields', 'error'); return; }
    try {
      if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: projTitle, description: projDesc }),
        });
        if (res.ok) showToast('Project updated!');
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: projTitle, description: projDesc }),
        });
        if (res.ok) showToast('Project created!');
      }
      loadProjects();
      setShowProjectForm(false);
      setEditingProject(null);
      setProjTitle('');
      setProjDesc('');
    } catch { showToast('Operation failed', 'error'); }
  };

  const deleteProject = async (id: number) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      showToast('Project deleted', 'info');
      loadProjects();
    } catch { showToast('Delete failed', 'error'); }
    setDeleteConfirmId(null);
  };

  const addProjectImage = async (projectId: number, file: File) => {
    const url = await uploadFile(file);
    if (!url) return;
    try {
      await fetch(`/api/projects/${projectId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      });
      showToast('Image added!');
      loadProjects();
    } catch { showToast('Failed to add image', 'error'); }
  };

  const removeProjectImage = async (projectId: number, imageId: number) => {
    try {
      await fetch(`/api/projects/${projectId}/images?imageId=${imageId}`, { method: 'DELETE' });
      showToast('Image removed', 'info');
      loadProjects();
    } catch { showToast('Failed to remove image', 'error'); }
  };

  // ── Partners CRUD ──
  const addPartner = async (name: string, file: File) => {
    const url = await uploadFile(file);
    if (!url) return;
    try {
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logo_url: url }),
      });
      showToast('Partner added!');
      loadPartners();
    } catch { showToast('Failed to add partner', 'error'); }
  };

  const deletePartner = async (id: number) => {
    try {
      await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      showToast('Partner removed', 'info');
      loadPartners();
    } catch { showToast('Failed to remove partner', 'error'); }
    setDeleteConfirmId(null);
  };

  // ── Notices CRUD ──
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) { showToast('Fill in all fields', 'error'); return; }
    try {
      if (editingNotice) {
        await fetch(`/api/notices/${editingNotice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: noticeTitle, message: noticeMessage, active: noticeActive }),
        });
        showToast('Notice updated!');
      } else {
        await fetch('/api/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: noticeTitle, message: noticeMessage, active: noticeActive }),
        });
        showToast('Notice created!');
      }
      loadNotices();
      setShowNoticeForm(false);
      setEditingNotice(null);
      setNoticeTitle('');
      setNoticeMessage('');
      setNoticeActive(true);
    } catch { showToast('Operation failed', 'error'); }
  };

  const toggleNoticeActive = async (n: Notice) => {
    try {
      await fetch(`/api/notices/${n.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !n.active }),
      });
      showToast(`Notice ${!n.active ? 'activated' : 'deactivated'}`, !n.active ? 'success' : 'info');
      loadNotices();
    } catch { showToast('Failed to toggle notice', 'error'); }
  };

  const deleteNotice = async (id: number) => {
    try {
      await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      showToast('Notice deleted', 'info');
      loadNotices();
    } catch { showToast('Delete failed', 'error'); }
    setDeleteConfirmId(null);
  };

  // ── About Image Upload Handlers ──
  const handleAboutImageUpload = async (section: string, currentData: any) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = await uploadFile(file);
      if (url) {
        await saveAboutSection(section, { ...currentData, image_url: url });
      }
    };
    input.click();
  };

  // ── Settings Logo Upload ──
  const handleLogoUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = await uploadFile(file);
      if (url) {
        setSettings(prev => ({ ...prev, logo_url: url }));
      }
    };
    input.click();
  };

  // ═══════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-split-left">
          <div className={`admin-login-card ${loginShake ? 'login-shake' : ''}`}>
            <div className="admin-login-logo">
              BlessLife <span className="admin-login-logo-accent">CMS</span>
            </div>
            <div className="admin-login-subtitle">Sign in to manage your premium digital presence.</div>
            
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-field">
                <label htmlFor="admin-username">Username</label>
                <div className="admin-input-wrap">
                  <input id="admin-username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" autoComplete="username" required />
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="admin-password">Password</label>
                <div className="admin-input-wrap">
                  <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required />
                </div>
              </div>
              {loginError && (
                <div className="admin-login-error">
                  {loginError}
                </div>
              )}
              <button type="submit" className="admin-login-btn">
                Authenticate
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </button>
            </form>
            
            <div className="admin-login-back">
              <a href="/">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                Return to Website
              </a>
            </div>
          </div>
        </div>
        <div className="admin-login-split-right">
          <div className="admin-login-art">
            Admin<br/>Login
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // SIDEBAR NAV ITEMS
  // ═══════════════════════════════════════════════
  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'dashboard', label: 'Dashboard',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    },
    {
      key: 'settings', label: 'General Settings',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    },
    {
      key: 'security', label: 'Security Settings',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    },
    {
      key: 'about', label: 'About Section',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
    },
    {
      key: 'projects', label: 'Projects',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    },
    {
      key: 'partners', label: 'Partners & Clients',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
      key: 'notices', label: 'Notices',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    },
  ];

  // ═══════════════════════════════════════════════
  // RENDER SECTIONS
  // ═══════════════════════════════════════════════

  const renderDashboard = () => (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">A high-level view of your digital properties.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-create-btn" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding...' : 'Seed Data'}
          </button>
        </div>
      </header>
      
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{Object.keys(settings).length}</div>
          <div className="admin-stat-label">Settings Configured</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{projects.length}</div>
          <div className="admin-stat-label">Active Projects</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{partners.length}</div>
          <div className="admin-stat-label">Partners & Clients</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{notices.filter(n => n.active).length}</div>
          <div className="admin-stat-label">Active Notices</div>
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-page-title">General Settings</h1>
          <p className="admin-page-subtitle">Manage company information, contact details, and social links</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-create-btn" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </header>
      <div className="admin-form-section">
        <h3 className="admin-section-title">Company Info</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Company Name</label>
            <input type="text" value={settings.company_name || ''} onChange={e => setSettings(p => ({ ...p, company_name: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label>Company Logo</label>
            <div className="admin-logo-upload-row">
              {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="admin-logo-preview" />}
              <button type="button" className="admin-btn-secondary" onClick={handleLogoUpload}>
                {uploading ? 'Uploading...' : 'Change Logo'}
              </button>
            </div>
          </div>
        </div>

        <h3 className="admin-section-title" style={{ marginTop: 32 }}>Contact Information</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Phone</label>
            <input type="text" value={settings.phone || ''} onChange={e => setSettings(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input type="email" value={settings.email || ''} onChange={e => setSettings(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label>Website</label>
            <input type="text" value={settings.website || ''} onChange={e => setSettings(p => ({ ...p, website: e.target.value }))} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <textarea rows={2} value={settings.address || ''} onChange={e => setSettings(p => ({ ...p, address: e.target.value }))} />
          </div>
        </div>

        <h3 className="admin-section-title" style={{ marginTop: 32 }}>Social Links</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Facebook URL</label>
            <input type="text" value={settings.facebook_url || ''} onChange={e => setSettings(p => ({ ...p, facebook_url: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label>LinkedIn URL</label>
            <input type="text" value={settings.linkedin_url || ''} onChange={e => setSettings(p => ({ ...p, linkedin_url: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label>Twitter URL</label>
            <input type="text" value={settings.twitter_url || ''} onChange={e => setSettings(p => ({ ...p, twitter_url: e.target.value }))} />
          </div>
        </div>

        <h3 className="admin-section-title" style={{ marginTop: 32 }}>Registration Details</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Registration Number</label>
            <input type="text" value={settings.reg_number || ''} onChange={e => setSettings(p => ({ ...p, reg_number: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label>Registration Date</label>
            <input type="text" value={settings.reg_date || ''} onChange={e => setSettings(p => ({ ...p, reg_date: e.target.value }))} />
          </div>
        </div>

        <div className="admin-field" style={{ marginTop: 32 }}>
          <label>Footer Description Text</label>
          <textarea rows={3} value={settings.footer_text || ''} onChange={e => setSettings(p => ({ ...p, footer_text: e.target.value }))} />
        </div>
      </div>
    </>
  );

  const renderSecurity = () => (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-page-title">Security Settings</h1>
          <p className="admin-page-subtitle">Update your admin login credentials</p>
        </div>
      </header>
      <div className="admin-form-section">
        <h3 className="admin-section-title" style={{ borderColor: 'var(--admin-danger)' }}>Change Credentials</h3>
        <form onSubmit={handleUpdateAuth} className="admin-form-grid" style={{ maxWidth: '100%', border: '1px solid var(--admin-border)', padding: 24, borderRadius: 8 }}>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Enter current password to authorize changes" />
          </div>
          <div className="admin-field">
            <label>New Username</label>
            <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} required placeholder="Enter new username" />
          </div>
          <div className="admin-field">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1', marginTop: 8 }}>
            <button type="submit" className="admin-btn-submit" disabled={updatingAuth} style={{ width: 'auto' }}>
              {updatingAuth ? 'Updating...' : 'Update Credentials'}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  const renderAbout = () => (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-page-title">About Section</h1>
          <p className="admin-page-subtitle">Manage About Us, Mission, Vision, and Chairman message</p>
        </div>
      </header>

      {/* About Us */}
      <div className="admin-form-section">
        <h3 className="admin-section-title">About Us</h3>
        {aboutData.about && (
          <div className="admin-about-edit-block">
            <div className="admin-field">
              <label>Title</label>
              <input type="text" value={aboutData.about.title} onChange={e => setAboutData(prev => ({ ...prev, about: prev.about ? { ...prev.about, title: e.target.value } : null }))} />
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea rows={4} value={aboutData.about.description} onChange={e => setAboutData(prev => ({ ...prev, about: prev.about ? { ...prev.about, description: e.target.value } : null }))} />
            </div>
            <div className="admin-field">
              <label>Image</label>
              <div className="admin-image-upload-area">
                {aboutData.about.image_url && <img src={aboutData.about.image_url} alt="About" className="admin-preview-img" />}
                <button className="admin-btn-secondary" onClick={() => handleAboutImageUpload('about', aboutData.about)}>
                  {uploading ? 'Uploading...' : 'Change Image'}
                </button>
              </div>
            </div>
            <button className="admin-btn-submit" onClick={() => saveAboutSection('about', aboutData.about)}>Save About</button>
          </div>
        )}
      </div>

      {/* Mission */}
      <div className="admin-form-section">
        <h3 className="admin-section-title">Mission</h3>
        {aboutData.mission && (
          <div className="admin-about-edit-block">
            <div className="admin-field">
              <label>Description</label>
              <textarea rows={4} value={aboutData.mission.description} onChange={e => setAboutData(prev => ({ ...prev, mission: prev.mission ? { ...prev.mission, description: e.target.value } : null }))} />
            </div>
            <div className="admin-field">
              <label>Image</label>
              <div className="admin-image-upload-area">
                {aboutData.mission.image_url && <img src={aboutData.mission.image_url} alt="Mission" className="admin-preview-img" />}
                <button className="admin-btn-secondary" onClick={() => handleAboutImageUpload('mission', aboutData.mission)}>Change Image</button>
              </div>
            </div>
            <button className="admin-btn-submit" onClick={() => saveAboutSection('mission', aboutData.mission)}>Save Mission</button>
          </div>
        )}
      </div>

      {/* Vision */}
      <div className="admin-form-section">
        <h3 className="admin-section-title">Vision</h3>
        {aboutData.vision && (
          <div className="admin-about-edit-block">
            <div className="admin-field">
              <label>Description</label>
              <textarea rows={4} value={aboutData.vision.description} onChange={e => setAboutData(prev => ({ ...prev, vision: prev.vision ? { ...prev.vision, description: e.target.value } : null }))} />
            </div>
            <div className="admin-field">
              <label>Image</label>
              <div className="admin-image-upload-area">
                {aboutData.vision.image_url && <img src={aboutData.vision.image_url} alt="Vision" className="admin-preview-img" />}
                <button className="admin-btn-secondary" onClick={() => handleAboutImageUpload('vision', aboutData.vision)}>Change Image</button>
              </div>
            </div>
            <button className="admin-btn-submit" onClick={() => saveAboutSection('vision', aboutData.vision)}>Save Vision</button>
          </div>
        )}
      </div>

      {/* Chairman */}
      <div className="admin-form-section">
        <h3 className="admin-section-title">Chairman Message</h3>
        {aboutData.chairman && (
          <div className="admin-about-edit-block">
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Name</label>
                <input type="text" value={aboutData.chairman.name} onChange={e => setAboutData(prev => ({ ...prev, chairman: prev.chairman ? { ...prev.chairman, name: e.target.value } : null }))} />
              </div>
              <div className="admin-field">
                <label>Title</label>
                <input type="text" value={aboutData.chairman.title} onChange={e => setAboutData(prev => ({ ...prev, chairman: prev.chairman ? { ...prev.chairman, title: e.target.value } : null }))} />
              </div>
            </div>
            <div className="admin-field">
              <label>Message</label>
              <textarea rows={6} value={aboutData.chairman.message} onChange={e => setAboutData(prev => ({ ...prev, chairman: prev.chairman ? { ...prev.chairman, message: e.target.value } : null }))} />
            </div>
            <div className="admin-field">
              <label>Image</label>
              <div className="admin-image-upload-area">
                {aboutData.chairman.image_url && <img src={aboutData.chairman.image_url} alt="Chairman" className="admin-preview-img" />}
                <button className="admin-btn-secondary" onClick={() => handleAboutImageUpload('chairman', aboutData.chairman)}>Change Image</button>
              </div>
            </div>
            <button className="admin-btn-submit" onClick={() => saveAboutSection('chairman', aboutData.chairman)}>Save Chairman</button>
          </div>
        )}
      </div>
    </>
  );

  const renderProjects = () => (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">Manage project categories and their image galleries</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-create-btn" onClick={() => { setEditingProject(null); setProjTitle(''); setProjDesc(''); setShowProjectForm(true); }}>
            New Project
          </button>
        </div>
      </header>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="admin-form-overlay" onClick={() => setShowProjectForm(false)}>
          <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button className="admin-form-close" onClick={() => setShowProjectForm(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form onSubmit={handleProjectSubmit} className="admin-notice-form">
              <div className="admin-field">
                <label>Title</label>
                <input type="text" value={projTitle} onChange={e => setProjTitle(e.target.value)} placeholder="Project title" required />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea rows={4} value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Project description" required />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowProjectForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-submit">{editingProject ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="admin-projects-list">
        {projects.map(project => (
          <div key={project.id} className="admin-project-card">
            <div className="admin-project-card-header">
              <div>
                <h4>{project.title}</h4>
                <p className="admin-project-card-desc">{project.description}</p>
                <span className="admin-notice-date">{project.images.length} images</span>
              </div>
              <div className="admin-notice-card-actions">
                <button className="admin-action-btn admin-action-edit" onClick={() => { setEditingProject(project); setProjTitle(project.title); setProjDesc(project.description); setShowProjectForm(true); }} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                {deleteConfirmId === `proj-${project.id}` ? (
                  <div className="admin-delete-confirm">
                    <button className="admin-action-btn admin-action-confirm-yes" onClick={() => deleteProject(project.id)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></button>
                    <button className="admin-action-btn admin-action-confirm-no" onClick={() => setDeleteConfirmId(null)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                  </div>
                ) : (
                  <button className="admin-action-btn admin-action-delete" onClick={() => setDeleteConfirmId(`proj-${project.id}`)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                )}
              </div>
            </div>
            {/* Image Gallery */}
            <div className="admin-project-images-grid">
              {project.images.map(img => (
                <div key={img.id} className="admin-project-img-thumb">
                  <img src={img.image_url} alt="" />
                  <button className="admin-img-remove-btn" onClick={() => removeProjectImage(project.id, img.id)} title="Remove image">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
              <label className="admin-add-image-btn">
                <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) addProjectImage(project.id, f); e.target.value = ''; }} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span>Add Image</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderPartners = () => {
    return (
      <>
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">Partners & Clients</h1>
            <p className="admin-page-subtitle">Manage partner and client logos</p>
          </div>
          <div className="admin-header-actions">
            <label className="admin-create-btn" style={{ cursor: 'pointer' }}>
              Add Partner
              <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) { addPartner(partnerName || `Partner ${partners.length + 1}`, f); } e.target.value = ''; }} />
            </label>
          </div>
        </header>
        <div className="admin-partners-grid">
          {partners.map(partner => (
            <div key={partner.id} className="admin-partner-card">
              <img src={partner.logo_url} alt={partner.name} />
              <span className="admin-partner-name">{partner.name}</span>
              {deleteConfirmId === `partner-${partner.id}` ? (
                <div className="admin-delete-confirm" style={{ position: 'absolute', top: 4, right: 4 }}>
                  <button className="admin-action-btn admin-action-confirm-yes" onClick={() => deletePartner(partner.id)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></button>
                  <button className="admin-action-btn admin-action-confirm-no" onClick={() => setDeleteConfirmId(null)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                </div>
              ) : (
                <button className="admin-partner-remove" onClick={() => setDeleteConfirmId(`partner-${partner.id}`)} title="Remove partner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderNotices = () => (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-page-title">Notice Manager</h1>
          <p className="admin-page-subtitle">Create and manage popup notices for your website visitors</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-create-btn" onClick={() => { setEditingNotice(null); setNoticeTitle(''); setNoticeMessage(''); setNoticeActive(true); setShowNoticeForm(true); }}>
            New Notice
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-total"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
          <div><div className="admin-stat-number">{notices.length}</div><div className="admin-stat-label">Total</div></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-active"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
          <div><div className="admin-stat-number">{notices.filter(n => n.active).length}</div><div className="admin-stat-label">Active</div></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-inactive"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg></div>
          <div><div className="admin-stat-number">{notices.filter(n => !n.active).length}</div><div className="admin-stat-label">Inactive</div></div>
        </div>
      </div>

      {/* Notice Form Modal */}
      {showNoticeForm && (
        <div className="admin-form-overlay" onClick={() => setShowNoticeForm(false)}>
          <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingNotice ? 'Edit Notice' : 'New Notice'}</h3>
              <button className="admin-form-close" onClick={() => setShowNoticeForm(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form onSubmit={handleNoticeSubmit} className="admin-notice-form">
              <div className="admin-field">
                <label>Title</label>
                <input type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} placeholder="Notice title" required />
              </div>
              <div className="admin-field">
                <label>Message</label>
                <textarea rows={4} value={noticeMessage} onChange={e => setNoticeMessage(e.target.value)} placeholder="Notice message" required />
              </div>
              <div className="admin-field admin-field-toggle">
                <label>Status</label>
                <div className="admin-toggle-row">
                  <button type="button" className={`admin-toggle ${noticeActive ? 'admin-toggle-on' : ''}`} onClick={() => setNoticeActive(!noticeActive)}>
                    <span className="admin-toggle-knob" />
                  </button>
                  <span className={`admin-toggle-label ${noticeActive ? 'admin-toggle-label-active' : ''}`}>{noticeActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowNoticeForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-submit">{editingNotice ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notices List */}
      <div className="admin-notices-section">
        <h3 className="admin-section-title">All Notices</h3>
        {notices.length === 0 ? (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
            <p>No notices yet.</p>
            <span>Click &quot;New Notice&quot; to create your first popup notice.</span>
          </div>
        ) : (
          <div className="admin-notices-list">
            {notices.map(n => (
              <div className={`admin-notice-card ${n.active ? '' : 'admin-notice-inactive'}`} key={n.id}>
                <div className="admin-notice-card-left">
                  <div className={`admin-notice-status-dot ${n.active ? 'dot-active' : 'dot-inactive'}`} />
                  <div>
                    <h4 className="admin-notice-card-title">{n.title}</h4>
                    <p className="admin-notice-card-msg">{n.message}</p>
                    <div className="admin-notice-card-meta">
                      <span className={`admin-notice-badge ${n.active ? 'badge-active' : 'badge-inactive'}`}>{n.active ? 'Active' : 'Inactive'}</span>
                      <span className="admin-notice-date">{new Date(n.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="admin-notice-card-actions">
                  <button className="admin-action-btn admin-action-toggle" onClick={() => toggleNoticeActive(n)} title={n.active ? 'Deactivate' : 'Activate'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {n.active ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>) : (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>)}
                    </svg>
                  </button>
                  <button className="admin-action-btn admin-action-edit" onClick={() => { setEditingNotice(n); setNoticeTitle(n.title); setNoticeMessage(n.message); setNoticeActive(n.active); setShowNoticeForm(true); }} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  {deleteConfirmId === `notice-${n.id}` ? (
                    <div className="admin-delete-confirm">
                      <button className="admin-action-btn admin-action-confirm-yes" onClick={() => deleteNotice(n.id)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></button>
                      <button className="admin-action-btn admin-action-confirm-no" onClick={() => setDeleteConfirmId(null)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                    </div>
                  ) : (
                    <button className="admin-action-btn admin-action-delete" onClick={() => setDeleteConfirmId(`notice-${n.id}`)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderContent = () => {
    if (loading) return <div className="admin-empty"><p>Loading...</p></div>;
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'settings': return renderSettings();
      case 'security': return renderSecurity();
      case 'about': return renderAbout();
      case 'projects': return renderProjects();
      case 'partners': return renderPartners();
      case 'notices': return renderNotices();
    }
  };

  // ═══════════════════════════════════════════════
  // MAIN DASHBOARD LAYOUT
  // ═══════════════════════════════════════════════
  return (
    <>
      {/* Toast Container */}
      <div className="admin-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`admin-toast admin-toast-${toast.type}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {toast.type === 'success' && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>}
              {toast.type === 'error' && <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>}
              {toast.type === 'info' && <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>}
            </svg>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="admin-page">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'admin-sidebar-open' : ''}`}>
          <div className="admin-sidebar-brand">
            BlessLife <span style={{ fontStyle: 'italic', marginLeft: '6px' }}>CMS</span>
          </div>

          <nav className="admin-sidebar-nav">
            <div className="admin-sidebar-label">Navigation</div>
            {navItems.map(item => (
              <button
                key={item.key}
                className={`admin-sidebar-link ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(item.key); setMobileMenuOpen(false); }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="admin-sidebar-label">External</div>
            <a className="admin-sidebar-link" href="/" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              View Website
            </a>
          </nav>

          <div className="admin-sidebar-bottom">
            <button className="admin-logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Logout Session
            </button>
          </div>
        </aside>

        {/* Mobile menu toggle */}
        <button className="admin-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>

        {/* Mobile overlay */}
        {mobileMenuOpen && <div className="admin-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

        {/* MAIN CONTENT */}
        <main className="admin-main">
          {renderContent()}
        </main>
      </div>
    </>
  );
}
