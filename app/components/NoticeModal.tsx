'use client';
import React, { useState, useEffect } from 'react';

interface Notice {
  id: string;
  title: string;
  message: string;
  active: boolean;
  createdAt: string;
}

export default function NoticeModal() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/notices');
        if (!res.ok) return;
        const notices: Notice[] = await res.json();
        
        if (!notices || notices.length === 0) return;

        // Get the latest active notice
        const activeNotices = notices.filter((n: Notice) => n.active);
        if (activeNotices.length === 0) return;

        const latestNotice = activeNotices[0];

        // Check if this notice was already dismissed (per notice ID in localStorage)
        const dismissedKey = `blesslife_notice_dismissed_${latestNotice.id}`;
        if (localStorage.getItem(dismissedKey)) return;

        setNotice(latestNotice);
        // Small delay for DOM paint then trigger animation
        requestAnimationFrame(() => {
          setVisible(true);
        });
      } catch {
        // Silently fail if API or localStorage is unavailable
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    if (notice) {
      localStorage.setItem(`blesslife_notice_dismissed_${notice.id}`, 'true');
    }
    setTimeout(() => {
      setNotice(null);
      setVisible(false);
      setClosing(false);
    }, 400);
  };

  if (!notice) return null;

  return (
    <div
      className={`notice-overlay ${visible && !closing ? 'notice-visible' : ''} ${closing ? 'notice-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`notice-modal ${visible && !closing ? 'notice-modal-visible' : ''} ${closing ? 'notice-modal-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── HEADER ─── */}
        <div className="notice-header">
          <h3 className="notice-title">{notice.title}</h3>
          <button className="notice-x-btn" onClick={handleClose} aria-label="Close notice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ─── BODY ─── */}
        <div className="notice-body">
          <p className="notice-message">{notice.message}</p>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="notice-footer">
          <span className="notice-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {new Date(notice.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <button className="notice-close-btn" onClick={handleClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

