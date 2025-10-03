import React, { useEffect, useMemo, useState } from 'react';

function extractYouTubeId(input) {
  if (!input) return null;
  try {
    if (!/^https?:\/\//i.test(input)) return input.trim();
    const u = new URL(input);
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/\/(embed|shorts)\/([^/?#]+)/i);
      if (m && m[2]) return m[2];
    }
    if (u.hostname.includes('youtu.be')) {
      const seg = u.pathname.split('/').filter(Boolean);
      if (seg[0]) return seg[0];
    }
    return null;
  } catch {
    return input;
  }
}

export default function CutsceneOverlay({ videoId, onClose, seconds = 10, startAt = 0 }) {
  const id = useMemo(() => extractYouTubeId(videoId), [videoId]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!id) return;
    setMounted(true);
    const t = setTimeout(() => onClose?.(), seconds * 1000);
    const onKey = e => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [id, seconds, onClose]);

  if (!id || !mounted) return null;

  const url =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1` +
    `&start=${startAt}&end=${startAt + seconds}&mute=1`;

  const wrap = { position: 'fixed', inset: 0, background: 'black', zIndex: 9999,
                 display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const frameWrap = { position: 'relative', width: '100%', height: '100%' };
  const iframeStyle = { width: '100%', height: '100%', border: 0 };
  const coverStyle = { position: 'absolute', inset: 0, cursor: 'pointer', background: 'transparent', pointerEvents: 'auto' };

  return (
    <div style={wrap}>
      <div style={frameWrap}>
        <iframe
          title="Cutscene"
          src={url}
          style={iframeStyle}
          allow="autoplay; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div style={coverStyle} onClick={onClose} />
      </div>
    </div>
  );
}
