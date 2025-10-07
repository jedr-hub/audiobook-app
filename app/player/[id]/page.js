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
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // ✅ ระดับเสียงเริ่มต้น 100%

  // ดึงข้อมูล audiobook จาก Firestore
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

  // ตั้งค่าเครื่องเล่นเสียง
  useEffect(() => {
    if (!book?.audioURL) return;
    const audioEl = new Audio(book.audioURL);
    audioEl.volume = volume;
    setAudio(audioEl);

    const updateProgress = () => {
      setCurrentTime(audioEl.currentTime);
      setDuration(audioEl.duration);
      setProgress((audioEl.currentTime / audioEl.duration) * 100);
    };

    audioEl.addEventListener("timeupdate", updateProgress);

    return () => {
      audioEl.pause();
      audioEl.removeEventListener("timeupdate", updateProgress);
      setAudio(null);
    };
  }, [book]);

  // ✅ ปุ่มเพิ่ม/ลดเสียง
  const handleVolumeChange = (delta) => {
    if (!audio) return;
    const newVolume = Math.min(Math.max(audio.volume + delta, 0), 1); // จำกัด 0-1
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  // ปุ่ม Play / Pause
  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // แปลงเวลาเป็นนาที:วินาที
  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // กรณีโหลดข้อมูลอยู่
  if (!book) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-neutral-950 text-gray-400">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative">
      {/* ปุ่มกลับหน้า Home */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-400 hover:text-green-400 transition"
      >
        ← Back
      </button>

      {/* ปกและชื่อเรื่อง */}
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

        <h1 className="text-2xl font-bold mb-2">{book.title}</h1>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="w-full bg-neutral-800 h-2 rounded-full mb-4">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* ปุ่มควบคุม */}
          <div className="flex justify-center gap-6 mb-4">
            <button
              onClick={togglePlay}
              className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-semibold text-lg"
            >
              {isPlaying ? "⏸ Pause" : "▶️ Play"}
            </button>
          </div>

          {/* ✅ ปุ่มลด/เพิ่มเสียง */}
          <div className="flex justify-center items-center gap-4 mt-2">
            <button
              onClick={() => handleVolumeChange(-0.1)}
              className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg"
            >
              🔉 ลดเสียง
            </button>
            <span className="text-sm text-gray-400">{Math.round(volume * 100)}%</span>
            <button
              onClick={() => handleVolumeChange(0.1)}
              className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg"
            >
              🔊 เพิ่มเสียง
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
