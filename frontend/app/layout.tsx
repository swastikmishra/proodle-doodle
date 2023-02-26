import "./css/globals.css";
import { Inter, Rubik } from "@next/font/google";
import Script from "next/script";
import Header from "./components/header";
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
export const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${rubik.variable} dark`} lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        <Script src="/theme.js"></Script>
      </head>
      <body className="bg-gray-100 dark:bg-gray-700 pt-12">
        <Header />
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
