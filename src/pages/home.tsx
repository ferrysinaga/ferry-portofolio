import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <main className="box-border px-[120px] py-24 flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1d] leading-tight tracking-tight">
          Crafting Intuitive <br /> Digital Experiences.
        </h1>
        
        <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          Where logic meets creativity. I combine my Computer Science background with a passion for UI/UX and Web Development to build solutions that are both beautiful and highly functional.
        </p>
      </main>
    </div>
  );
};

export default Home;