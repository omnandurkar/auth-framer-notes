import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkShift Notes | Om Nandurkar",
  description: "LinkShift Notes by Om Nandurkar: Your hub for organized and secure note-taking.",
  keywords: "LinkShift Notes, Notes Om Nandurkar, Om Nandurkar Notes, Link Shift Notes, Om Nandurkar",
  openGraph: {
    type: 'website',
    url: 'https://notes.omnandurkar.me',
    title: 'LinkShift Notes | Om Nandurkar',
    description: 'Manage and organize your notes with LinkShift Notes by Om Nandurkar.',
    site_name: 'LinkShift Notes',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>

        <meta property="og:title" content="LinkShift Notes | Om Nandurkar" />
        <meta property="og:description" content="Organize and manage your notes with ease." />
        <meta property="og:url" content="https://notes.omnandurkar.me" />
        <meta property="og:image" content="https://www.omnandurkar.me/assets/Om_Full-DcqC-Wg5.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LinkShift Notes | Om Nandurkar" />
        <meta name="twitter:description" content="Notes by Om Nandurkar" />
        <meta name="twitter:image" content="https://www.omnandurkar.me/assets/Om_Full-DcqC-Wg5.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://notes.omnandurkar.me" />

      </head>

      <body className={inter.className}>
        {children}
      </body>

    </html>
  );
}
