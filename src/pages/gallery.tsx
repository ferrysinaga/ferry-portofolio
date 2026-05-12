import Navbar from '../components/Navbar';

const Gallery = () => {
  // Array sementara untuk menampung gambar. Nanti Anda bisa import gambar asli Anda di sini.
  const dummyPhotos = [
    "https://placehold.co/600x600/1d1d1d/white?text=Photo+1",
    "https://placehold.co/600x600/1d1d1d/white?text=Photo+2",
    "https://placehold.co/600x600/1d1d1d/white?text=Photo+3",
    "https://placehold.co/600x600/1d1d1d/white?text=Photo+4",
    "https://placehold.co/600x600/1d1d1d/white?text=Photo+5",
    "https://placehold.co/600x600/1d1d1d/white?text=Photo+6",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="box-border px-8 md:px-[120px] py-10 animate-fade-in-up">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating drop-shadow-md"
          style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.25em' }}
        >
          GALLERY
        </h1>
        
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          A showcase of my photography and visual captures. These are some moments I've collected.
        </p>

        {/* Grid Galeri */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {dummyPhotos.map((photo, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer bg-gray-100">
              <img 
                src={photo} 
                alt={`Gallery item ${index + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gallery;