import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <main className="box-border px-8 md:px-[120px] py-24 flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1d] leading-tight tracking-tight animate-floating drop-shadow-md">
          Designing Logic. <br /> Coding Magic.
        </h1>
        
        <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          I turn complex problems into pixel-perfect digital experiences. No fluff, just clean code and intuitive design.
        </p>
      </main>
    </div>
  );
};

export default Home;