"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import Link from "next/link";

export default function HomePage() {
  const [audiobooks, setAudiobooks] = useState([]);

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const q = query(collection(db, "audiobooks"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAudiobooks(items);
      } catch (error) {
        console.error("🔥 Error fetching audiobooks:", error);
      }
    };
    fetchAudiobooks();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎧 My Audiobooks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {audiobooks.length > 0 ? (
          audiobooks.map(book => (
            <div key={book.id} className="bg-neutral-900 p-4 rounded-xl hover:bg-neutral-800 transition-all">
              <img
                src={book.coverPreview || "/default-cover.png"}
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
              <Link
                href={`/player/${book.id}`}
                className="text-green-400 hover:underline"
              >
                ▶️ Listen
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">ยังไม่มีหนังสือเสียง</p>
        )}
      </div>
    </main>
  );
}
