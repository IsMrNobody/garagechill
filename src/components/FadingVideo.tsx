import React, { useEffect, useRef } from 'react';

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafId = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const fadeTo = (targetOpacity: number, duration: number) => {
    if (!videoRef.current) return;
    
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const startOpacity = parseFloat(videoRef.current.style.opacity) || 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (videoRef.current) {
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        videoRef.current.style.opacity = currentOpacity.toString();
      }

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
  };

  const handleLoadedData = () => {
    if (!videoRef.current) return;
    videoRef.current.style.opacity = '0';
    videoRef.current.play();
    fadeTo(1, FADE_MS);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || fadingOutRef.current) return;
    
    const remaining = videoRef.current.duration - videoRef.current.currentTime;
    if (remaining <= FADE_OUT_LEAD && remaining > 0) {
      fadingOutRef.current = true;
      fadeTo(0, FADE_MS);
    }
  };

  const handleEnded = () => {
    if (!videoRef.current) return;
    videoRef.current.style.opacity = '0';
    
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        fadingOutRef.current = false;
        fadeTo(1, FADE_MS);
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, opacity: 0 }}
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
