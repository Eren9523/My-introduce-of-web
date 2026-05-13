import { Navbar } from './Navbar';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Footer from './Footer';

export default function PortfolioHome() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
      </main>
      <Footer />
    </>
  );
}
