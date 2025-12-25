import React, { useRef, useState } from "react";

export default function VibesAlbum() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      // Optional: toast or UI hint on play failure
    }
  };

  return (
    <>
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause vibes" : "Play vibes"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "20px",
          color: "#fff",
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          zIndex: 1000,
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
        onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isPlaying ? "PAUSE" : "VIBES"}
      </button>

      <audio ref={audioRef} src="/heavy_loop.mp3" preload="auto" loop />
    </>
  );
}
