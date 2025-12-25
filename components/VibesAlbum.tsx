import React from "react";

export default function VibesAlbum() {
  return (
    <audio
      src="/heavy_loop.mp3"   // make sure the file is at HEAVY/public/heavy_loop.mp3
      autoPlay
      loop
    />
  );
}
