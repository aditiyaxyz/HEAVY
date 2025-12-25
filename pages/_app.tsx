import type { AppProps } from "next/app";
import HeaderNav from "@/components/HeaderNav";
import VibesAlbum from "@/components/VibesAlbum"; // 👈 import the floating album
import "../styles/globals.css"; // keep your global styles

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 👇 Global header */}
      <HeaderNav />

      {/* Page content */}
      <Component {...pageProps} />

      {/* 👇 Global floating translucent album */}
      <VibesAlbum />
    </>
  );
}
