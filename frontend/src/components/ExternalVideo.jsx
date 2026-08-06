import React from 'react';
import { resolveVideoUrl } from '../helper/videoUrl';

const ExternalVideo = ({ src, poster, className = '', videoRef, isPlaying = true, onEnded, onError, controls = false, title = 'Hero video' }) => {
  const source = resolveVideoUrl(src);

  if (source.provider !== 'direct') {
    const embedUrl = source.embedUrl.replace('autoplay=1', `autoplay=${isPlaying ? '1' : '0'}`);
    return (
      <iframe
        key={embedUrl}
        src={embedUrl}
        title={title}
        className={className}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      poster={poster}
      className={className}
      muted
      playsInline
      autoPlay={isPlaying}
      controls={controls}
      onEnded={onEnded}
      onError={onError}
    />
  );
};

export default ExternalVideo;
