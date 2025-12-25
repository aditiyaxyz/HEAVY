import type { AppProps } from "next/app";
import HeaderNav from "@/components/HeaderNav";
import VibesAlbum from "@/components/VibesAlbum";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderNav />
      <Component {...pageProps} />
      <VibesAlbum />
    </>
  );
}
