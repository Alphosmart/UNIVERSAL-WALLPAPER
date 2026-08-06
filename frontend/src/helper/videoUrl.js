const getYouTubeId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || null;
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(parts[0])) return parts[1] || null;
    }
  } catch (_) {}
  return null;
};

const getVimeoId = (url) => {
  try {
    const parsed = new URL(url);
    if (!/(^|\.)vimeo\.com$/.test(parsed.hostname)) return null;
    return parsed.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part)) || null;
  } catch (_) {
    return null;
  }
};

export const resolveVideoUrl = (url = '') => {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0`
    };
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return {
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`
    };
  }

  return { provider: 'direct', src: url };
};

export const isEmbeddedVideo = (url) => resolveVideoUrl(url).provider !== 'direct';
