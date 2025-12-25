// HEAVY/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";

// If you have a header/navigation component, keep it imported
import HeaderNav from "@/components/HeaderNav";
import VibesAlbum from "@/components/VibesAlbum";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Optional site-wide header */}
      <HeaderNav />

      {/* Render the current page */}
      <Component {...pageProps} />

      {/* Background audio, always loaded */}
      <VibesAlbum />
    </>
  );
}
