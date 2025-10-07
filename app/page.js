export default function Home() {
  const audiobooks = [
    {
      title: "Echoes of Dawn",
      narrator: "CK C",
      cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      title: "Whispering Winds",
      narrator: "CK C",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">🎧 My Audiobook Space</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {audiobooks.map((book, index) => (
          <div key={index} className="bg-neutral-900 rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform">
            <img src={book.cover} alt={book.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-400 text-sm mb-3">Narrated by {book.narrator}</p>
              <audio controls className="w-full mt-2">
                <source src={book.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
