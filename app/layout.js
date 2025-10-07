import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "My Audiobook Space",
  description: "Audiobook platform created with Next.js + Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        {/* ✅ Navigation Bar */}
        <nav className="bg-neutral-900 border-b border-neutral-800 px-6 py-3 flex justify-between items-center shadow-lg sticky top-0 z-50">
          <h1 className="text-xl font-bold text-green-400">
            🎧 My Audiobook
          </h1>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-green-400 transition-colors">
              🏠 Home
            </Link>
            <Link href="/upload" className="hover:text-green-400 transition-colors">
              ⬆️ Upload
            </Link>
          </div>
        </nav>

        {/* ✅ Page Content */}
        <main className="min-h-screen">{children}</main>

        {/* ✅ Footer */}
        <footer className="text-center text-gray-500 text-sm py-6 border-t border-neutral-800">
          © {new Date().getFullYear()} My Audiobook — built with Next.js + Firebase
        </footer>
      </body>
    </html>
  );
}
