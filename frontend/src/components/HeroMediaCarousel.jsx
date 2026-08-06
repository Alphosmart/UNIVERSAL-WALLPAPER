import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import SummaryApi from '../common';
import ExternalVideo from './ExternalVideo';

export const DEFAULT_HERO_SLIDES = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&h=1000&fit=crop',
    alt: 'Warm contemporary living room with a statement wall',
    label: 'Rooms with character',
    isActive: true
  },
  {
    type: 'video',
    src: 'https://videos.pexels.com/video-files/7578552/7578552-hd_1920_1080_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&h=1000&fit=crop',
    alt: 'A refined modern interior',
    label: 'See design come alive',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&h=1000&fit=crop',
    alt: 'Elegant interior with patterned wall covering',
    label: 'Made for your style',
    isActive: true
  }
];

const HeroMediaCarousel = ({ slides, children }) => {
  const [managedSlides, setManagedSlides] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(SummaryApi.getBanners.url, { method: SummaryApi.getBanners.method })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!isMounted || !result?.success || !result.data?.length) return;
        setManagedSlides(result.data.map((banner) => ({
          type: banner.mediaType || 'image',
          src: banner.mediaType === 'video' ? banner.videoUrl : banner.desktopImage,
          poster: banner.desktopImage || '',
          alt: banner.description || banner.title,
          label: banner.title,
          isActive: banner.isActive
        })));
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const carouselSlides = useMemo(() => {
    const sourceSlides = managedSlides || slides;
    const visibleSlides = (Array.isArray(sourceSlides) ? sourceSlides : DEFAULT_HERO_SLIDES)
      .filter((slide) => slide?.src && slide.isActive !== false);
    return visibleSlides.length ? visibleSlides : DEFAULT_HERO_SLIDES;
  }, [managedSlides, slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const showSlide = useCallback((index) => {
    setActiveIndex((index + carouselSlides.length) % carouselSlides.length);
  }, [carouselSlides.length]);

  useEffect(() => {
    if (activeIndex >= carouselSlides.length) setActiveIndex(0);
  }, [activeIndex, carouselSlides.length]);

  useEffect(() => {
    if (!isPlaying || carouselSlides.length < 2) return undefined;
    const timer = window.setTimeout(() => showSlide(activeIndex + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, carouselSlides, isPlaying, showSlide]);

  useEffect(() => {
    if (carouselSlides[activeIndex]?.type !== 'video' || !videoRef.current) return;
    if (isPlaying) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [activeIndex, carouselSlides, isPlaying]);

  const activeSlide = carouselSlides[activeIndex];

  return (
    <section className="relative flex min-h-[680px] items-center overflow-hidden bg-slate-950 text-white lg:min-h-[760px]" aria-roledescription="carousel" aria-label="Featured interiors">
      <div className="absolute inset-0">
        {activeSlide.type === 'video' ? (
          <ExternalVideo
            videoRef={videoRef}
            src={activeSlide.src}
            poster={activeSlide.poster}
            className="h-full w-full object-cover"
            isPlaying={isPlaying}
            onEnded={() => showSlide(activeIndex + 1)}
            onError={() => showSlide(activeIndex + 1)}
            title={activeSlide.alt || activeSlide.label || 'Featured video'}
          />
        ) : (
          <img key={activeSlide.src} src={activeSlide.src} alt={activeSlide.alt || activeSlide.label || 'Featured interior'} className="h-full w-full object-cover" onError={() => showSlide(activeIndex + 1)} />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/20" />

      <div className="relative z-10 w-full">{children}</div>

      {carouselSlides.length > 1 && (
        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-md">
          <button type="button" onClick={() => showSlide(activeIndex - 1)} className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Previous hero slide"><FaChevronLeft size={13} /></button>
          <div className="flex items-center gap-2" aria-label="Choose hero slide">
            {carouselSlides.map((slide, index) => (
              <button key={`${slide.src}-${index}`} type="button" onClick={() => showSlide(index)} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'}`} aria-label={`Go to hero slide ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} />
            ))}
          </div>
          <button type="button" onClick={() => setIsPlaying((value) => !value)} className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white" aria-label={isPlaying ? 'Pause hero carousel' : 'Play hero carousel'}>{isPlaying ? <FaPause size={11} /> : <FaPlay size={11} />}</button>
          <button type="button" onClick={() => showSlide(activeIndex + 1)} className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Next hero slide"><FaChevronRight size={13} /></button>
        </div>
      )}

      {activeSlide.label && <p className="absolute bottom-8 right-6 z-10 hidden text-xs font-semibold uppercase tracking-[0.22em] text-white/75 md:block">{activeSlide.label}</p>}
    </section>
  );
};

export default HeroMediaCarousel;
