import React from 'react';
import Hero from './components/Hero';
import WhyHireMe from './components/WhyHireMe';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <WhyHireMe />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
