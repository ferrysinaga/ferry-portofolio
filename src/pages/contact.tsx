import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="box-border px-8 md:px-[120px] py-10">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating"
          style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.25em' }}
        >
          CONTACT
        </h1>
        
        <div className="mt-12 flex flex-col md:flex-row gap-16 items-start">
          {/* Bagian Informasi Kontak (Kiri) */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <p className="text-gray-600 text-lg leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out to me!
            </p>
            <div className="flex flex-col gap-4 mt-4" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#1d1d1d] w-24">Email:</span>
                <a href="mailto:ferrysinaga61@gmail.com" className="text-gray-500 hover:text-[#1d1d1d] transition-colors">ferrysinaga61@gmail.com</a>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#1d1d1d] w-24">Phone:</span>
                <a href="tel:+6285156969820" className="text-gray-500 hover:text-[#1d1d1d] transition-colors">+62 -</a>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#1d1d1d] w-24">Location:</span>
                <span className="text-gray-500">West Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Bagian Form Isian (Kanan) */}
          <div className="md:w-1/2 w-full">
            <form className="flex flex-col gap-6" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[#1d1d1d] font-bold">Name</label>
                <input type="text" id="name" placeholder="Your Name" className="border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[#1d1d1d] transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#1d1d1d] font-bold">Email</label>
                <input type="email" id="email" placeholder="Your Email" className="border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[#1d1d1d] transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[#1d1d1d] font-bold">Message</label>
                <textarea id="message" rows={5} placeholder="Your Message" className="border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[#1d1d1d] transition-colors"></textarea>
              </div>
              <button type="submit" className="mt-2 px-8 py-3 bg-[#1d1d1d] text-white font-bold rounded-sm hover:bg-gray-800 transition-colors duration-300 self-start">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;