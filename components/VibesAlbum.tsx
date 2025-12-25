import React, { useEffect, useRef } from "react";

export default function VibesAlbum() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // silently ignore if playback fails
        });
      }
      // remove listener after first click
      document.removeEventListener("click", handleFirstClick);
    };

    // attach listener
    document.addEventListener("click", handleFirstClick);

    return () => {
      document.removeEventListener("click", handleFirstClick);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/heavy_loop.mp3"   // ensure file is at HEAVY/public/heavy_loop.mp3
      loop
    />
  );
}
