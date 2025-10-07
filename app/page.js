"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export default function HomePage() {
  const [audiobooks, setAudiobooks] = useState([]);

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const q = query(collection(db, "audiobooks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAudiobooks(items);
      } catch (error) {
        console.error("Error fetching audiobooks:", error);
      }
    };
    fetchAudiobooks();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📚 My Audiobook Library
      </h1>

      {audiobooks.length === 0 ? (
        <p className="text-center text-gray-400">ยังไม่มีหนังสือเสียงในระบบ</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {audiobooks.map((book) => (
            <div
              key={book.id}
              className="bg-neutral-900 rounded-2xl p-4 flex flex-col items-center shadow-lg hover:scale-105 transition-transform"
            >
              {book.coverPreview ? (
                <img
                  src={book.coverPreview}
                  alt={book.title}
                  className="w-40 h-40 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-40 h-40 bg-neutral-800 flex items-center justify-center text-gray-500 rounded-xl mb-4">
                  No Cover
                </div>
              )}

              <h2 className="text-lg font-semibold text-center mb-3">
                {book.title}
              </h2>

              {book.audioURL && (
                <a
                  href={`/player/${book.id}`}
                  className="mt-3 inline-block bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
                >
                  🎧 Listen
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
