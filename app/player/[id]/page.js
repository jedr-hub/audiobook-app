"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function PlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      const docRef = doc(db, "audiobooks", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBook(docSnap.data());
      } else {
        router.push("/");
      }
    };
    fetchBook();
  }, [id, router]);

  // ควบคุมเครื่องเล่นเสียง
  useEffect(() => {
    if (!book?.audioURL) return;
    const audioEl = new Audio(book.audioURL);
    setAudio(audioEl);

    audioEl.addEventListener("timeupdate", () => {
      setProgress((audioEl.currentTime / audioEl.duration) * 100);
    });

    return () => {
      audioEl.pause();
      audioEl.remove();
    };
  }, [book]);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!book) {
    return (
      <main className="flex justify-center items-center min-h-screen text-gray-400">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-400 hover:text-green-400 transition"
      >
        ← Back
      </button>

      <div className="text-center">
        {book.coverPreview ? (
          <img
            src={book.coverPreview}
            alt={book.title}
            className="w-64 h-64 object-cover rounded-2xl mx-auto mb-6 shadow-xl"
          />
        ) : (
          <div className="w-64 h-64 bg-neutral-800 flex items-center justify-center rounded-2xl mb-6">
            No Cover
          </div>
        )}
        <h1 className="text-2xl font-bold mb-3">{book.title}</h1>
        <div className="w-full max-w-md mx-auto">
          <div className="w-full bg-neutral-800 h-2 rounded-full mb-4">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button
            onClick={togglePlay}
            className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-semibold"
          >
            {isPlaying ? "⏸ Pause" : "▶️ Play"}
          </button>
        </div>
      </div>
    </main>
  );
}
