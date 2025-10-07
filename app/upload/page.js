"use client";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!title || !audioFile) {
      alert("กรุณาใส่ชื่อเรื่องและเลือกไฟล์เสียงก่อน!");
      return;
    }

    setUploading(true);
    try {
      // Upload cover (optional)
      let coverURL = "";
      if (coverFile) {
        const coverRef = ref(storage, `covers/${Date.now()}-${coverFile.name}`);
        const coverTask = uploadBytesResumable(coverRef, coverFile);
        await new Promise((resolve, reject) => {
          coverTask.on(
            "state_changed",
            null,
            reject,
            async () => {
              coverURL = await getDownloadURL(coverRef);
              resolve();
            }
          );
        });
      }

      // Upload audio
      const audioRef = ref(storage, `audios/${Date.now()}-${audioFile.name}`);
      const uploadTask = uploadBytesResumable(audioRef, audioFile);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(pct);
          },
          reject,
          async () => {
            const audioURL = await getDownloadURL(audioRef);

            // Save info to Firestore
            await addDoc(collection(db, "audiobooks"), {
              title,
              audioURL,
              coverPreview: coverURL,
              createdAt: serverTimestamp(),
            });

            alert("✅ Upload สำเร็จ!");
            setTitle("");
            setAudioFile(null);
            setCoverFile(null);
            setProgress(0);
            setUploading(false);
            resolve();
          }
        );
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ เกิดข้อผิดพลาดในการอัปโหลด");
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">⬆️ Upload Audiobook</h1>

      <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="ชื่อเรื่อง..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-neutral-800 text-white focus:outline-none"
        />

        <label className="block text-sm text-gray-400 mt-2">
          📘 ปก (ไม่บังคับ)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
          className="w-full p-2 bg-neutral-800 rounded-lg text-gray-300"
        />

        <label className="block text-sm text-gray-400 mt-2">
          🎧 ไฟล์เสียง (.mp3)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
          className="w-full p-2 bg-neutral-800 rounded-lg text-gray-300"
        />

        {uploading ? (
          <div className="text-center">
            <p>กำลังอัปโหลด... {Math.round(progress)}%</p>
            <div className="w-full bg-neutral-800 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleUpload}
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-semibold mt-4"
          >
            ⬆️ อัปโหลด
          </button>
        )}
      </div>
    </main>
  );
}
