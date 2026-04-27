import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

interface ScrollVideoProps {
  src: string;
  className?: string;
  style?: any; // Allow motion values
}

export default function ScrollVideo({ src, className, style }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();

  // Map scroll progress (0-1) to video duration
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      videoRef.current.currentTime = latest * videoRef.current.duration;
    }
  });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <motion.video
      ref={videoRef}
      src={src}
      className={className}
      style={style}
      muted
      playsInline
      preload="auto"
    />
  );
}
