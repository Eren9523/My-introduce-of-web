import { Navbar } from './Navbar';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import CampusAwards from './CampusAwards';
import Footer from './Footer';
import LifeStyle from './LifeStyle';
import { SupportModule } from './SupportModule';

export default function PortfolioHome() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <CampusAwards />
        <LifeStyle />
        <SupportModule />
      </main>
      <Footer />
    </>
  );
}
