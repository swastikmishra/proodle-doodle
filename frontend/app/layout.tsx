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

async function getCurrentRate(){
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/current-rate`)
    .then(res => res.json())
    .then(res => {
        if(res.status)
            return res.response.data
    })
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const CURRENT_RATE = await getCurrentRate()
  return (
    <html className={`${inter.variable} ${rubik.variable} dark`} lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
	<Script id="show-banner" strategy="beforeInteractive">
		{`const CURRENT_RATE = "${CURRENT_RATE}";
		  const API_URL="${process.env.NEXT_PUBLIC_API_URL}";`}
	</Script>
        <Script src="/theme.js"  strategy="beforeInteractive"></Script>
        <Script src="/currentRate.js"  strategy="beforeInteractive"></Script>
      </head>
      <body className="bg-gray-100 dark:bg-gray-700 pt-12">
        <Header />
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
